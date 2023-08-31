import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import OpinionCard from "../cards/OpinionCard";

import { currentUser } from "@clerk/nextjs";

interface Props {
    currentUserId: string;
    currentUserInfoID: string;
    accountId: string;
    accountType: string;
    userAgrees: {
        user: { id: string; }
    }[];
}

const OpinionsTab = async ({ currentUserId, accountId, accountType}: Props) => {
    let result = await fetchUserPosts(accountId);
    
    if (!result) {
        redirect("/");
    }

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect('/onboarding');
    
    return (
        <section className="mt-9 flex-col gap-10">
            {result.opinions.map((opinion: any) => (
                <OpinionCard key={opinion._id}
                    id={opinion._id}
                    currentUserId={currentUserId}
                    currentUserInfoID={JSON.stringify(userInfo._id) || ""}
                    parentId={opinion.parentId}
                    content={opinion.text}
                    author={
                        accountType === "User"
                            ? { name: result.name, image: result.image, id: result.id }
                            : {
                                name: opinion.author.name,
                                image: opinion.author.image,
                                id: opinion.author.id,
                            }
                    }
                    community={opinion.community}
                    createdAt={opinion.createdAt}
                    disagreements={opinion.children}
                    giphyId={opinion.giphyId}
                    agrees= {opinion.userAgrees}
               /> 
            ))}
        </section>
    )
}

export default OpinionsTab;