"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const SortClient = ({
  tab,
  sortBy,
  setSortBy,
}: {
  tab: string;
  sortBy: string;
  setSortBy: Function;
}) => {
  const baseUrl = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSortchange = (sortByVal: string) => {
    setSortBy(sortByVal);
    let tab = searchParams.get("tab");
    if (!tab) tab = "opinions";

    switch (sortByVal) {
      case "createdAt":
        sortByVal = "latest";
        break;
      case "votePoints":
        sortByVal = "top";
        break;
      default:
        sortByVal = "latest";
        break;
    }

    router.replace(`${baseUrl}?tab=${tab}&sort=${sortByVal}`, {
      scroll: false,
    });
  };
  return (
    <div className="flex justify-between w-full xs:w-fit xs:justify-end gap-2 items-center">
      <h3 className="text-light-2 font-semibold">Sort By</h3>
      <div className="flex justify-end gap-2 items-center">
        <Link
          href={`${baseUrl}?tab=${tab}&sort=latest`}
          className={`w-20 ${
            sortBy === "createdAt" ? "link-activate" : "sort-by-link"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleSortchange("createdAt");
          }}
        >
          Latest
        </Link>
        <Link
          href={`${baseUrl}?tab=${tab}&sort=top`}
          className={`w-20 ${
            sortBy === "votePoints" ? "link-activate" : "sort-by-link"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleSortchange("votePoints");
          }}
        >
          Top
        </Link>
      </div>
    </div>
  );
};
export default SortClient;
