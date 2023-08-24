import OpinionCard from "@/components/cards/OpinionCard";
import { fetchPosts } from "@/lib/actions/opinion.actions"
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  console.log(result);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result"> No opinions found</p>
        ) : (
          <>
            {
              result.posts.map((post) => (
                <OpinionCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || ""}
                  parentId={post.parentId}
                  content={post.text}
                  giphyId={post.giphyId}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  disagreements={post.children}
                  isAgreed= {post.isAgreed}
                />
              ))
            }
          </>
        )}
      </section>
    </>
  )
}