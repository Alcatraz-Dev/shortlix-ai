"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Assuming you're using Clerk for user management
import { db } from "configs/db";
import { Voices } from "configs/schema";
import { eq } from "drizzle-orm";
import EmptyState from "../_components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function VoiceGeneration() {
  const { user } = useUser();
  const [voiceGenerations, setVoiceGenerations] = useState([]);

  useEffect(() => {
    const fetchVoiceGenerations = async () => {
      if (!user) return;

      const voices = await db
        .select()
        .from(Voices)
        .where(eq(Voices.userId, user.id)); // Replace with the correct user ID field
      // Sort voices by createdAt in descending order
      voices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVoiceGenerations(voices);
    };

    fetchVoiceGenerations();
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-3xl text-primary">
          Your Voice Generations
        </h2>
        <Link href={"/dashboard/create-new"}>
          <Button className="font-bold">+ Create New </Button>
        </Link>
      </div>

      {/* Empty State */}
      <div>
        {voiceGenerations.length === 0 ? (
          <div className="flex justify-center items-center">
            <EmptyState
              isVideo={false}
              title={"Voice"}
              message={"No voice generations found."}
              buttonTitle={"Create New Voice"}
            />
          </div>
        ) : (
          // Voice List
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {voiceGenerations.map((voice, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 shadow-md rounded-lg p-4 mt-5"
              >
                <h2 className="text-gray-300">
                  Title:{" "}
                  {voice.voiceTitle ||
                    voice.audioUrl.split("/").pop().split(".")[0] ||
                    "Not specified"}
                </h2>
                <p className="text-gray-300">
                  Generated on: {new Date(voice.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  Language: {voice.language || "Not specified"}
                </p>
                <p className="text-gray-300">
                  Gender: {voice.gender || "Not specified"}
                </p>
                <audio controls className="w-full my-5">
                  <source src={voice.audioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceGeneration;
