import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import fs from "fs";
import util from "util";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "configs/FierbaseConfig";
const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function POST(req) {
  // The text to synthesize
   // Get text, languageCode, and ssmlGender from the request
   const { text, languageCode, ssmlGender, id } = await req.json();
  const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);
  // Construct the request
 // Construct the Text-to-Speech request
 const request = {
  input: { text: text },
  voice: {
    languageCode: languageCode || "en-US", // Use provided language code or default to en-US
    ssmlGender: ssmlGender || "NEUTRAL",  // Use provided gender or default to neutral
  },
  audioConfig: { audioEncoding: "MP3" },
};

// Performs the text-to-speech request
const [response] = await client.synthesizeSpeech(request);

// Convert audio content to buffer and upload to Firebase Storage
const audioBuffer = Buffer.from(response.audioContent, "binary");
await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });

// Get the download URL for the uploaded audio file
const downloadURL = await getDownloadURL(storageRef);
console.log("Download URL:", downloadURL);
console.log("Firebase Download URL:", downloadURL); // In your API route

// Return the download URL in the response
return NextResponse.json({ result: downloadURL });
}
