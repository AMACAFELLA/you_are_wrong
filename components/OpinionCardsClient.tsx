"use client";
import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import OpinionCard from "./cards/OpinionCard";
import Spinner from "./Spinner";

const OpinionCardsClient = ({
  result,
  currentUserId,
  baseUrl,
  label,
  isDisagreement,
  sortBy,
  initialPage = 2,
}: {
  result?: string;
  currentUserId: string;
  baseUrl: string;
  label?: string;
  isDisagreement: boolean;
  sortBy: SortByType;
  initialPage?: number;
}) => {
  try {
    if (result) result = JSON.parse(result);
    else result = "_";
    currentUserId = JSON.parse(currentUserId);
  } catch (e) {}
  const { getToken } = useAuth();
  const [loading, docs] = usePagination({
    options: {
      baseUrl: baseUrl,
      postFixQs: label
        ? `&label=${label}&sortBy=${sortBy}`
        : `&sortBy=${sortBy}`,
      pageSize: 10,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: initialPage,
    },
    getToken: getToken,
  });

  return (
    <>
      {result && (
        <>
          {docs?.length === 0 && (
            <h3 className="w-full mt-10 text-center">No {label} found</h3>
          )}
          {docs?.map((opinion: any) => {
            return (
              <OpinionCard
                key={opinion._id}
                id={opinion._id}
                currentUserId={currentUserId}
                repost={JSON.stringify(opinion.repost)}
                parentId={opinion.parentId}
                content={opinion.text}
                author={opinion.author} // TODO: check owner or not
                createdAt={opinion.createdAt}
                disagreements={opinion.children}
                votes={opinion.votePoints}
                myVote={opinion.myVote}
                isDisagreement={isDisagreement}
              />
            );
          })}
          {loading && (
            <div
              className={`flex justify-center items-center pt-10 ${
                initialPage === 1 ? "pb-40" : "pb-20"
              }`}
            >
              <Spinner />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OpinionCardsClient;
