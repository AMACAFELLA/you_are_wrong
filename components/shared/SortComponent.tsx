import Link from "next/link";
import React from "react";

const SortComponent = ({
  baseUrl,
  sortQuery,
  sortBy,
}: {
  baseUrl: string;
  sortQuery?: string;
  sortBy: string;
}) => {
  return (
    <div className="flex justify-between w-full xs:w-fit xs:justify-end gap-2 items-center">
      <h3 className="text-light-2 font-semibold">Sort By</h3>
      <div className="flex justify-end gap-2">
        <Link
          href={`${baseUrl}?sortBy=latest`}
          className={`w-20 ${
            sortBy === "createdAt" ? "link-activate" : "sort-by-link"
          }`}
        >
          Latest
        </Link>
        <Link
          href={`${baseUrl}?sortBy=top`}
          className={`w-20 ${
            sortBy === "votePoints" ? "link-activate" : "sort-by-link"
          }`}
        >
          Top
        </Link>
      </div>
    </div>
  );
};

export default SortComponent;
