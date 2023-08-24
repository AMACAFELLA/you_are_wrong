import OpinionCard from "@/components/cards/OpinionCard";
import Disagreement from "@/components/forms/Disagreement";
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

    const isAgreed = opinion.agrees.includes(user.id); 


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
                    giphyId={opinion.giphyId}
                    isAgreed={isAgreed}
                />
            </div>

            <div className="mt-7">
                <Disagreement
                    opinionId={opinion.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                                  
                />
            </div>

            <div className="mt-10">
                {opinion.children.map((childItem: any) => (
                    <OpinionCard
                        key={opinion._id}
                        id={childItem._id}
                        currentUserId={childItem?.id || ""}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        disagreements={childItem.children}
                        isDisagreement
                        giphyId={opinion.giphyId}
                        isAgreed= {childItem.isAgreed}
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;