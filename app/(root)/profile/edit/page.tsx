import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import { AccountProfile } from "@/components/forms/AccountProfile";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;
  const user = await currentUser();
  if (!user) return {};
  const userInfo = await fetchUser(user.id);
  if (userInfo && userInfo.onboarded) return {};

  return {
    title: `Edit Profile of (@${userInfo.username}) on You're Wrong`, //   name
    description: userInfo.bio,
    icons: userInfo.profileImage, // Make sure the URL is absolute
    openGraph: {
      type: "website",
      url: `${host}profile/${userInfo.id}`, // Edit to  URL
      title: `Edit Profile of (@${userInfo.username}) on You're Wrong`,
      description: userInfo.bio,
      images: [
        {
          url: userInfo.image, // Make sure the URL is absolute
          width: 200,
          height: 200,
          alt: `Profile picture of ${userInfo.username}`,
        },
      ],
      siteName: "You're Wrong", //  app name
    },
  };
}
// Copy paste most of the code as it is from the /onboarding

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: JSON.stringify(userInfo?._id),
    username: userInfo ? userInfo?.username : user.username,
    email: userInfo?.email || user?.emailAddresses[0].emailAddress,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image:
      userInfo && userInfo?.image.length > 0 ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <AccountProfile user={userData} btnTitle="Save Changes" />
      </section>
    </>
  );
};

export default Page;
