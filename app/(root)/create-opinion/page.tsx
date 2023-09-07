import { PostOpinion } from "@/components/forms/PostOpinion";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Post a Opinion in You're Wrong`, //   name
    description: "Post Opinion page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}create-opinion`, // Edit to  URL
      title: `Post a Opinion in You're Wrong`,
      description: "Post Opinion page of You're Wrong",
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
    <>
      <h1 className="head-text">State Opinion</h1>
      <PostOpinion userId={userInfo?._id.toString()} user_id={user.id} />
    </>
  );
};
export default Page;
