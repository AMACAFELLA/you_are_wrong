"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useState } from "react";
const ImageAsync = ({
  src,
  bg_color,
  loadingSize,
  loadingText = "small",
  alt,
  width,
  height,
  className,
}: {
  src: string | StaticImport;
  bg_color: string;
  loadingSize?: "big" | "small" | "x-small";
  loadingText: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const [reveal, setReveal] = useState(false);
  const visibility = reveal ? "visible" : "hidden";
  const loader = reveal ? "none" : "inline-block";

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width,
          height,
        }}
        onError={() => setReveal(true)}
        onLoadingComplete={() => setReveal(true)}
      />
      <span
        style={{
          display: loader,
          position: "absolute",
          top: 0,
        }}
      >
        Loading...
      </span>
    </div>
  );
};

export default ImageAsync;
