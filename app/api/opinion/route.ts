import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchOpinions } from '@/lib/actions/opinion.actions';
import { fetchUser } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "10"
    const sortBy = searchParams.get("sortBy") || "votePoints"

    const { userId } = auth();
    let currentUserId;
    if (userId)
        currentUserId = (await fetchUser(userId))._id
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)

    const data = await fetchOpinions({ pageNumber: pageNumber_int, pageSize: pageSize_int, currentUserId, sortBy: (sortBy as "votePoints" | "createdAt") });

    return NextResponse.json(data);
}