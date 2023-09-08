"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SearchResults from "@/components/search/SearchResults";
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  const user = await currentUser();
  if (!user) return {};

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return {};

  return {
    title: `Search users in You're Wrong`,
    description: "Search page of You're Wrong",
    openGraph: {
      type: "website",
      url: `/search`, // Updated URL
      title: `Search users in You're Wrong`,
      description: "Search page of You're Wrong",
      siteName: "You're Wrong",
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
