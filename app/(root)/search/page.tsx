import UserCard from "@/components/cards/UserCard";
import OpinionsTab from "@/components/shared/OpinionsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUserPosts, fetchUsers } from "@/lib/actions/user.actions";
import Opinion from "@/lib/models/opinion.model";
import { currentUser } from "@clerk/nextjs";
import { table } from "console";
import Image from "next/image";
import { redirect } from 'next/navigation';

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    // Fetch users

    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    })
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <div className="mt-14 felx flex-col gap-9">
                {result.users.length == 0 ? (
                    <p className="no-result">No users</p>
                ) : (<>
                    {result.users.map((person) => (
                        <UserCard
                           key={person.id}
                           id={person.id}
                           name={person.name}
                           username={person.username}
                           imgUrl={person.image}
                           personType='User'
                        />
                    ))}
                </>)}
            </div>
        </section>
    )
}

export default Page;