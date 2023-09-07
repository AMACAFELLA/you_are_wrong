"use client";

import React from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import { RiArrowRightLine } from "react-icons/ri";

const LinkedInButton = () => {
  return (
    <button
      className="oauth-button group"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
      onClick={(e) => {
        console.log("LinkedIn Oauth Clicked");
      }}
    >
      <div className="flex justify-start gap-5">
        <IoLogoLinkedin size={24} className="" style={{ color: "#0A66C2" }} />
        <span className="text-light-1 text-[14px]">Continue with LinkedIn</span>
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

export default LinkedInButton;
