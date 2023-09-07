"use server"

import { revalidatePath } from "next/cache";
import { connectToDb } from "../db/mongoose"
import Opinion from "../models/opinion.model";
import User from "../models/user.model";
import { SortOrder, Types } from "mongoose";
import Vote from "../models/vote.model";
import { handleVotesCount, replaceMentions } from "./_helper.actions";
import { fetchFollowings } from "./follow.action";

const createOpinion = async ({ text, author, communityId, path, repost }: PropsType) => {
    try {
        await connectToDb();
        // create opinion model
        if (!repost)
            text = await replaceMentions(text)
        const newOpinion = await Opinion.create({
            text,
            author,
            community: null,
            repost: repost
        })
        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { opinions: newOpinion._id }
        })

        revalidatePath(path)
        return true
    } catch (e: any) {
        throw new Error("Create Opinion Failed " + e.message)
    }
}

const repostOpinion = async ({ opinionId, userId, pathname }: { opinionId: string, userId: string, pathname: string }) => {
    try {
        const targetOpinion = await Opinion.findOne({ _id: opinionId })
        if (targetOpinion) {

            return await createOpinion({
                text: targetOpinion.text,
                author: userId,
                communityId: null,
                path: pathname,
                repost: opinionId,
            });
        }
        else {
            throw new Error(`Opinion ${opinionId} not found`)
        }
    } catch (e: any) {
        throw new Error("Repsot failed " + e.message)
    }
}


const fetchOpinionsByQuery = async ({ pageNumber = 1, pageSize = 30, currentUserId, accountId, label, sortBy = "createdAt" }: PaginatePropsTypeByQuery) => {
    const skipAmount = (pageNumber - 1) * pageSize
    // fetch opinions that have no parent
    // console.log(accountId)
    let baseQuery = {};
    if (accountId) {
        if (typeof accountId === "object") {
            baseQuery = { author: { $in: accountId }, parentId: { $in: [null, undefined] } }
        }
        else {
            if (label === "opinions")
                baseQuery = { author: { $in: [accountId] }, parentId: { $in: [null, undefined] } }
            else if (label === "replies") {
                baseQuery = { author: { $in: [accountId] }, parentId: { $nin: [null, undefined] } }
            }
            else if (label === "mentioned") {
                const account = (await User.findOne({ _id: accountId }, { username: 1, id: 1 }))
                if (!account) return { result: false, message: "Account not found", status: 404 }
                const regex = RegExp(`/${account.id}">`, 'i')  // only username matches having a tag around
                baseQuery = { text: { $regex: regex } }
            }
        }
    } else {
        baseQuery = { parentId: { $in: [null, undefined] } }
    }
    const sort: string | { [key: string]: SortOrder | { $meta: any; }; } | [string, SortOrder][] | null | undefined = {}

    sort[sortBy] = "desc"
    if (sortBy === "createdAt")
        sort["votePoints"] = "desc"
    else
        sort["createdAt"] = "desc"

    const opinionsQuery = Opinion.find(baseQuery).sort(sort)
        .skip(skipAmount)
        .limit(pageSize)
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
            model: User
        }).populate({
            path: "children",
            populate: [{
                path: "author",
                model: User,
                select: "_id username name parentId image createdAt followersCount followingsCount color"
            }],

        })
    if (label === "replies") {
        opinionsQuery.populate({
            path: "parentId",
            model: Opinion,
            select: "_id text createdAt author",
            populate: {
                path: "author",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            }
        })
    }

    const opinions = await opinionsQuery.exec()
    let opinionsMyVotesQuery;
    let opinions_my_votes_only
    if (currentUserId) {
        opinionsMyVotesQuery = Opinion.find(baseQuery).sort(sort)
            .skip(skipAmount)
            .limit(pageSize).populate({
                path: "votes",
                model: Vote,
                match: { voter: currentUserId },
                select: "_id type voter opinion",

            });
        opinions_my_votes_only = await opinionsMyVotesQuery.exec()
    }

    let opinions_final = handleVotesCount(opinions, opinions_my_votes_only)


    // console.log(opinions_final)
    const totalOpinionsCount = await Opinion.countDocuments(baseQuery)

    // self votes
    const hasNext = (totalOpinionsCount > skipAmount + opinions.length)

    return {
        // @ts-ignore
        docs: opinions_final,
        hasNext,
        totalOpinionsCount,
        pageNumber,
        pageSize
    }
}

const fetchUserTotalOpinionsCount = async ({ accountId, label }: { accountId: string; label: string }) => {
    let baseQuery = {}
    if (label === "opinions")
        baseQuery = { author: { $in: [accountId] }, parentId: { $in: [null, undefined] } }
    else if (label === "replies") {
        baseQuery = { author: { $in: [accountId] }, parentId: { $nin: [null, undefined] } }
    }
    else if (label === "mentioned") {
        const account = (await User.findOne({ _id: accountId }, { username: 1, id: 1 }))
        if (!account) return { result: false, message: "Account not found", status: 404 }
        const regex = RegExp(`/${account.id}">`, 'i')  // only username matches having a tag around
        baseQuery = { text: { $regex: regex } }
    }
    const totalOpinionsCount = await Opinion.countDocuments(baseQuery)
    return totalOpinionsCount
}

const fetchOpinions = async ({ pageNumber = 1, pageSize = 30, currentUserId, sortBy = "createdAt" }: PaginatePropsType) => {
    try {
        await connectToDb()
        // Calculate the number of posts to skip(page we are on)
        return await fetchOpinionsByQuery({ pageNumber, pageSize, currentUserId, accountId: null, sortBy })
    }
    catch (e: any) {
        console.error("Fetch Opinions Error " + e.message)
        return null;
    }
}

const fetchFollowingsOpinions = async ({ pageNumber = 1, pageSize = 30, currentUserId, sortBy = "createdAt" }: PaginatePropsType) => {
    try {
        await connectToDb()
        // Calculate the number of posts to skip(page we are on)
        const followings = await fetchFollowings({ accountId: currentUserId, pageNumber: 1, pageSize: 1000 })
        if (followings && followings.docs) {
            const followingsIds = followings.docs.reduce((ids, item) => {
                return ids.concat(item.following._id.toString())
            }, []) as string[]

            return await fetchOpinionsByQuery({ pageNumber, pageSize, currentUserId, accountId: followingsIds, sortBy })
        }
        else {
            return null
        }

    }
    catch (e: any) {
        console.error("Fetch Followings Opinions Error " + e.message)
        return null;
    }
}

const fetchAllChildOpinions = async (opinionId: string): Promise<any[]> => {
    const childOpinions = await Opinion.find({ parentId: opinionId });

    const descendantOpinions = [];
    for (const childOpinion of childOpinions) {
        const descendants = await fetchAllChildOpinions(childOpinion._id);
        descendantOpinions.push(childOpinions, ...descendants);
    }
    return descendantOpinions;
}
const deleteOpinion = async (id: string, userId: string, path: string): Promise<void> => {
    try {
        await connectToDb();

        // Find the Opinion to be deleted (the main Opinion)
        const mainOpinion = await Opinion.findOne({ _id: id, author: userId })
            .populate("author")
            .populate({
                path: "repost",
                model: Opinion,
                populate: {
                    path: "author",
                    model: User
                }
            });

        if (!mainOpinion) {
            throw new Error("Opinion not found");
        }
        // Fetch all child Opinion and their descendants recursively
        const descendantOpinions = await fetchAllChildOpinions(id);

        // Get all descendant Opinion IDs including the main Opinion ID and child Opinion IDs
        const descendantOpinionIds = [
            id,
            ...descendantOpinions.map((opinion) => opinion._id),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantOpinions.map((opinion) => opinion.author?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainOpinion.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        // Recursively delete child Opinion and their descendants
        await Opinion.deleteMany({ _id: { $in: descendantOpinionIds } });

        // Update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { opinions: { $in: descendantOpinionIds } } }
        );

        // Update Community model
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete opinion: ${error.message}`);
    }
}


const fetchOpinionById = async (id: string, currentUserId: string) => {
    try {
        await connectToDb()
        // TODO : populate communities
        const opinion = await Opinion.findById(id)
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
                select: "_id id name username image createdAt followersCount followingsCount color"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId username image createdAt followersCount followingsCount color",
                    },
                    {
                        path: "children",
                        model: Opinion,
                        populate: [{
                            path: "author",
                            model: User,
                            select: "_id id name parentId username image createdAt followersCount followingsCount color"
                        }]
                    },
                ]
            }).exec()
        const opinionWithMyVote = await Opinion.findById(id)
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
                select: "_id id name username image createdAt followersCount followingsCount color"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "votes",
                        model: Vote,
                        match: { voter: currentUserId },
                        select: "_id type voter opinion",

                    }
                ]
            }).populate({
                path: "votes",
                model: Vote,
                match: { voter: currentUserId },
                select: "_id type voter opinion",

            }).exec()
        let opinions_final = handleVotesCount([opinion], [opinionWithMyVote], true)
        return opinions_final[0]
    } catch (e: any) {
        console.log("Fetch Opinion failed " + e.message)
        return null
    }
}


const addDisagreementToOpinion = async (
    {
        authorId,
        text,
        opinionId,
        path
    }: DisagreementType) => {

    try {
        await connectToDb()
        //adding Disagreement
        // find original Opinion by id
        // console.log(opinionId)

        const originalOpinion = await Opinion.findById(opinionId)
        if (!originalOpinion) throw new Error("Opinion Not Found")
        text = await replaceMentions(text)
        // create new Opinion with Disagreement text
        const disagreementOpinion = new Opinion({
            text: text,
            author: authorId,
            // parentId: new Types.ObjectId(opinionId),
            parentId: opinionId

        })
        const savedDisagreementOpinion = await disagreementOpinion.save()

        // update original(parent) Opinion to include new Disagreement
        originalOpinion.children.push(savedDisagreementOpinion._id)
        await originalOpinion.save()
        revalidatePath(path)
    } catch (e: any) {
        throw new Error("Add Disagreement Failed " + e.message)
    }

}

const voteToOpinion = async (userId: string, type: VoteType, opinionId: string) => {
    try {
        await connectToDb()
        // const user = await User.findOne({ id: userId })
        // console.log(userId, "?", opinionId)
        if (userId) {
            const model = await Vote.findOneAndUpdate(
                { voter: userId, opinion: opinionId },
                { type: type }, { upsert: true, new: true }
            )
            // calculate votePoints
            const upVotes = await Vote.countDocuments({ opinion: opinionId, type: "up" })
            const downVotes = await Vote.countDocuments({ opinion: opinionId, type: "down" })
            const votePoints = upVotes - downVotes
            // console.log(model)
            if (type === "") {
                await Opinion.findOneAndUpdate({ _id: model.opinion }, {
                    $pull: { votes: model._id }, $set: { votePoints: votePoints }
                });
            }
            else {
                await Opinion.findOneAndUpdate({ _id: model.opinion }, {
                    $addToSet: { votes: model._id }, $set: { votePoints: votePoints }
                });
            }
        }
        return true
    } catch (e: any) {
        throw new Error("Vote Failed " + e.message)
    }
}
export {
    createOpinion,
    repostOpinion,
    fetchOpinions,
    fetchFollowingsOpinions,
    fetchUserTotalOpinionsCount,
    fetchOpinionById,
    addDisagreementToOpinion,
    voteToOpinion,
    fetchOpinionsByQuery,
    deleteOpinion
}