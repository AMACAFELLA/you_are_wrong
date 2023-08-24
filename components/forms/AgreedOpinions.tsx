"use client";

import { useState, useEffect } from 'react';

import Image from "next/image";
import { agreeToOpinion } from "@/lib/actions/opinion.actions";

interface Props {
    opinionId: string;
    currentUserId: string;
    isAgreed: boolean;
}

function AgreedOpinions({ opinionId, currentUserId, isAgreed: initialIsAgreed }: Props) {

    const [isAgreed, setIsAgreed] = useState(initialIsAgreed);

    const handleAgreeClick = async () => {
        try {
            await agreeToOpinion(opinionId, currentUserId); // Toggle the agree status
            setIsAgreed(!isAgreed); // Toggle the state in the component
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Image
            src={isAgreed ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
            alt='heart'
            width={24}
            height={24}
            className='cursor-pointer object-contain'
            onClick={handleAgreeClick}
        />
    );
}

export default AgreedOpinions;
