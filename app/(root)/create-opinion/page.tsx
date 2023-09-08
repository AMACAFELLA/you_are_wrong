import { PostOpinion } from "@/components/forms/PostOpinion";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Metadata } from "next"; // Updated import

export async function generateMetadata(): Promise<Metadata> {
  // fetch data
  const user = await currentUser();
  if (!user) {
    return {
      title: "Post an Opinion in You're Wrong",
      description: "Post Opinion page of You're Wrong",
      openGraph: {
        type: "website",
        url: `/create-opinion`, // Updated URL
        title: "Post an Opinion in You're Wrong",
        description: "Post Opinion page of You're Wrong",
        siteName: "You're Wrong",
      },
    };
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    return redirect("/onboarding");
  }

  return {
    title: "Post an Opinion in You're Wrong",
    description: "Post Opinion page of You're Wrong",
    openGraph: {
      type: "website",
      url: `/create-opinion`, // Updated URL
      title: "Post an Opinion in You're Wrong",
      description: "Post Opinion page of You're Wrong",
      siteName: "You're Wrong",
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
      {/* Assuming PostOpinion accepts userId and user_id as props */}
      <PostOpinion userId={userInfo?._id.toString()} user_id={user.id} />
    </>
  );
};

export default Page;
