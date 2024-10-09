import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Destructure both audioFileUrl and languageCode from the request
    const { audioFileUrl, languageCode } = await req.json();
    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
    });

    const data = {
      audio: audioFileUrl,
      language_code: languageCode,
    };

    const transcript = await client.transcripts.transcribe({ data });
    console.log(transcript.words);
    return NextResponse.json({ result: transcript.words });
  } catch (error) {
    console.error("Error during transcription:", error); // Log the error for debugging
    return NextResponse.json({
      error: error.message || "An error occurred during transcription.",
    });
  }
}
