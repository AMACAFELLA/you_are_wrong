import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { repostOpinion } from '@/lib/actions/opinion.actions';
export async function POST(req: Request) {
    const { pathname, opinionId } = await req.json()

    const { userId } = auth();

    if (!userId)
        NextResponse.json({ "message": "Not Authenticated" }, { status: 401 })
    if (!pathname || !opinionId)
        NextResponse.json({ "message": "Bad Request" }, { status: 400 })
    if (userId) {
        const currentUserId = (await fetchUser(userId))._id
        const data = await repostOpinion({ userId: currentUserId, pathname, opinionId });

        return NextResponse.json(data);
    }
}