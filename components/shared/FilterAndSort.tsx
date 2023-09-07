"use server";

import Link from "next/link";
import React from "react";
import FilterComponent from "./FilterComponent";
import SortComponent from "./SortComponent";

const FilterAndSort = ({
  baseUrl,
  sortQuery,
  sortBy,
}: {
  baseUrl: string;
  sortQuery?: string;
  sortBy: string;
}) => {
  return (
    <div className="w-full flex flex-row justify-between pt-2">
      <FilterComponent
        baseUrl={baseUrl}
        sortQuery={sortQuery}
        sortBy={sortBy}
        type="bigDevice"
      />
      <SortComponent baseUrl={baseUrl} sortQuery={sortQuery} sortBy={sortBy} />
    </div>
  );
};

export default FilterAndSort;
