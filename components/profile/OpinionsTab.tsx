"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OpinionCardsClient from "../OpinionCardsClient";
import SortClient from "./SortClient";
import { useRouter } from "next/navigation";

const OpinionsTab = ({
  currentUserId,
  accountId,
  label,
}: OpinionsTabsPropsType) => {
  let sortBy: SortByType = "createdAt";
  const searchParams = useSearchParams();
  const router = useRouter();
  let sortQuery = searchParams.get("sort") as string | undefined;
  if (sortQuery && sortQuery === "latest") {
    sortBy = "createdAt";
  } else if (!sortQuery || sortQuery === "top") {
    sortBy = "votePoints";
  }

  const [sortByState, setSortByState] = useState(sortBy);
  const [flash, setFlash] = useState(true);
  useEffect(() => {
    setFlash((_) => false);
    setTimeout(() => {
      setFlash((_) => true);
    }, 2);

    return () => {};
  }, [sortByState]);

  try {
    accountId = JSON.parse(accountId);
  } catch (e) {}
  return (
    <section className="mt-1 flex flex-col gap-10">
      <SortClient tab={label} sortBy={sortByState} setSortBy={setSortByState} />
      <div className="min-h-[700px]">
        {flash && (
          <OpinionCardsClient
            currentUserId={currentUserId}
            baseUrl={`/api/account-opinions/${accountId}`}
            label={label}
            isDisagreement={true}
            sortBy={sortByState}
            initialPage={1}
          />
        )}
      </div>
    </section>
  );
};

export default OpinionsTab;
