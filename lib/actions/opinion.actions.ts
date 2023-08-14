"use server"

import { revalidatePath } from "next/cache";
import Opinion from "../models/opinion.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function postOpinion({text, author, communityId, path}: Params) {
    

    try{
        connectToDB();
        const createdOpinion = await Opinion.create({
            text,
            author,
            community: null,
        });

        //Update user model
        await User.findByIdAndUpdate(author, {
            $push: { opinions: createdOpinion._id }
        })

        revalidatePath(path);

    } catch(error: any) {
        throw new Error(`Error creating opinion: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDB();

    //Calulate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch the posts that have no parents (top-level opinions...)
    const postQuery = Opinion.find({ parentId: { $in: [null, undefined]} })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User})
    .populate({ 
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalPostCount = await Opinion.countDocuments({ parentId: { $in: [null, undefined]} })

    const posts = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext }
}

export async function fetchOpinionById(id: string) {
    connectToDB();

    try{
        const opinion = await Opinion.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Opinion,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

            return opinion;
    } catch (error: any) {
        throw new Error(`Error fetching opinion: ${error.message}`)
    }
}

export async function addDisagreementToThread(
    opinionId: string,
    disagreementText: string,
    userId: string,
    path: string,
) {
    connectToDB

    try{
        // Find orginal opinion by ID
        const originalOpinion = await Opinion.findById(opinionId);

        if(!originalOpinion) {
            throw new Error("Opinion not found")
        }

        //Create a new opinion wit the disagreement text
        const disagreementOpinion = new Opinion({
            text: disagreementText,
            author: userId,
            parentId: opinionId,
        })

        //Save the new opinion
        const savedDisagreementOpinion = await disagreementOpinion.save();

        //Update the original opinion ti include the new disagreement
        originalOpinion.children.push(savedDisagreementOpinion._id);

        //Save the original opinion
        await originalOpinion.save();
        
    } catch(error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }

}