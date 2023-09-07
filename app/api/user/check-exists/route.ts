import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { checkEmailExists, checkUsernameExists, fetchUser } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let username = searchParams.get('username')
    let email = searchParams.get('email')
    const { userId } = auth();
    let currentUserId;
    if (userId && username) {
        currentUserId = (await fetchUser(userId))._id
        const data = await checkUsernameExists({ username, userId: currentUserId });
        return NextResponse.json({ "result": data });
    }
    else if (!userId && username) {
        const data = await checkUsernameExists({ username });
        return NextResponse.json({ "result": data });
    }
    else if (!userId && email) {
        const data = await checkEmailExists({ email });
        return NextResponse.json({ "result": data });
    }
    else {
        return NextResponse.json({ "result": false, message: "Not Authorized" }, { status: 401 })
    }
}