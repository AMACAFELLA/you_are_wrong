"use client";

import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";
import UserCard from "../cards/UserCard";
import Spinner from "../Spinner";
import Link from "next/link";

const RightSidebar = () => {
  const { getToken } = useAuth();
  const searchString = useMemo(() => "", []);
  const [loading, users] = usePagination({
    options: {
      baseUrl: "/api/user/search",
      postFixQs: `&search=${searchString}&sort=ascending`,
      pageSize: 10,
    },
    initialValues: {
      initialHasNext: false,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 1,
    },
    getToken: getToken,
  });

  useEffect(() => {
    return () => {
      // cleanups
    };
  }, []);

  return (
    <section className="custom-scrollbar rightsidebar overflow-hidden">
      <div className="flex flex-1 flex-col justify-start w-72 overflow-hidden">
        <h3 className="text-heading4-medium text-light-1 w-full text-center mb-8">
          Suggested Users
        </h3>
        <div className="flex flex-col gap-4 justify-center items-center py-1 px-4 rounded-xl overflow-hidden">
          {
            // @ts-ignore
            users && users.length === 0 ? (
              <p className="no-result">No user found</p>
            ) : (
              <>
                {users && (
                  <>
                    {
                      // @ts-ignore
                      users.map((person, index) => (
                        <UserCard
                          key={person.id + "/" + index}
                          user={person}
                          type="suggested"
                          searchString={searchString}
                        />
                      ))
                    }
                  </>
                )}
              </>
            )
          }
        </div>

        {loading && (
          <div className="w-full my-0 py-0 h-8 mt-5 flex justify-center">
            <Spinner />
          </div>
        )}
        {!loading && users && (
          <div className="w-full flex justify-center items-center pt-7">
            <Link href="/search" className="explore_btn">
              Explore users
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RightSidebar;
