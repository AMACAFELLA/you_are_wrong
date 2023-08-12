import OpinionCard from "@/components/cards/OpinionCard";
import { fetchOpinionById } from "@/lib/actions/opinion.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: {id: string }}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')

    const opinion = await fetchOpinionById(params.id)

    return (
        <section className="relative">
        <div>
            <OpinionCard
                key={opinion._id}
                id={opinion._id}
                currentUserId={user?.id || ""}
                parentId={opinion.parentId}
                content={opinion.text}
                author={opinion.author}
                community={opinion.community}
                createdAt={opinion.createdAt}
                disagreements={opinion.children}
            />
        </div>
    </section>
    )
}

export default Page;