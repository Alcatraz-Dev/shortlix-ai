"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import VideoList from "./_components/VideoList";
import { db } from "configs/db";
import { VideoData } from "configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    user && getVideoList();
  }, [user]);
  const getVideoList = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(VideoData.id, "desc"); // Order by 'id' in descending order
    console.log(result);
    setVideoList(result);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-3xl text-primary ">Dashboard</h2>
        <Link href={"/dashboard/create-new"}>
          <Button className="font-bold">+ Create New </Button>
        </Link>
      </div>
      {/* Empty State */}
      <div>
        {videoList?.length === 0 ? (
          <div className="flex justify-center items-center">
            <EmptyState
              title={"video"}
              message={"video"}
              buttonTitle={" new video"}
            />
          </div>
        ) : (
          // Video List
          <div className="flex items-center">
            <VideoList videoList={videoList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
