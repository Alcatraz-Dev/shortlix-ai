import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src={"/signup.png"}
        alt="login image"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-5"></div>

      {/* SignUp Component */}
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <SignUp />
      </div>
    </div>
  );
}