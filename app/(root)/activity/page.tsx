"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ActivitiesComponent from "@/components/activity/page";

import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Activity in You're Wrong`, //   name
    description: "Activity page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}activity`, // Edit to  URL
      title: `Activity in You're Wrong`,
      description: "Activity page of You're Wrong",
      siteName: "You're Wrong", //  app name
    },
  };
}

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        <ActivitiesComponent />
      </section>
    </section>
  );
};

export default Page;
