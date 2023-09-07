import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { fetchFollowers, fetchFollowings, followAction, unfollowAction } from '@/lib/actions/follow.action';
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let accountId = searchParams.get('id') || undefined
    let type = searchParams.get('type') || "followings"
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "20"
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)
    const { userId } = auth();

    if (!accountId)
        return NextResponse.json({ result: false, message: "account user_id not found" }, { status: 400 })

    if (userId) {
        const follower = (await fetchUser(userId))._id
        if (follower) {

            if (type === "followings") {
                var data = await fetchFollowings({ accountId, pageSize: pageSize_int, pageNumber: pageNumber_int })
            }
            else {
                // we show the followers for any other types
                var data = await fetchFollowers({ accountId, pageSize: pageSize_int, pageNumber: pageNumber_int })
            }

            return NextResponse.json(data)
        }
        else {
            return NextResponse.json({ result: false, message: "User not found" }, { status: 401 })
        }
    }
    else {
        return NextResponse.json({ result: false, message: "Not Authorized" }, { status: 401 })
    }
}

export async function POST(req: Request) {
    const { type, following, path } = await req.json()
    if (type === "follow" || type === "unfollow") {
        const { userId } = auth();
        if (userId) {
            const follower = (await fetchUser(userId))._id
            if (follower) {
                if (type === "follow") {
                    const data = await followAction({ follower, following, path })
                    return NextResponse.json(data)
                }
                else {
                    const data = await unfollowAction({ follower, following, path })
                    return NextResponse.json(data)
                }

            }
            else {
                return NextResponse.json({ result: false, message: "User not found" }, { status: 401 })

            }
        }
        else {
            return NextResponse.json({ result: false, message: "Not Authorized" }, { status: 401 })
        }
    }
    else {
        NextResponse.json({ result: false, message: "Bad Request" }, { status: 400 })
    }
}

