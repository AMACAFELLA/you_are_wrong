"use client";

import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import UsersCards from "../shared/UsersCards";

const SearchResults = () => {
  const [searchString, setSearchString] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(false);
    setTimeout(() => {
      setFlash((_) => true);
    }, 2);
    return () => {};
  }, [searchString]);

  return (
    <>
      <Searchbar
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <h3
        className={`text-light-2 px-2 pt-3 ${
          searchString.length ? "opacity-100" : "opacity-0"
        }`}
      >
        Results for : <span className="text-light-3">{searchString}</span>
      </h3>
      <div className="">
        {flash ? <UsersCards searchString={searchString} /> : <></>}
      </div>
    </>
  );
};

export default SearchResults;
