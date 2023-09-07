"use server"

import { FilterQuery } from "mongoose"
import { connectToDb } from "../db/mongoose"
import Follow from "../models/follow.model"
import User from "../models/user.model"
import { fetchUserById } from "./user.actions"
import { revalidatePath } from "next/cache"

const followAction = async ({ follower, following, path }: FollowType) => {
    try {
        await connectToDb()
        const followerUser = await fetchUserById(follower)
        const followingUser = await fetchUserById(following)
        if (!followingUser)
            return { result: false, message: "Following user now found : " + following.toString() }
        if (!followerUser)
            return { result: false, message: "Follower user now found : " + follower.toString() }

        const flw = await Follow.findOne({ follower: follower, following: following })
        if (!flw) {
            const followDoc = await Follow
                .create(
                    { follower: follower, following: following },
                )

            await updateFollowsCountForUsers({ followingUser, followerUser })
            revalidatePath(path)
            // revalidatePath("/profile")
            return JSON.stringify(followDoc)
        }
        else {
            return JSON.stringify(flw)
        }

    } catch (e: any) {
        console.error("Follow Failed with error : " + e.message)
        return JSON.stringify({ result: false })
    }

}

const unfollowAction = async ({ follower, following, path }: FollowType) => {
    try {
        await connectToDb()
        const followerUser = await fetchUserById(follower)
        const followingUser = await fetchUserById(following)
        if (!followingUser)
            return { result: false, message: "Following user now found : " + following.toString() }
        if (!followerUser)
            return { result: false, message: "Follower user now found : " + follower.toString() }

        await Follow
            .deleteOne(
                { follower, following },
            )

        await updateFollowsCountForUsers({ followingUser, followerUser })
        revalidatePath(path)
        // revalidatePath("/profile")
        return JSON.stringify({ result: true, message: "Unfollow done" })
    } catch (e: any) {
        console.error("Unfollow Failed with error : " + e.message)
        return JSON.stringify({ result: false })
    }

}

const fetchFollowings = async ({ accountId, pageNumber = 1, pageSize = 20 }: { accountId: string, pageNumber: number, pageSize: number }) => {
    try {
        await connectToDb()
        const skipAmount = (pageNumber - 1) * pageSize


        const user = await fetchUserById(accountId)
        if (!user)
            return { result: false, message: "Account not found : " + accountId }

        const query = { follower: accountId }
        const followingsDocs = await Follow.find(query)
            .populate({
                path: "follower",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            })
            .populate({
                path: "following",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
        const total = await Follow.countDocuments(query)

        const hasNext = total > skipAmount + followingsDocs.length

        return { hasNext, docs: followingsDocs, total, pageSize, pageNumber }

    } catch (e: any) {
        throw new Error("Follow Failed with error : " + e.message)
    }
}

const fetchFollowers = async ({ accountId, pageNumber = 1, pageSize = 20 }: { accountId: string, pageNumber: number, pageSize: number }) => {
    try {
        await connectToDb()
        const skipAmount = (pageNumber - 1) * pageSize


        const user = await fetchUserById(accountId)
        if (!user)
            return { result: false, message: "Account not found : " + accountId }

        const query = { following: accountId }
        const followersDocs = await Follow.find(query)
            .populate({
                path: "follower",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            })
            .populate({
                path: "following",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
        const total = await Follow.countDocuments(query)

        const hasNext = total > skipAmount + followersDocs.length

        return { hasNext, docs: followersDocs, total, pageSize, pageNumber }

    } catch (e: any) {
        throw new Error("Follow Failed with error : " + e.message)
    }
}

const findFollowRecord = async ({ followingId, followerId }: { followingId: string, followerId: string }) => {
    try {
        await connectToDb()
        // console.log(followerId, "?", followingId)
        const doc = await Follow.findOne({ follower: followerId, following: followingId })
        return (!!doc)
    } catch (e: any) {
        throw new Error("Fetch Follow Record with error : " + e.message)
    }
}

const updateFollowsCountForUsers = async ({ followerUser, followingUser }:
    {
        followerUser: FilterQuery<typeof User>,
        followingUser: FilterQuery<typeof User>
    }) => {
    const totalFollowingsForFollowerUser = await Follow.countDocuments({ follower: followerUser._id })
    const totalFollowersForFollowingUser = await Follow.countDocuments({ following: followingUser._id })

    followerUser.followingsCount = totalFollowingsForFollowerUser
    followingUser.followersCount = totalFollowersForFollowingUser

    await followingUser.save()
    await followerUser.save()

    return
}


export { followAction, unfollowAction, fetchFollowers, fetchFollowings, findFollowRecord }