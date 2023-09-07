"use client";

import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";
import Spinner from "../Spinner";
import JumpTopButton from "./JumpTopButton";

const FollowItemsPaginate = ({
  account_id,
  type,
}: {
  account_id: string;
  type: string;
}) => {
  const { getToken, userId } = useAuth();

  const [loading, users] = usePagination({
    options: {
      baseUrl: "/api/follow",
      postFixQs: `&id=${account_id}&type=${type.toLowerCase()}`,
      pageSize: 20,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 1,
    },
    getToken: getToken,
    targetClass: ".follow-scroll",
  });
  return (
    <div className="follow-scroll py-3 flex flex-col gap-4 justify-start items-center rounded-xl max-h-[70vh] overflow-y-auto custom-scrollbar px-2">
      {users &&
        users.length > 0 &&
        users.map((user, index) => (
          <UserCard
            key={user.username + "_" + index.toString()}
            user={type === "Followers" ? user.follower : user.following}
            type="Follow"
            searchString=""
          />
        ))}

      {users && users.length === 0 && (
        <h2 className="text-center w-full text-light-2">No one found</h2>
      )}
      <div className="flex justify-center items-center w-full">
        {loading ? <Spinner /> : <></>}
      </div>
      <JumpTopButton type="relative" targetClass=".follow-scroll" />
    </div>
  );
};

export default FollowItemsPaginate;
