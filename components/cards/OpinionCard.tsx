
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "../../lib/utils";
import DeleteOpinion from "../forms/DeleteOpinion";
import AgreedOpinions from "../forms/AgreedOpinions";

interface Props {
    id: string;
    currentUserId: string;
    currentUserInfoID: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    disagreements: {
        author: {
            image: string;
        };
    }[];
    isDisagreement?: boolean;
    giphyId: string | null;
    agrees: {
        user: {
            id: string;
        }
    }[];
}

function OpinionCard({
    id,
    currentUserId,
    currentUserInfoID,
    parentId,
    content,
    author,
    community,
    createdAt,
    disagreements,
    isDisagreement,
    giphyId,
    agrees,
}: Props) {

    return (
        <article
            className={`flex w-full flex-col rounded-xl ${isDisagreement ? "px-0 xs:px-7" : "bg-dark-2 p-7"
                }`}
        >
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${author?.id}`} className='relative h-11 w-11'>
                            <Image
                                src={author?.image}
                                alt='user_community_image'
                                fill
                                className='cursor-pointer rounded-full'
                            />
                        </Link>

                        <div className='thread-card_bar' />
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${author?.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {author?.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2'>
                            {content}
                            {giphyId && (
                                <div className="mt-3">
                                    <img src={`https://media.giphy.com/media/${giphyId}/giphy.gif`} alt="GIF" />
                                </div>
                            )}
                        </p>

                        <div className={`${isDisagreement && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                {agrees && agrees.includes(JSON.parse(currentUserInfoID)) ? (
                                    <AgreedOpinions opinionId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserInfoID} imageSource="/assets/heart-filled.svg" />
                                ) : (
                                        <AgreedOpinions opinionId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserInfoID} imageSource="/assets/heart-gray.svg" />
                                )
                                }
                                <Link href={`/opinion/${id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='reply'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain'
                                    />
                                </Link>
                                
                                <Image
                                    src='/assets/share.svg'
                                    alt='share'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                            </div>
                            {/* Shows link with text for # of disagreements and agreements */}
                            <Link href={`/opinion/${id}`}>
                                <p className="mt-1 text-subtle-medium text-gray-1">{disagreements.length} disagreements - {agrees && (agrees.length)} agreements</p>
                            </Link>
                            {isDisagreement && disagreements.length > 0 && (
                                <Link href={`/opinion/${id}`}>
                                    <p className='mt-1 text-subtle-medium text-gray-1'>
                                        {disagreements.length} repl{disagreements.length > 1 ? "ies" : "y"} - {agrees && (agrees.length)} agreements
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <DeleteOpinion
                    opinionId={JSON.stringify(id)}
                    currentUserId={currentUserId}
                    authorId={author?.id}
                    parentId={parentId}
                    isDisagreement={isDisagreement}
                />
            </div>

            {!isDisagreement && disagreements.length > 0 && (
                <div className='ml-1 mt-3 flex items-center gap-2'>
                    {disagreements.slice(0, 2).map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt={`user_${index}`}
                            width={24}
                            height={24}
                            className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                        />
                    ))}

                    <Link href={`/opinion/${id}`}>
                        <p className='mt-1 text-subtle-medium text-gray-1'>
                            {disagreements.length} repl{disagreements.length > 1 ? "ies" : "y"}
                        </p>
                    </Link>
                </div>
            )}

            {!isDisagreement && community && (
                <Link
                    href={`/communities/${community.id}`}
                    className='mt-5 flex items-center'
                >
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(createdAt)}
                        {community && ` - ${community.name} Community`}
                    </p>

                    <Image
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        className='ml-1 rounded-full object-cover'
                    />
                </Link>
            )}
        </article>
    );
}

export default OpinionCard;
