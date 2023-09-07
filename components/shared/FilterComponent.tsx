import Link from "next/link";
import React, { useMemo } from "react";

const FilterComponent = ({
  baseUrl,
  sortQuery,
  sortBy,
  type,
}: {
  baseUrl: string;
  sortQuery?: string;
  sortBy: string;
  type: "bigDevice" | "smallDevice";
}) => {
  const showPolicy = useMemo(() => {
    if (type === "bigDevice") {
      return "max-sm:hidden";
    }
    return "sm:hidden";
  }, [type]);

  return (
    <div className={`flex justify-start gap-2 items-center ${showPolicy}`}>
      <Link
        href={`/${sortQuery ? `?sortBy=${sortQuery}` : ""}`}
        className={`w-20 sm:w-28 ${
          baseUrl === "/" ? "link-activate" : "sort-by-link"
        }`}
      >
        Worldwide
      </Link>
      <Link
        href={`/followings${sortQuery ? `?sortBy=${sortQuery}` : ""}`}
        className={`w-20 sm:w-28 ${
          baseUrl === "/followings" ? "link-activate" : "sort-by-link"
        }`}
      >
        Following
      </Link>
    </div>
  );
};

export default FilterComponent;
