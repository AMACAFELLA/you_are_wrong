import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import OpinionCard from "../cards/OpinionCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const OpinionsTab = async ({ currentUserId, accountId, accountType}: Props) => {
    let result = await fetchUserPosts(accountId);
    
    if(result) redirect('/')
    
    return (
        <section className="mt-9 flex-col gap-10">
            {result.opinions.map((opinion: any) => (
                <OpinionCard
                    key={opinion._id}
                    id={opinion._id}
                    currentUserId={currentUserId}
                    parentId={opinion.parentId}
                    content={opinion.text}
                    author={
                        accountType === 'User'
                        ? { name: result.name, image: result.image, id: result.id}
                        : { name: opinion.author.name, image: opinion.author.image,
                        id: opinion.author.id }
                    }
                    community={opinion.community}
                    createdAt={opinion.createdAt}
                    disagreements={opinion.children}
                />
            ))}
        </section>
    )
}

export default OpinionsTab;