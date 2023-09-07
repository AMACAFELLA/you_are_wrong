"use client";

import Link from "next/link";
import Image from "next/image";
import VoteBlock from "../opinionActions/VoteBlock";
import HTMLReactParser from "html-react-parser";
import { formattedDateString } from "../shared/helpers";
import DeleteOpinion from "../forms/DeleteOpinion";
import { comment } from "postcss";
import RepostModal from "../modals/RepostModal";
import ShareModal from "../modals/ShareModal";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Avatar from "../shared/Avatar";

const OpinionCard = ({
  id,
  currentUserId,
  repost,
  parentId,
  content,
  author,
  createdAt,
  disagreements,
  isDisagreement,
  isMainOpinion = false,
  votes,
  myVote,
}: OpinionProps) => {
  if (repost)
    try {
      repost = JSON.parse(repost);
    } catch (e) {}

  const parentOpinion: {
    _id: string;
    text: string;
    author: AuthorType;
  } | null = typeof parentId === "object" ? parentId : null;

  const contentRef = useRef(null);
  const [showMore, setShowMore] = useState(isMainOpinion);
  const [showLink, setShowLink] = useState(false);
  useLayoutEffect(() => {
    // debugger;
    // @ts-ignore
    if (contentRef.current?.clientWidth <= contentRef.current?.scrollWidth) {
      // @ts-ignore
      if (contentRef.current?.clientHeight > 19.6 * 6) {
        setShowLink(true);
      }
    }
  }, [contentRef]);
  const repostSubtitle = useMemo(
    () =>
      repost ? (
        <div className="flex gap-1 justify-start items-center">
          <Image
            src="/assets/repost_2.svg"
            alt="repost"
            width="18"
            height="18"
            className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
          />
          <Link
            href={`/opinion/${
              // @ts-ignore
              repost?._id
            }
      `}
            className="w-fit text-light-3 hover-to-secondary"
          >
            <h5 className="text-subtle-medium">
              Reposted From @
              {
                // @ts-ignore
                repost.author.username
              }
            </h5>
          </Link>
        </div>
      ) : (
        <></>
      ),
    []
  );

  const replySubtitle = useMemo(
    () =>
      parentOpinion ? (
        <div className="flex gap-1 justify-start items-center">
          <Image
            src="/assets/reply.svg"
            alt="reply"
            width="18"
            height="18"
            className="object-contain"
          />
          <Link
            href={`/opinion/${
              // @ts-ignore
              parentOpinion?._id
            }
      `}
            className="w-fit text-light-3 hover-to-secondary"
          >
            <h5 className="text-subtle-medium">
              Replied To @
              {
                // @ts-ignore
                parentOpinion.author.username
              }
            </h5>
          </Link>
        </div>
      ) : (
        <></>
      ),
    []
  );

  return (
    <article
      className={`flex w-full flex-col rounded-xl
    ${isDisagreement ? "pr-1 sm:px-7 mt-5" : "bg-dark-2 py-3 pl-3 pr-3 sm:p-7"} `}
    >
      <div className="flex justify-between items-start">
        <div className="flex w-full flex-1 flex-row gap-2">
          <div className="flex flex-col items-center ml-1">
            <Link href={`/profile/${author.id}`} className="relative w-10 h-10">
              <Avatar
                src={author.image}
                bg_color={author.color}
                alt="profile image"
                loadingText={author.name.charAt(0)}
              />
            </Link>

            <div
              className={`opinion-card_bar ${
                disagreements.length > 0 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-2 text-base-semibold">
                {author.name}
              </h4>
            </Link>
            {repostSubtitle}
            {replySubtitle}
            <div className="relative">
              <p
                ref={contentRef}
                className={`mt-2 text-small-regular text-light-2 transition-all duration-200 ease-in-out w-fit text-justify ${
                  !showMore ? "line-clamp-6 text-ellipsis" : ""
                }`}
              >
                {HTMLReactParser(content)}
              </p>
              {showLink && !isMainOpinion && (
                <a href={`/opinion/${id}`} className={`show-more_btn`}>
                  {showMore ? "Collapse" : "Read more ..."}
                </a>
              )}
            </div>
            <div
              className={`${
                isDisagreement && "gap-3 mb-2"
              } mt-4 flex flex-col gap-3`}
            >
              <div className="flex flex-row gap-3.5">
                {/* Vote Block */}
                <div className="flex items-center justify-cente gap-0">
                  <VoteBlock
                    opinionId={JSON.stringify(id)}
                    voterId={currentUserId}
                    myVote={myVote ? myVote : ""}
                    votes={votes}
                  />
                </div>
                {/* Reply */}
                <Link
                  href={`/opinion/${id}?cm=1`}
                  className="flex flex-col items-center"
                >
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width="28"
                    height="28"
                    className="cursor-pointer object-contain my-auto transition-all duration-150 ease-in-out hover:scale-110"
                  />
                </Link>
                {/* Repost */}
                <RepostModal
                  opinionId={id}
                  opinionText={content}
                  authorUsername={author.username}
                />
                {/* Share */}
                <ShareModal id={id} path="opinion" />
                {/* Delete opinion */}
                <DeleteOpinion
                  opinionId={JSON.stringify(id)}
                  currentUserId={currentUserId}
                  authorId={JSON.stringify(author._id)}
                  author_id={author.id}
                  parentId={parentId}
                  isDisagreement={isDisagreement}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {disagreements.length > 0 && (
        <div
          className={`mt-2 flex items-center gap-3 ${
            disagreements.length === 1 ? "ml-2.5" : ""
            }${disagreements.length === 2 ? "ml-2" : ""}${
            comment.length >= 3 ? "" : ""
          }`}
        >
          {disagreements.slice(0, 3).map((disagreement, index) => (
            <div
              key={index}
              className={`w-[26px] h-[26px] ${index !== 0 && "-ml-7"} ${
                disagreements.length >= 3 && index === 1 && "mb-7 z-[10]"
              }`}
            >
              <Avatar
                src={disagreement.author.image}
                bg_color={disagreement.author.color}
                alt={`user_${index} Profile Image`}
                loadingText={disagreement.author.name.charAt(0)}
                loadingSize="x-small"
                width={26}
                height={26}
                className={`rounded-full object-contain`}
              />
            </div>
          ))}

          <Link
            href={`/opinion/${id}`}
            className="text-light-3 hover-to-secondary"
          >
            <p className="mt-1 text-subtle-medium">
              {disagreements.length} repl{disagreements.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      <div className="">
        <h5 className="text-subtle-medium text-gray-1 mt-3 ml-0.5">
          {formattedDateString(createdAt)}
        </h5>
      </div>
    </article>
  );
};

export default OpinionCard;
