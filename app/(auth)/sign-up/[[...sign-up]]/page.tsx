import { clerckComponentsOptions } from "@/constants";
import { SignUp } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Sign Up in You're Wrong`, //   name
    description: "Sign Up page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}sign-up`, // Edit to  URL
      title: `Sign Up in You're Wrong`,
      description: "Sign Up page of You're Wrong",
      siteName: "You're Wrong", //  app name
    },
  };
}

const Page = () => {
  return <SignUp appearance={clerckComponentsOptions} />;
};

export default Page;
