"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
function VideoList({ videoList }) {
  const [openPlayDailog, setOpenPlayDailog] = useState(false);
  const [videoId, setVideoId] = useState();
  const router = useRouter();
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
      {videoList?.map((video, idx) => {
     
        return (
          <div key={idx}
            className="hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer "
            onClick={() => {
             
              setOpenPlayDailog(!openPlayDailog);
              setVideoId(video?.id);
            }}
          >
            <Thumbnail
              component={RemotionVideo}
              compositionWidth={300}
              compositionHeight={450}
              frameToDisplay={30}
              durationInFrames={120}
              fps={30}
              inputProps={{
                ...video,
                setDurationInFrame: (value) => console.log(value),
              }}
              className="rounded-xl "
            />
          </div>
        );
      })}
      <PlayerDialog playVideo={openPlayDailog} videoId={videoId} />
    </div>
  );
}

export default VideoList;
