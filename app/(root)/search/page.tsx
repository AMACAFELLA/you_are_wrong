"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SearchResults from "@/components/search/SearchResults";
import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Search users in You're Wrong`, //   name
    description: "Search page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}search`, // Edit to  URL
      title: `Search users in You're Wrong`,
      description: "Search page of You're Wrong",
      siteName: "You're Wrong", //  app name
    },
  };
}

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");
  // console.log(result);
  return (
    <section>
      <h1 className="head-text mb-2 sm:mb-8">Search</h1>
      <SearchResults />
    </section>
  );
};

export default Page;
