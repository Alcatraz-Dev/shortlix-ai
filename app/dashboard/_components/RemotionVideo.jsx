"use client";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
function RemotionVideo({
  script,
  imageList = [],
  audioFileUrl,
  captions,
  setDurationInFrame,
}) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  // State to manage the visibility of captions
  const [showCaptions, setShowCaptions] = useState(true); // Default is to show captions

  // Determine total video duration based on captions
  const totalVideoDurationInSeconds =
    captions && captions.length > 0
      ? captions[captions.length - 1].end / 1000
      : 30; // Default fallback to 30 seconds

  const totalDurationInFrames = totalVideoDurationInSeconds * fps;

  useEffect(() => {
    setDurationInFrame(totalDurationInFrames);
  }, [totalDurationInFrames, setDurationInFrame]);

  const framePerImage =
    imageList.length > 0
      ? totalDurationInFrames / imageList.length // Divide total frames by number of images
      : totalDurationInFrames;

  // Determine the index of the current image based on the current frame
  const currentImageIndex = Math.floor(frame / framePerImage);

  // Memoizing current captions
  const getCurrentCaptions = useMemo(() => {
    const currentTime = (frame / fps) * 1000; // Current time in milliseconds
    return (
      captions.find(
        (word) => currentTime >= word.start && currentTime < word.end // Ensure current time is within start and end
      )?.text || ""
    );
  }, [frame, fps, captions]);

  return (
    script && (
      <AbsoluteFill className="bg-black rounded-xl">
        {imageList.map((item, idx) => {
          const startTime = idx * framePerImage; // Start time for each image
          const endTime = startTime + framePerImage; // End time for each image

          // Randomly select a transition component for the current image
          // Calculate the scale value for zoom in and zoom out
          const scale = interpolate(
            frame,
            [startTime, startTime + framePerImage / 2, endTime],
            [1, 1.5, 1]
          );

          // // Calculate the opacity for the fade effect
          // const opacity = interpolate(
          //   frame,
          //   [startTime, startTime + 2, endTime -0.5, endTime],
          //   [1, 1, 0, 0] // Fade out faster and over a shorter period
          // );

          // Only render the current image based on the calculated index
          if (idx === currentImageIndex) {
            return (
              <Sequence
                key={idx}
                from={startTime}
                durationInFrames={framePerImage + 20} // Extend the duration for overlap
              >
                <Img
                  src={item}
                  alt={item?.id}
                  className="w-full h-full object-cover"
                  style={{
                    // transform: `scale(${scale})`,
                    // opacity, // Apply opacity for fade effect
                    transition: "transform 0.5s ease", // Smooth scaling transition
                  }}
                />
                {showCaptions && ( // Conditional rendering of captions based on the switch state
                  <AbsoluteFill className="w-full h-full justify-center items-center bottom-12 pt-[80%]">
                    <h2 className="text-white text-2xl justify-center items-center text-center font-bold drop-shadow-[2px_2px_3px_rgba(0,0,0,1)]">
                      {getCurrentCaptions}
                    </h2>
                  </AbsoluteFill>
                )}
              </Sequence>
            );
          }
          return null; // Do not render any images that are not the current one
        })}
        <Audio src={audioFileUrl} />
        {/* Toggle Switch for Showing/Hiding Captions */}
        <div className="absolute top-4 right-4 z-50 flex items-center">
          <Switch
            checked={showCaptions}
            onCheckedChange={setShowCaptions}
            className="bg-gray-800 rounded-md w-8 h-4" // Smaller width and height for the switch
          />
          <span className="ml-2 text-white font-bold text-xs drop-shadow-xl">
            {showCaptions ? "Hide" : "Show"} Captions
          </span>
        </div>
      </AbsoluteFill>
    )
  );
}

export default RemotionVideo;
