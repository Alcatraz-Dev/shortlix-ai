import React, { useEffect, useMemo } from "react";
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
      ? totalDurationInFrames / (imageList.length + 1) // Add 1 for smooth transition
      : totalDurationInFrames;

  // Memoizing current captions
  const getCurrentCaptions = useMemo(() => {
    const currentTime = (frame / fps) * 1000;
    return (
      captions.find(
        (word) => currentTime >= word.start && currentTime <= word.end
      )?.text || ""
    );
  }, [frame, fps, captions]);

  // Function to open Remotion Studio

  return (
    script && (
      <AbsoluteFill className="bg-black rounded-xl">
        {imageList?.map((item, idx) => {
          const startTime = idx * framePerImage; // Start time for each image
          const duration = framePerImage; // Duration for each image
          const endTime = startTime + duration; // End time for each image

          // Calculate the scale value for zoom in and zoom out
          const scale = interpolate(
            frame,
            [startTime, startTime + duration / 2, endTime],
            [1, 1.8, 1]
          );

          // Calculate the opacity for the fade effect
          const opacity = interpolate(
            frame,
            [startTime, startTime + duration / 2, endTime - 5, endTime],
            [1, 1, 0, 0] // Fade out at the end of the image display
          );

          return (
            
            <Sequence
              key={idx}
              from={startTime}
              durationInFrames={duration + 10} // Slightly extend the duration for overlap
            >
              <Img
                src={item}
                alt={`Image ${idx + 1}`} // Accessibility improvement
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${scale})`,
                  opacity, // Apply opacity for fade effect
                  transition: "transform 0.5s ease", // Smooth scaling transition
                }}
              />
              <AbsoluteFill className="w-full h-full justify-center items-center bottom-12 pt-[80%]">
                <h2 className="text-white text-2xl justify-center items-center text-center font-bold drop-shadow-[2px_2px_3px_rgba(0,0,0,1)]">
                  {getCurrentCaptions}
                </h2>
              </AbsoluteFill>
            </Sequence>
          );
        })}
        <Audio src={audioFileUrl} />
      </AbsoluteFill>
    )
  );
}

export default RemotionVideo;
