"use client";

import React from "react";
import Image from "next/image";
import { RiArrowRightLine } from "react-icons/ri";

const GoogleButton = () => {
  return (
    <button
      className="oauth-button group"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
      onClick={(e) => {
        console.log("Google Oauth Clicked");
      }}
    >
      <div className="flex justify-start gap-5">
        {/* <IoLogoGoogle size={24} className="" style={{ color: "#0A66C2" }} /> */}
        <Image
          src="/assets/google-color-icon.webp"
          alt="edit"
          width={22}
          height={22}
        />

        <span className="text-light-1 text-[14px]">Continue with Google</span>
      </div>
      <div
        className="transition-all -translate-x-3 duration-150 ease-in-out opacity-0 
      group-hover:opacity-100 group-hover:translate-x-0"
      >
        <RiArrowRightLine size={20} />
      </div>
    </button>
  );
};

export default GoogleButton;
