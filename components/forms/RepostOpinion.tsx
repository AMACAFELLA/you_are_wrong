"use client";

import { useState } from "react";
import { repostOpinion } from "@/lib/actions/opinion.actions";
import Image from "next/image"; // Import the Image component
import { ObjectId } from "mongodb";

interface Props {
    opinionId: string;
    userId: string;
}

export default function RepostOpinion({ opinionId, userId }: Props) {
    const [isReposting, setIsReposting] = useState(false);

    async function handleRepost() {
        setIsReposting(true);

        try {
            await repostOpinion(new ObjectId(opinionId), new ObjectId(userId)); // Convert to ObjectId
            // repost successful
        } catch (error) {
            console.error("Error reposting opinion", error);
        } finally {
            setIsReposting(false);
        }
    }

    return (
        <button
            disabled={isReposting}
            onClick={handleRepost}
            className="cursor-pointer"
        >
            {isReposting ? (
                <Image
                    src="/assets/loading.gif" // Replace with loading image
                    alt="Reposting..."
                    width={24}
                    height={24}
                />
            ) : (
                <Image
                    src="/assets/repost.svg" // Replace with repost image
                    alt="Repost"
                    width={24}
                    height={24}
                />
            )}
        </button>
    );
}