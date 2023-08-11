import PostOpinion from "@/components/forms/PostOpinion";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

async function Page() {
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">Post Opinion</h1> 

            <PostOpinion userId={userInfo._id} />
        </>
    )
}

export default Page;