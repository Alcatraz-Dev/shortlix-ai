"use client";
import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "app/_context/VideoDataContext";
import { db } from "configs/db";
import { Users, VideoData } from "configs/schema";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { toast } from "sonner";
import { eq } from "drizzle-orm";
import SelectVoice from "./_components/SelectVoice";
import { useVideoData } from "app/Provider";

function CreateNew() {
  const [formData, setFormData] = useState([]);

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isSavingVideoData, setIsSavingVideoData] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(1);
  const { videoData, setVideoData } = useVideoData(); // Access videoData from cont
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();

  const onHandleInputChange = (fielName, fielValue) => {
    // console.log(fielName, fielValue);
    setFormData((prev) => ({ ...prev, [fielName]: fielValue }));
  };
  const onCreateClickHandler = () => {
    if (!userDetail || userDetail.credits <= 0) {
      toast("Insufficient credits");
      return;
    }
    getVideoScript();
  };

  //! GET VIDEO SCRIPT FROM API
  const getVideoScript = async () => {
    setIsGeneratingScript(true);
    // const prompt = `write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and ContentText as field . Each image prompt should evoke strong imagery, with attention to colors, composition, and mood.`;
    const prompt = `Create a compelling script for a ${formData.duration} video on the topic: "${formData.topic}". For each scene, provide a detailed description of the visuals that should accompany the script. Specify the style as ${formData.imageStyle}, ensuring the image prompts capture the essence and tone of the script. The script language should be in ${formData.voiceLanguage} and have a grandeur level of ${formData.voiceGender}. The output should be in JSON format, with fields for 'imagePrompt' and 'ContentText'. Each image prompt should evoke strong imagery, with attention to colors, composition, and mood.`;
    // const prompt = `Create a compelling script for a ${formData.duration} video on the topic: "${formData.topic}". For each scene, provide a detailed description of the visuals that should accompany the script. Specify the style as ${formData.imageStyle}, ensuring the image prompts capture the essence and tone of the script. The voiceover should be in ${formData.voiceLanguage} and have a grandeur level of ${formData.voiceGender}. The output should be in JSON format, with fields for 'imagePrompt' and 'ContentText'. Each image prompt should evoke strong imagery, with attention to colors, composition, and mood.`;
    const result = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });

    if (result?.data?.result) {
      setVideoData((prev) => ({ ...prev, videoScript: result?.data?.result }));
      setVideoScript(result?.data?.result);
      generateAudioFile(result?.data?.result);
      setIsGeneratingScript(false);
    } else {
      setIsGeneratingScript(false);
    }
  };
  //! GENERATE AUDIO FILE
  const generateAudioFile = async (videoScriptData) => {
    setIsGeneratingAudio(true);
    let script = "";
    const id = uuidv4(); // Generating a unique ID
    videoScriptData.forEach((item) => {
      script = script + item.ContentText + " ";
    });
    console.log(script);
    try {
      const res = await axios.post("/api/generate-audio", {
        text: script,
        id: id,
        languageCode: formData?.voiceLanguage,
        voice: formData?.voiceGender,
      });

      const audioFileUrl = res?.data?.result;
      console.log("Audio File URL:", audioFileUrl); // Debugging step
      setVideoData((prev) => ({ ...prev, audioFileUrl })); // Update video data
      setAudioFileUrl(audioFileUrl); // Set audio file URL in state
      setIsGeneratingAudio(false);
      if (audioFileUrl) {
        await generateAudioCaption(audioFileUrl, videoScriptData); // Generate captions
      }
    } catch (error) {
      console.error("Error generating audio file:", error);
      setIsGeneratingAudio(false);
      // Optionally log out the error response
      if (error.response) {
        console.error("Error response:", error.response.data);
        setIsGeneratingAudio(false);
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  //! GENERATE AUDIO CAPTION
  const generateAudioCaption = async (fileUrl, videoScriptData) => {
    setIsGeneratingCaptions(true);
    const result = await axios.post("/api/generate-caption", {
      audioFileUrl: fileUrl,
      language_code: formData?.voiceLanguage,
    });
    if (result?.data?.result) {
      console.log("Audio File URL before generating captions:", audioFileUrl);
      console.log("Captions:", result?.data?.result);
      setVideoData(
        (prev) => ({
          ...prev,
          captions: result?.data?.result,
        }),
        setCaptions(result?.data?.result),
        result?.data?.result && generateVideoImages(videoScriptData),
        setIsGeneratingCaptions(false)
      );
    }
  };
  //! GENERATE VIDEO IMAGES
  const generateVideoImages = async (videoScriptData) => {
    setIsGeneratingImages(true);
    let images = [];

    for (const element of videoScriptData) {
      try {
        const result = await axios.post("/api/generate-image", {
          prompt: element.imagePrompt,
        });
        console.log(result?.data?.result);
        images.push(result?.data?.result);
      } catch (error) {
        console.log(error);
        setIsGeneratingImages(false);
      }
    }

    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));
    setImageList(images);
    setIsGeneratingImages(false);
  };
  //! SAVE VIDEO DATA TO DATABASE
  const saveVideoData = async (videoData) => {
    setIsSavingVideoData(true);
    try {
      const result = await db
        .insert(VideoData)
        .values({
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          createBy: user?.primaryEmailAddress?.emailAddress,
          downloadURL: "",
        })
        .returning({ id: VideoData?.id });
      await updateUserCredits();
      setVideoId(result[0]?.id);
      setPlayVideo(true);
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error saving video data:", error);
      setIsSavingVideoData(false);
    } finally {
      setIsSavingVideoData(false);
    }
  };

  //! SAVE VIDEO DATA
  useEffect(() => {
    console.log(videoData);

    // Check if videoData is an object and has properties
    if (
      videoData &&
      typeof videoData === "object" &&
      Object.keys(videoData).length === 4
    ) {
      saveVideoData(videoData);
    }
  }, [videoData]);
  //! UPDATE USER CREDITS
  const updateUserCredits = async () => {
    const result = await db
      .update(Users)
      .set({ credits: userDetail?.credits - 10 })
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
    console.log(result);
    setUserDetail((prev) => ({
      ...prev,
      credits: userDetail?.credits - 10,
    }));
    setVideoData(null);
  };
  return (
    <div>
      <h2 className="font-bold text-3xl text-primary ">Create New</h2>
      <div className="mt-10 shadow-md shadow-neutral-900 rounded-md p-10">
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* Select voice */}
        <SelectVoice onUserSelect={onHandleInputChange} />
        {/* Create Button */}
        <Button
          onClick={onCreateClickHandler}
          className="mt-10 w-full font-bold"
        >
          Create Short Video
        </Button>
      </div>
      {/* Custom Loading Component */}

      <CustomLoading
        loading={
          isGeneratingScript ||
          isGeneratingAudio ||
          isGeneratingCaptions ||
          isGeneratingImages ||
          isSavingVideoData
        }
        title={" Video"}
        message={
          isGeneratingScript
            ? "Generating video script..."
            : isGeneratingAudio
            ? "Generating audio file..."
            : isGeneratingCaptions
            ? "Generating captions..."
            : isGeneratingImages
            ? "Generating images..."
            : isSavingVideoData
            ? " Saving video data..."
            : ""
        }
      />
      {/* Player Dialog */}
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;
