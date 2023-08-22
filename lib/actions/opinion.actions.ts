"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Opinion from "../models/opinion.model";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level opinions) (a opinion that is not a comment/reply).
    const postsQuery = Opinion.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: "author",
            model: User,
        })
        .populate({
            path: "community",
            model: Community,
        })
        .populate({
            path: "children", // Populate the children field
            populate: {
                path: "author", // Populate the author field within children
                model: User,
                select: "_id name parentId image", // Select only _id and username fields of the author
            },
        });

    // Count the total number of top-level posts (opinions) i.e., opinions that are not comments.
    const totalPostsCount = await Opinion.countDocuments({
        parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
    giphyId: string | null,
}

export async function postOpinion({ text, author, communityId, path, giphyId }: Params
) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const createdOpinion = await Opinion.create({
            text,
            author,
            community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
            giphyId,
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
            $push: { opinions: createdOpinion._id },
        });

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: { opinions: createdOpinion._id },
            });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create opinions: ${error.message}`);
    }
}

async function fetchAllChildOpinions(opinionId: string): Promise<any[]> {
    const childOpinions = await Opinion.find({ parentId: opinionId });

    const descendantOpinions = [];
    for (const childOpinion of childOpinions) {
        const descendants = await fetchAllChildOpinions(childOpinion._id);
        descendantOpinions.push(childOpinion, ...descendants);
    }

    return descendantOpinions;
}

export async function deleteOpinion(id: string, path: string): Promise<void> {
    try {
        connectToDB();

        // Find the opinion to be deleted (the main opinion)
        const mainOpinion = await Opinion.findById(id).populate("author community");

        if (!mainOpinion) {
            throw new Error("Opinion not found");
        }

        // Fetch all child opinions and their descendants recursively
        const descendantOpinions = await fetchAllChildOpinions(id);

        // Get all descendant opinion IDs including the main opinion ID and child opinion IDs
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

        const uniqueCommunityIds = new Set(
            [
                ...descendantOpinions.map((opinion) => opinion.community?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainOpinion.community?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        // Recursively delete child opinions and their descendants
        await Opinion.deleteMany({ _id: { $in: descendantOpinionIds } });

        // Update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { opinions: { $in: descendantOpinionIds } } }
        );

        // Update Community model
        await Community.updateMany(
            { _id: { $in: Array.from(uniqueCommunityIds) } },
            { $pull: { opinions: { $in: descendantOpinionIds } } }
        );

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete opinion: ${error.message}`);
    }
}

export async function fetchOpinionById(opinionId: string) {
    connectToDB();

    try {
        const opinion = await Opinion.findById(opinionId)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image",
            }) // Populate the author field with _id and username
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            }) // Populate the community field with _id and name
            .populate({
                path: "children", // Populate the children field
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id id name parentId image", // Select only _id and username fields of the author
                    },
                    {
                        path: "children", // Populate the children field within children
                        model: Opinion, // The model of the nested children (assuming it's the same "Opinion" model)
                        populate: {
                            path: "author", // Populate the author field within nested children
                            model: User,
                            select: "_id id name parentId image", // Select only _id and username fields of the author
                        },
                    },
                ],
            })
            .exec();

        return opinion;
    } catch (err) {
        console.error("Error while fetching opinion:", err);
        throw new Error("Unable to fetch opinion");
    }
}

export async function addDisagreementToOpinion(
    opinionId: string,
    opinionText: string,
    userId: string,
    path: string
) {
    connectToDB();

    try {
        // Find the original opinion by its ID
        const originalOpinion = await Opinion.findById(opinionId);

        if (!originalOpinion) {
            throw new Error("Opinion not found");
        }

        // Create the new opinion
        const disagreementOpinion = new Opinion({
            text: opinionText,
            author: userId,
            parentId: opinionId, // Set the parentId to the original opinion's ID
        });

        // Save the comment opinion to the database
        const savedDisagreementOpinion = await disagreementOpinion.save();

        // Add the comment opinion's ID to the original opinion's children array
        originalOpinion.children.push(savedDisagreementOpinion._id);

        // Save the updated original opinion to the database
        await originalOpinion.save();

        revalidatePath(path);
    } catch (err) {
        console.error("Error while adding opinion:", err);
        throw new Error("Unable to add opinion");
    }
}

export async function repostOpinion(opinionId: string,
    userId: string) {

    try {

        // Find the opinion
        let opinion = await Opinion.findById(opinionId);

        // Check if user already reposted
        if (opinion.reposts.includes(userId)) {
            // Remove repost
            opinion.reposts.pull(userId);
            opinion.repostCount--;
        } else {
            // Add repost
            opinion.reposts.push(userId);
            opinion.repostCount++;
        }

        await opinion.save();

        // Update user's reposted opinions
        await User.updateOne(
            { _id: userId },
            { $push: { repostedOpinions: opinionId } }
        );

    } catch (error) {
        console.log(error);
        throw new Error('Error reposting opinion')
    }

}