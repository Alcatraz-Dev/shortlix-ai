"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function SelectTopic({ onUserSelect }) {
  const options = [
    "Custom Prompt",
    "Random AI Prompt",
    "Scary Story",
    "Historical Facts",
    "Bed Time Story",
    "Motivational",
    "Adventure Story", // New type: Adventure
    "Science Fiction",  // New type: Sci-Fi
    "Fantasy Tale",     // New type: Fantasy
    "Romantic Story",   // New type: Romance
    "Mystery Thriller",  // New type: Mystery
    "Fable",            // New type: Fable
    "Humorous Anecdote", // New type: Humor
    "Superhero Tale",   // New type: Superhero
    "Ghost Story",      // New type: Ghost
    "Slice of Life",    // New type: Slice of Life
    "Travel Narrative", // New type: Travel
    "Personal Growth",  // New type: Self-help
];
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div>
      <h2 className="font-bold text-xl text-primary ">Content</h2>
      <p className="text-gray-400 mt-2">what is the topic of your video</p>
      <div className="my-3">
        <Select
           onValueChange={(value) => {
            setSelectedOption(value); // Update the selected option
            value !== "Custom Prompt" && onUserSelect("topic", value);
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-400">
            <SelectValue placeholder="Content Topic" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-gray-400 ">
            {options.map((option, index) => (
              <SelectItem
                className="dark:hover:bg-neutral-700"
                key={index}
                value={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedOption === "Custom Prompt" && (
          <Textarea
            placeholder="write prompt on which you want to generate video"
            className="mt-5 border-gray-400"
            onChange={(e) => onUserSelect("topic", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

export default SelectTopic;
