import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function EmptyState({ title, message, buttonTitle, isVideo = true }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 mt-32">
      <h3 className="font-semibold text-xl">You don't have any {title} yet.</h3>
      <p className=" flex text-center text-muted-foreground text-sm mt-1">
        Create a new {message} by clicking the button above.
      </p>
      {isVideo ? (
        <Image
          src={"/video.png"}
          alt="empty-state"
          width={100}
          height={100}
          className="my-5"
        />
      ) : (
        <Image
          src={"/mic.png"}
          alt="empty-state"
          width={100}
          height={100}
          className="my-3"
        />
      )}

      <Link href={"/dashboard/create-new"}>
        <Button className='font-bold'>Create New {buttonTitle}</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
