import { clerckComponentsOptions } from "@/constants";
import { SignIn } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Sign In to You're Wrong`, //  name
    description: "Sign In page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}sign-in`, // Edit to URL
      title: `Sign In to You're Wrong`,
      description: "Sign In page of You're Wrong",
      siteName: "You're Wrong", //  app name
    },
  };
}

const Page = () => {
  return <SignIn appearance={clerckComponentsOptions} />;
};

export default Page;
