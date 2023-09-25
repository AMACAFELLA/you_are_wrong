"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../db/mongoose"
import User from "../models/user.model"
import Opinion from "../models/opinion.model"
import { FilterQuery, SortOrder } from "mongoose"
import clerkClient from "@clerk/clerk-sdk-node"
import { fetchOpinionsByQuery, fetchUserTotalOpinionsCount } from "./opinion.actions"
import Vote from "../models/vote.model"
import { fetchFollowers, findFollowRecord } from "./follow.action"
import { redirect } from "next/dist/server/api-utils"
import { digitalRainbowColors } from "@/constants"

interface ParamsType {

    userId: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    image: string;
    path: string;
};
const randomColorKey = (min: number, max: number) => {
    return Math.floor(Math.random() * max) + min;
}

const updateUser = async ({
    userId,
    username,
    email,
    name,
    bio,
    image,
    path
}: ParamsType): Promise<void> => {
    try {
        await connectToDb()

        const new_random_color = digitalRainbowColors[randomColorKey(1, 20)]

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                email: email,
                name,
                bio,
                color: new_random_color,
                image: image.startsWith("https://img.clerk.com") ? "" : image,
                onboarded: true
            }, { upsert: true }
        )
        // TODO: update user profile For Clerk as well
        const params = {
            username,
            firstName: name,
        };
        // See table below for all supported attributes
        const clerkUpdatedUser = await clerkClient.users.updateUser(
            userId,
            params
        );
        // console.log(clerkUpdatedUser);
        if (path === "/profile/edit") {
            revalidatePath(path)
        }

    } catch (e: any) {
        throw new Error(`Failed to create update user ${e.message}`)
    }
}

const fetchUser = async (userId: string): Promise<any> => {
    try {
        await connectToDb()
        return await User
            .findOne({ id: userId })
    } catch (e: any) {
        throw new Error("Failed to fetch user " + e.message)
    }
}

const fetchUserAccount = async (accountId: string, userId: string): Promise<any> => {
    let userAccount = await fetchUser(accountId)
    if (!userAccount) return null
    userAccount = JSON.parse(JSON.stringify(userAccount))
    const res = await findFollowRecord({ followerId: userId, followingId: userAccount._id })
    userAccount.follow = res
    return userAccount
}

const fetchUserById = async (user_Id: string): Promise<any> => {
    try {
        await connectToDb()
        return await User
            .findOne({ _id: user_Id })
    } catch (e: any) {
        throw new Error("Failed to fetch user " + e.message)
    }
}
const fetchUserOpinions = async ({ pageNumber = 1, pageSize = 30, currentUserId, accountId, label, sortBy }: PaginatePropsTypeByQuery) => {
    try {
        await connectToDb()
        // fetch all Opinion authored by the specific user
        // TODO: needs paginate like home Opinion
        // TODO: Populate Community
        const result = await fetchOpinionsByQuery({ pageNumber, pageSize, currentUserId, accountId, label, sortBy })
        return result
    } catch (e: any) {
        console.log("Failed to fetch user opinions " + e.message)
        return { result: false, message: "Account not found", status: 404 }
    }
}

const fetchUserOpinionsTotal = async ({ accountId, label }: { accountId: string, label: string }) => {
    try {
        await connectToDb()
        // fetch all Opinion authored by the specific user
        // TODO: needs paginate like home Opinion
        // TODO: Populate Community
        const result = await fetchUserTotalOpinionsCount({ accountId, label })
        return result
    } catch (e: any) {
        console.log("Failed to fetch user Opinions " + e.message)
        return { result: false, message: "Account not found", status: 404 }
    }
}

interface SearchUsersType {
    searchString: string
    pageNumber: number
    pageSize: number
    userId: string | undefined
    sortBy: SortOrder
}
const searchUsers = async ({
    searchString = "",
    pageNumber = 1,
    pageSize = 10,
    userId,
    sortBy = "desc" }: SearchUsersType) => {
    try {
        await connectToDb()
        // paginate 

        const skipAmount = (pageNumber - 1) * pageSize

        // regex search

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> =
            // later
            // userId ? 
            // {
            //     id: { $ne: userId },
            // } : 
            {}
        if (searchString.trim().length > 0) {

            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = {
            followersCount: sortBy
        }

        const usersQuery = User.find(query, { _id: 1, id: 1, name: 1, username: 1, image: 1, color: 1 })
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const hasNext = totalUsersCount > skipAmount + users.length


        // const x = await RandomDelay(1)
        const url = `/api/user/search?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchString}&sort=${sortBy.toString()}`
        return { hasNext, docs: users, totalUsersCount, pageSize, pageNumber, url }

    } catch (e: any) {
        throw new Error("Failed fetch search users " + e.message)
    }
}
const RandomDelay = async (second: number) => {
    return new Promise((resolve) => {


        setTimeout(() => {
            return resolve(true)
        }, (Math.random() + 0.3) * second * 1000)
    })
}
const getActivity = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    try {
        await connectToDb()
        if (currentUserId) {
            // currentUserId = JSON.parse(currentUserId)
            const user = (await User.findOne({ id: currentUserId }, { _id: 1, name: 1, id: 1, username: 1 }))
            if (user && user._id) {

                const repliesDoc = await getReplies({ pageNumber, pageSize, currentUserId: user._id })
                const votesDoc = await getVotes({ pageNumber, pageSize, currentUserId: user._id })
                const mentionsDoc = await getMentions({ pageNumber, pageSize, currentUserId: user._id })
                const repostsDoc = await getReposts({ pageNumber, pageSize, currentUserId: user._id })
                const followsDoc = await fetchFollowers({ pageNumber, pageSize, accountId: user._id })

                const hasNext = repliesDoc.hasNext || votesDoc.hasNext || mentionsDoc.hasNext || repostsDoc.hasNext || followsDoc.hasNext
                let docs: any = []
                const mentions = mentionsDoc.mentions.reduce((acc, item) => {
                    return acc.concat({
                        type: "mention",
                        message: "mentioned you here",
                        subject: item.author,
                        link: "/opinion/" + item._id,
                        createdAt: item.createdAt
                    })
                }, [])
                const follows = followsDoc.docs?.reduce((acc, item) => {
                    return acc.concat({
                        type: "follow",
                        message: "followed you",
                        subject: item.follower,
                        link: "/profile/" + item.follower.id,
                        createdAt: item.createdAt
                    })
                }, [])
                const reposts = repostsDoc.reposts.reduce((acc, item) => {
                    return acc.concat({
                        type: "repost",
                        message: "reposted your opinion",
                        subject: item.author,
                        link: "/opinion/" + item._id,
                        createdAt: item.createdAt
                    })
                }, [])
                const replies = repliesDoc.replies.reduce((acc, item) => {
                    return acc.concat({
                        type: "reply",
                        message: "disagreed to your opinion",
                        subject: item.author,
                        link: "/opinion/" + item.parentId,
                        createdAt: item.createdAt
                    })
                }, [])
                const votes = votesDoc.votes.reduce((acc, item) => {

                    return acc.concat({
                        type: "vote",
                        message: `${item.type.toString().toLowerCase()}agreed to your opinion`,
                        subject: item.voter,
                        link: "/opinion/" + item.opinion._id,
                        createdAt: item.createdAt
                    })
                }, [])
                docs = docs.concat(mentions)
                docs = docs.concat(follows)
                docs = docs.concat(replies)
                docs = docs.concat(votes)
                docs = docs.concat(reposts)
                const sortedDocs = docs.sort(function (a: any, b: any) {
                    return b.createdAt - a.createdAt;
                });
                return { hasNext, docs: sortedDocs, pageSize, pageNumber };
            }
            else {
                return []
            }
        }
        else {
            return []
        }

    } catch (e: any) {
        throw new Error("Failed to fetch activity " + e.message)
    }
}

const getVotes = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    const skipAmount = (pageNumber - 1) * pageSize
    const userOpinions = await Opinion.find({ author: currentUserId })
    const opinionsIds = userOpinions.reduce((acc, userOpinion) => {
        return acc.concat(userOpinion._id);
    }, []);
    const baseQuery = { voter: { $ne: currentUserId }, opinion: { $in: opinionsIds } }

    const votes = await Vote.find(baseQuery)
        .populate({
            path: "voter",
            model: User,
            select: "_id id name username image followersCount followingsCount color"
        })
        .populate({
            path: "opinion",
            model: Opinion,
            select: "_id text"
        })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalVotes = await Vote.countDocuments(baseQuery)
    const hasNext = totalVotes > skipAmount + votes.length
    return { hasNext, votes, totalVotes, pageSize, pageNumber }
}
const getMentions = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {

    const skipAmount = (pageNumber - 1) * pageSize
    const account = (await User.findOne({ _id: currentUserId }, { username: 1, id: 1 }))
    const regex = RegExp(`/${account.id}">`, 'i')  // only username matches having a tag around
    const baseQuery = { text: { $regex: regex }, author: { $ne: currentUserId } }

    const mentions = await Opinion.find(baseQuery)
        .populate({
            path: "repost",
            model: Opinion,
            populate: {
                path: "author",
                model: User
            }
        })
        .populate({
            path: "author",
            model: User,
            select: "_id id name username image followersCount followingsCount color"
        })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalMentions = await Opinion.countDocuments(baseQuery)
    const hasNext = totalMentions > skipAmount + mentions.length
    return { hasNext, mentions, totalMentions, pageSize, pageNumber }
}
const getReposts = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    const skipAmount = (pageNumber - 1) * pageSize
    const userOpinions = await Opinion.find({ author: currentUserId })
    const userOpinionIds: any = userOpinions.reduce((acc, userOpinion) => {
        return acc.concat(userOpinion._id);
    }, []);

    const query = {
        repost: { $in: userOpinionIds },
        author: { $ne: currentUserId }
    }
    const reposts = await Opinion.find(query).populate({
        path: "author",
        model: User,
        select: "_id id name username image followersCount followingsCount color"
    })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalRepostsCount = await Opinion.countDocuments(query)

    const hasNext = totalRepostsCount > skipAmount + reposts.length

    return { hasNext, reposts, totalRepostsCount, pageSize, pageNumber }
}
const getReplies = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    const skipAmount = (pageNumber - 1) * pageSize
    const userOpinions = await Opinion.find({ author: currentUserId })

    const childOpinionIds: any = userOpinions.reduce((acc, userOpinion) => {
        return acc.concat(userOpinion.children);
    }, []);
    const query = {
        _id: { $in: childOpinionIds },
        author: { $ne: currentUserId }
    }
    const replies = await Opinion.find(query).populate({
        path: "author",
        model: User,
        select: "_id id name username image followersCount followingsCount color"
    })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalRepliesCount = await Opinion.countDocuments(query)


    const hasNext = totalRepliesCount > skipAmount + replies.length

    return { hasNext, replies, totalRepliesCount, pageSize, pageNumber }
}
const checkUsernameExists = async ({ username, userId }: { username: string, userId?: string }) => {
    try {
        await connectToDb();
        let result = await User.findOne({ username: username }, { _id: 1, email: 1, username: 1 })
        if (result && userId && result?._id.toString() === userId)
            return true

        return !result;
    } catch (e: any) {
        throw new Error("Check user exists error : " + e.message)
    }
}
const checkEmailExists = async ({ email, userId }: { email: string, userId?: string }) => {
    try {
        await connectToDb();
        let result = await User.findOne({ email: email }, { _id: 1, email: 1, username: 1 })
        if (result && userId && result?._id.toString() === userId)
            return false


        return !result;
    } catch (e: any) {
        throw new Error("Check user exists error : " + e.message)
    }
}

const autoCompleteUsernames = async ({ input }: { input: string }) => {
    try {
        if (input.length < 2) {
            return JSON.stringify([])
        }
        await connectToDb()
        const regex = RegExp("^" + input, 'i')
        // await RandomDelay(0.2)
        return JSON.stringify(await User.find({ username: { $regex: regex } }, { _id: 1, id: 1, username: 1, image: 1, name: 1, color: 1 }))
    } catch (e: any) {
        console.error("Check user exists error : " + e.message)
        return JSON.stringify([])

    }
}

export {
    updateUser,
    fetchUser,
    fetchUserById,
    fetchUserOpinions,
    searchUsers,
    getActivity,
    checkUsernameExists,
    checkEmailExists,
    autoCompleteUsernames,
    RandomDelay,
    fetchUserAccount,
    fetchUserOpinionsTotal
}

