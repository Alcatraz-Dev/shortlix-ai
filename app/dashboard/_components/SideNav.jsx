"use client";
import { AudioLines,CircleDollarSign,FileVideo, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SideNav() {
  const menuOption = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: <PanelsTopLeft />,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: <FileVideo />,
    },
    {
      id: 3,
      name: "Voice Generation",
      path: "/dashboard/voice",
      icon: <AudioLines />,
    },
    {
      id: 4,
      name: "Buy Credits",
      path: "/dashboard/buy-credits",
      icon: <CircleDollarSign />,
    },
  ];
  const pathName = usePathname();
  return (
    <div className="w-64 h-screen shadow-md shadow-neutral-900 p-5">
      <div className="grid gap-3">
        {menuOption.map((item, idx) => (
          <Link href={item.path} key={idx}>
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-black cursor-pointer rounded-md hover:font-bold ${
                pathName === item.path ? "bg-primary text-black font-bold" : ""
              }`}
            >
              {item.icon}
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
