// page.tsx

import { clerckComponentsOptions } from "@/constants";
import { SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Sign Up to You're Wrong`,
    description: "Sign Up page of You're Wrong",
    openGraph: {
      type: "website",
      url: "/sign-up",
      title: `Sign Up to You're Wrong`,
      description: "Sign Up page of You're Wrong",
      siteName: "You're Wrong",
    },
  };

}

const Page = () => {
  return <SignUp appearance={clerckComponentsOptions} />;
};

export default Page;