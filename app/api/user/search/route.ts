import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser, searchUsers } from '@/lib/actions/user.actions';
import { SortOrder } from 'mongoose';


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "10"
    let searchString = searchParams.get('search') || ""
    let sortBy = (searchParams.get("sort") || "desc") as SortOrder
    const { userId } = auth();
    let currentUserId;
    if (userId)
        currentUserId = (await fetchUser(userId))._id || undefined
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)
    const data = await searchUsers({ pageNumber: pageNumber_int, pageSize: pageSize_int, searchString, userId: currentUserId, sortBy });
    return NextResponse.json(data);
}
