import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { autoCompleteUsernames, fetchUser } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let input = searchParams.get('search') || ""
    const { userId } = auth();
    if (userId) {
        const currentUserId = (await fetchUser(userId))._id
        if (currentUserId) {
            const data = await autoCompleteUsernames({ input });
            return NextResponse.json(data);
        }
        else {
            return NextResponse.json({ result: false, message: "User not found" }, { status: 401 })
        }
    }
    else {
        return NextResponse.json({ result: false, message: "Not Authorized" }, { status: 401 })
    }
}
