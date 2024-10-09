"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { db } from "configs/db";
import { VideoData } from "configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import RemotionVideo from "./RemotionVideo"; // Keep this for rendering
import { Player } from "@remotion/player"; // Still needed for rendering
import { toast } from "sonner";


function PlayerDialog({ playVideo, videoId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();
  const videoRef = useRef();

  useEffect(() => {
    setOpenDialog(playVideo);
    if (playVideo && videoId) {
      getVideoData();
    }
  }, [playVideo, videoId]);

  const getVideoData = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData?.id, videoId));

      if (result?.length > 0) {
        setVideoData(result[0]);
      } else {
        alert("Video not found!");
        setVideoData(null); // Clear video data if not found
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
      alert("Failed to fetch video data.");
      setVideoData(null); // Clear video data on error
    } finally {
      setLoading(false);
    }
  };
  const expoertVideo = () => {
    toast.warning("Exporting video is not supported yet !");
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="bg-neutral-800 border-primary rounded-md flex flex-col items-center justify-center pl-28">
        <DialogHeader>
          {loading ? (
            <span className="text-center">Loading video data...</span>
          ) : (
            <DialogTitle className="flex text-center text-xl font-bold my-5 ml-14">
              {videoData ? "Your video is ready!" : "Your video is not found!"}
            </DialogTitle>
          )}
          <DialogDescription className="w-full h-full">
            {loading ? (
              <span className=" flex items-center justify-center text-center">
                Loading video data...
              </span>
            ) : videoData ? (
              <>
                <Player
                  className="w-full h-full mr-20 mx-auto rounded-md"
                  ref={videoRef}
                  component={RemotionVideo}
                  durationInFrames={Number(durationInFrame.toFixed(0))}
                  compositionWidth={300}
                  compositionHeight={450}
                  fps={30}
                  controls={true}
                  inputProps={{
                    ...videoData,
                    setDurationInFrame: (frameValue) =>
                      setDurationInFrame(frameValue),
                  }}
                />
                <div className="flex gap-x-10 ml-12 my-5 ">
                  <Button
                    variant="outline"
                    className="bg-transparent dark:border-primary text-gray-300 hover:text-primary hover:bg-transparent"
                    onClick={() => {
                      router.replace("/dashboard");
                      setOpenDialog(false);
                      setVideoData(null); // Clear video data when dialog closes
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={expoertVideo}>Export</Button>
                 
                </div>
              </>
            ) : (
              <span className="flex items-center text-center ml-6">
                No video data found.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;
