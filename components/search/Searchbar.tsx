"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  searchString: string;
  setSearchString: Function;
}

function Searchbar({ searchString, setSearchString }: Props) {
  const [search, setSearch] = useState("");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const str = search.replace(/[^a-zA-Z0-9\s\_\-]/g, "");
      setSearchString(str);
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  const handleClearSearch = () => {
    setSearchString("");
    setSearch("");
  };
  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${"Search users"}`}
        className="no-focus searchbar_input"
      />
      {searchString.length && (
        <button onClick={handleClearSearch}>
          <Image
            src="/assets/delete_primary.svg"
            alt="clear"
            width={22}
            height={22}
            className="object-contain"
          />
        </button>
      )}
    </div>
  );
}

export default Searchbar;
