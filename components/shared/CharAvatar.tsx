"use client";
// import { digitalRainbowColors } from "@/constants";
import React, { useMemo } from "react";
import { getContrastingColor } from "./helpers";

const CharAvatar = ({
  text,
  bg_color,
  customClassNames,
  pulse,
  size,
}: {
  text: string;
  bg_color: string;
  customClassNames?: string;
  size?: string;
  pulse: boolean;
}) => {
  // const randomColorKey = (min: number, max: number) => {
  //   return Math.floor(Math.random() * max) + min;
  // };

  // const bg_color = useMemo(
  //   () => digitalRainbowColors[randomColorKey(1, 20)],
  //   []
  // );
  const textColor = useMemo(() => getContrastingColor(bg_color), [bg_color]);
  const sizeX = useMemo(() => {
    switch (size) {
      case undefined:
        return "text-[24px]";
      case "big":
        return "text-[42px]";
      case "small":
        return "text-[24px]";
      case "x-small":
        return "text-[18px]";
      default:
        return "text-[24px]";
    }
  }, [size]);
  return (
    <div
      role="status"
      className={`${customClassNames ?? ""} ${
        pulse ? "animate-pulse" : ""
      } rounded-full w-full h-full flex justify-center items-center font-semibold ${sizeX}`}
      style={{
        backgroundColor: bg_color,
        color: textColor,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};

export default CharAvatar;
