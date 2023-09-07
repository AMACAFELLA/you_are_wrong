import OpinionCard from "@/components/cards/OpinionCard";
import Disagreement from "@/components/forms/Disagreement";
import { fetchOpinionById } from "@/lib/actions/opinion.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  if (!params.id) return {};
  const parentData = await parent;
  const user = await currentUser();
  const host = parentData.metadataBase;
  if (!user) return {};
  const userInfo = await fetchUser(user.id);
  const opinion = await fetchOpinionById(params.id, userInfo?._id);

  if (!opinion) return notFound();

  return {
    title: `${userInfo.name} (@${userInfo.username})'s Opinion on You're Wrong`, //   name
    description: opinion.text,
    icons: userInfo.profileImage, // Make sure the URL is absolute
    openGraph: {
      type: "website",
      url: `${host}opinion/${opinion._id.toString()}`, // Edit to  URL
      title: `${userInfo.name} (@${userInfo.username})'s Opinion on You're Wrong`,
      description: opinion.text,
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

const Page = async ({ params }: Props) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const opinion = await fetchOpinionById(params.id, userInfo?._id);

  if (!opinion) return notFound();

  //   console.log(opinion.author);
  //   console.log(opinion.children);

  return (
    <section className="relative">
      <div>
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
          isDisagreement={false}
          isMainOpinion={true}
          votes={opinion.votePoints}
          myVote={opinion.myVote}
        />
      </div>
      <div className="mt-6">
        <Disagreement
          opinionId={opinion._id}
          currentUserImage={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
          currentUserName={userInfo?.name}
          currentUserColor={userInfo?.color}
        />
      </div>
      <div className="mt-9">
        {opinion.children.map((disagreement: any) => {
          return (
            <OpinionCard
              key={disagreement._id}
              id={disagreement._id}
              currentUserId={JSON.stringify(userInfo?._id)}
              repost={null}
              parentId={disagreement.parentId}
              content={disagreement.text}
              author={disagreement.author}
              createdAt={disagreement.createdAt}
              disagreements={disagreement.children}
              isDisagreement={true}
              isMainOpinion={false}
              votes={disagreement.votePoints}
              myVote={disagreement.myVote}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Page;
