import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getActivity } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "10"
    const { userId } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)
    const data = await getActivity({ pageNumber: pageNumber_int, pageSize: pageSize_int, currentUserId: userId });

    return NextResponse.json(data);
}