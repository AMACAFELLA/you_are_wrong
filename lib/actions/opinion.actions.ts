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