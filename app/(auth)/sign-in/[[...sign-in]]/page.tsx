// page.tsx

import { clerckComponentsOptions } from "@/constants";
import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Sign In to You're Wrong`,
    description: "Sign In page of You're Wrong",
    openGraph: {
      type: "website",
      url: "/sign-in",
      title: `Sign In to You're Wrong`,
      description: "Sign In page of You're Wrong",
      siteName: "You're Wrong",
    },
  };

}

const Page = () => {
  return <SignIn appearance={clerckComponentsOptions} />;
};

export default Page;