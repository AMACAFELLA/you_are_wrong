import OpinionCardsClient from "@/components/OpinionCardsClient";
import OpinionCard from "@/components/cards/OpinionCard";
import FilterAndSort from "@/components/shared/FilterAndSort";
import FilterComponent from "@/components/shared/FilterComponent";
import { fetchFollowingsOpinions } from "@/lib/actions/opinion.actions";
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
    title: `You're Wrong Following`, //   name
    description: "Following page of You're Wrong",
    openGraph: {
      type: "website",
      url: `${host}/followings`, // Edit to  URL
      title: `You're Wrong Following`,
      description: "Following page of You're Wrong",
      siteName: "You're Wrong", //  app name
    },
  };
}
const Home = async (params: {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const user = await currentUser();
  if (user) {
    var userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect("/onboarding");
  } else {
    return null;
  }

  let sortBy: SortByType = "votePoints";

  let sortQuery = params?.searchParams?.sortBy as string | undefined;
  if (sortQuery && sortQuery === "latest") {
    sortBy = "createdAt";
  } else if (!sortQuery || sortQuery === "top") {
    sortBy = "votePoints";
  }
  const result = await fetchFollowingsOpinions({
    pageNumber: 1,
    pageSize: 10,
    currentUserId: userInfo ? userInfo?._id : null,
    sortBy: sortBy,
  });

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="head-text text-left">Opinions</h1>
        <FilterComponent
          baseUrl={"/followings"}
          sortQuery={sortQuery}
          sortBy={sortBy}
          type="smallDevice"
        />
      </div>

      <FilterAndSort
        baseUrl={"/followings"}
        sortQuery={sortQuery}
        sortBy={sortBy}
      />

      <section className="mt-5 flex flex-col gap-5">
        {result && result.docs?.length === 0 ? (
          <p className="no-result">No Opinions found</p>
        ) : (
          <>
            {result &&
              result.docs?.map((opinion: any) => {
                return (
                  <OpinionCard
                    key={opinion._id}
                    id={opinion._id}
                    currentUserId={JSON.stringify(userInfo?._id)}
                    repost={JSON.stringify(opinion.repost)}
                    parentId={opinion.parentId}
                    content={opinion.text}
                    author={opinion.author}
                    createdAt={opinion.createdAt}
                    disagreements={opinion.children}
                    votes={opinion.votePoints}
                    myVote={opinion.myVote}
                    isDisagreement={false}
                  />
                );
              })}
            {/* DOES NOT REBUILD ON router link change so we need to split them for sortBy   */}
            {sortBy === "votePoints" && (
              <OpinionCardsClient
                result={JSON.stringify(result)}
                currentUserId={JSON.stringify(userInfo?._id)}
                baseUrl="/api/opinion/followings"
                isDisagreement={false}
                sortBy={"votePoints"}
              />
            )}
            {sortBy === "createdAt" && (
              <OpinionCardsClient
                result={JSON.stringify(result)}
                currentUserId={JSON.stringify(userInfo?._id)}
                baseUrl="/api/opinion/followings"
                isDisagreement={false}
                sortBy={"createdAt"}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
