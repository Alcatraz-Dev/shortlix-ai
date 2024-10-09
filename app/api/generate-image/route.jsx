
import axios from "axios";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { storage } from "configs/FierbaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";


export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const replicate = new Replicate({
      auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    // Save to Firebase
    const base64Image =
      "data:image/png;base64," + (await convertImage(output[0]));
    const fileName = "ai-short-video-files/" + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);

    return NextResponse.json({ result: downloadURL });
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

const convertImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return base64Image;
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
};