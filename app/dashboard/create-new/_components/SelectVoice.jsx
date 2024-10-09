"use client";
import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./CustomLoading";
import { db } from "configs/db";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { Users, Voices } from "configs/schema";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/FierbaseConfig";

function SelectVoice({ onUserSelect }) {
  const defaultText = "Hello! This is a test of the voice generation feature."; // Default text
  const maxCharacters = 100; // Maximum character limit
  const [selectedOption, setSelectedOption] = useState("Default Text"); // State for selecting text option
  const [customText, setCustomText] = useState(defaultText); // State for custom text input
  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); // Default language
  const [selectedGender, setSelectedGender] = useState("NEUTRAL"); // Default gender
  const [audioUrl, setAudioUrl] = useState(null); // State to hold audio URL
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false); // State to indicate if voice is being generated
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();
  // Handle form submission
  const handleSubmit = async () => {
    setIsGeneratingVoice(true);
    const textToConvert =
      selectedOption === "Custom Text" || "Custom Prompt" ? customText : defaultText;

    if (!textToConvert) return;

    try {
      // Call API to convert the text to speech with selected language and gender
      const response = await axios.post("/api/generate-audio", {
        text: textToConvert,
        languageCode: selectedLanguage,
        ssmlGender: selectedGender,
      });
      // Get the first two words of the text for the title
      const title = textToConvert.split(" ").slice(0, 5).join(" ");

      const audioUrl = response?.data?.result; // Get the URL from the response
      setAudioUrl(audioUrl); // Set the audio URL in state
      await db.insert(Voices).values({
        userId: user?.id,
        audioUrl: audioUrl,
        language: selectedLanguage || null, // Save selected language or null
        gender: selectedGender || null, // Save selected grandeur or null
        voiceTitle: title || null, // Save the title if you add it to your schema
      });

      await updateUserCredits();
      setIsGeneratingVoice(false);
      toast.success("Voice generated successfully!");
      // Update user credits
      await updateUserCredits();
      setIsGeneratingVoice(false);
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsGeneratingVoice(false);
    }
  };

  // Function to update user credits
  const updateUserCredits = async () => {
    if (userDetail?.credits <= 0) {
      toast("Insufficient credits"); // Optionally handle the case of insufficient credits
      return; // Exit if no credits are available
    }

    try {
      const result = await db
        .update(Users)
        .set({ credits: userDetail.credits - 1 }) // Deduct 1 credit for each generation
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress)); // Update based on user's email

      console.log("Credits updated:", result);

      // Update user details in local state
      setUserDetail((prev) => ({
        ...prev,
        credits: prev.credits - 1,
      }));
    } catch (error) {
      console.error("Error updating user credits:", error);
    }
  };
  // List of available languages
  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Spanish (Spain)" },
    { code: "es-MX", label: "Spanish (Mexico)" },
    { code: "fr-FR", label: "French" },
    { code: "de-DE", label: "German" },
    { code: "it-IT", label: "Italian" },
    { code: "pt-PT", label: "Portuguese (Portugal)" },
    { code: "pt-BR", label: "Portuguese (Brazil)" },
    { code: "ru-RU", label: "Russian" },
    { code: "ja-JP", label: "Japanese" },
    { code: "ko-KR", label: "Korean" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
    { code: "zh-TW", label: "Chinese (Traditional)" },
    { code: "ar-SA", label: "Arabic (Saudi Arabia)" },
    { code: "hi-IN", label: "Hindi" },
    { code: "tr-TR", label: "Turkish" },
    { code: "nl-NL", label: "Dutch" },
    { code: "sv-SE", label: "Swedish" },
    { code: "da-DK", label: "Danish" },
    { code: "fi-FI", label: "Finnish" },
    { code: "no-NO", label: "Norwegian" },
    { code: "pl-PL", label: "Polish" },
    { code: "cs-CZ", label: "Czech" },
    { code: "ro-RO", label: "Romanian" },
    { code: "th-TH", label: "Thai" },
    { code: "vi-VN", label: "Vietnamese" },
    // Add more languages as needed
  ];
  // List of available voice genders
  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "NEUTRAL", label: "Neutral" },
  ];

  return (
    <div>
      {/* Text Option Selection */}
      <h2 className="font-bold text-xl text-primary my-5">
        Voice generation feature
      </h2>
      <p className="text-gray-400 mt-5">
        the testing voice generation feature takes 1 credit for each generation.
      </p>
      <h2 className="font-bold text-lg text-primary my-5">
        Select Text Option
      </h2>
      <div className="my-3">
        <Select onValueChange={setSelectedOption}>
          <SelectTrigger className="w-[250px] border-gray-400">
            <SelectValue placeholder="Select Text Option" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-gray-400">
            <SelectItem value="Default Text">
              Default Text for test the voice
            </SelectItem>
            <SelectItem value="Custom Text">
              Custom Text for test the voice
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Text Area */}
      {selectedOption === "Custom Text" && (
        <div className="relative my-3">
          <Textarea
            className="dark:border-gray-400 pr-[50px]" // Adjust padding to accommodate character count
            value={customText}
            onChange={(e) => {
              // Limit the number of characters to maxCharacters
              if (e.target.value.length <= maxCharacters) {
                setCustomText(e.target.value);
              }
            }}
            placeholder="Enter custom text here..."
            rows={4}
            maxLength={maxCharacters} // Set the maximum length for the textarea
          />
          {/* Character Count Inside Textarea */}
          <span className="absolute bottom-2 right-2 text-gray-400 text-sm">
            <span
              className={`${
                customText.length >= maxCharacters
                  ? "text-primary"
                  : "text-white"
              }`}
            >
              {customText.length}
            </span>{" "}
            / <span className="text-primary">{maxCharacters}</span>
          </span>
        </div>
      )}
      {/* Language Selection */}
      <h2 className="font-bold text-lg text-primary">Language</h2>
      <p className="text-gray-400 mt-2">Select language for your video</p>
      <div className="flex flex-wrap gap-2 my-5">
        {languages.map((language, idx) => (
          <Button
            key={idx}
            className={`border-gray-400 font-bold hover:text-black  ${
              selectedLanguage === language.code
                ? "bg-primary text-black "
                : "bg-neutral-900 text-gray-300"
            }`}
            onClick={() => {
              setSelectedLanguage(language?.code),
                onUserSelect("voiceLanguage", language?.code);
            }}
            aria-pressed={selectedLanguage === language.code} // Accessibility feature
          >
            {language.label}
          </Button>
        ))}
      </div>

      {/* Voice Gender Selection */}
      <h2 className="font-bold text-lg text-primary">Voice Gender</h2>
      <p className="text-gray-400 mt-2">Select Voice Gender for your video</p>
      <div className="my-3">
        <Select
          onValueChange={(value) => {
            setSelectedGender(value);
            onUserSelect("voiceGender",value);
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-400">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-gray-400">
            {genders.map((gender, idx) => (
              <SelectItem
                key={idx}
                value={gender?.value}
                onClick={() => {
                  setSelectedGender(gender),
                    onUserSelect("voiceGender", gender?.value);
                }}
              >
                {gender.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Button to trigger text-to-speech */}
      <Button className="mt-5 font-bold" onClick={handleSubmit}>
        Generate Speech
      </Button>
      {/* Audio Player */}
      {audioUrl && (
        <div className="mt-5">
          <h2 className="font-bold text-xl text-primary">Generated Speech</h2>
          <audio controls className="my-5">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      <CustomLoading
        loading={isGeneratingVoice}
        title=" Voice"
        message={
          isGeneratingVoice
            ? "Generating the voice..."
            : "Your voice is being generated !"
        }
      />
    </div>
  );
}

export default SelectVoice;
