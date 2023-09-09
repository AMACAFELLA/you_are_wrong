"use server";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUserAccount } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import OpinionsTab from "@/components/profile/OpinionsTab";
import TabTriggerClient from "@/components/profile/TabTriggerClient";
import { fetchUserTotalOpinionsCount } from "@/lib/actions/opinion.actions";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  params: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const user = await currentUser();

  const host = parentData.metadataBase;
  if (!user) return {};

  const current_user = await fetchUser(user.id);
  if (!current_user) return redirect("/sign-in");
  if (!current_user?.onboarded) return redirect("/onboarding");
  const userInfo = await fetchUserAccount(params.params.id, current_user._id);

  return {
    title: `${userInfo?.name} (@${userInfo?.username}) on You're Wrong`, //   name
    description: userInfo?.bio,
    icons: userInfo?.profileImage, // Make sure the URL is absolute
    openGraph: {
      type: "website",
      url: `${host}profile/${userInfo?.id}`, // Edit to  URL
      title: `${userInfo?.name} (@${userInfo?.username}) on You're Wrong`,
      description: userInfo?.bio,
      images: [
        {
          url: userInfo?.image, // Make sure the URL is absolute
          width: 200,
          height: 200,
          alt: `Profile picture of ${userInfo?.username}`,
        },
      ],
      siteName: "You're Wrong", //  app name
    },
  };
}

const Page = async (params: Props) => {
  const user = await currentUser();

  if (!user) return null;

  const current_user = await fetchUser(user.id);
  if (!current_user) return redirect("/sign-in");
  if (!current_user?.onboarded) return redirect("/onboarding");
  const userInfo = await fetchUserAccount(params.params.id, current_user._id);
  if (!userInfo) return notFound();

  const setDefaultTab = () => {
    if (params.searchParams) {
      if (params.searchParams.tab) {
        return params.searchParams.tab as string;
      }
      return "opinions";
    }
    return "opinions";
  };

  const defaultTab = setDefaultTab();

  let results: any = {};
  for (let p in profileTabs) {
    let value = profileTabs[p].value;
    results[value] = await fetchUserTotalOpinionsCount({
      accountId: userInfo._id,
      label: value,
    });
  }
  return (
    <section className="">
      <ProfileHeader
        accountId={userInfo.id}
        account_id={userInfo._id}
        authUserId={current_user.id}
        authUser_id={current_user._id}
        name={userInfo.name}
        username={userInfo.username}
        color={userInfo.color}
        followersCount={userInfo?.followersCount}
        followingsCount={userInfo?.followingsCount}
        follow={userInfo?.follow} // do i follow or not
        img={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-2 sm:mt-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="tab rounded-xl px-0 mx-0">
            <>
              {profileTabs.map((tab) => {
                return (
                  <TabTriggerClient
                    tab={tab}
                    total={
                      // @ts-ignore
                      results[tab.value]
                    }
                  />
                );
              })}
            </>
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                <OpinionsTab
                  currentUserId={JSON.stringify(current_user._id)}
                  accountId={JSON.stringify(userInfo?._id)}
                  label={tab.value}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
