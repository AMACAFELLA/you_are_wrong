"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Suspense } from "react";
import CharAvatar from "./CharAvatar";
const Avatar = ({
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
  const loadingFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
      bg_color={bg_color}
      pulse={true}
      size={loadingSize}
      customClassNames={className}
    />
  );
  const replaceFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
      bg_color={bg_color}
      pulse={false}
      size={loadingSize}
      customClassNames={className}
    />
  );
  // return loadingFrame;
  return (
    <>
      {src === "" ? (
        replaceFrame
      ) : (
        <Suspense fallback={loadingFrame}>
          {width && height ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{
                width,
                height,
              }}
              // sizes=""
              className={`rounded-full object-cover shadow-2xl ${className}`}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              // sizes=""
              className={`rounded-full object-cover shadow-2xl ${className}`}
            />
          )}
        </Suspense>
      )}
    </>
  );
};

export default Avatar;
