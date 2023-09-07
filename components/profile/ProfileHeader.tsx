import React from "react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import FollowPageModalButton from "../modals/FollowPageModalButton";
import ProfileAvatarModal from "../modals/ProfileAvatarModal";
import ShareModal from "../modals/ShareModal";
interface PropsType {
  accountId: string;
  account_id: string;
  authUserId: string;
  authUser_id: string;
  name: string;
  username: string;
  followersCount: number;
  followingsCount: number;
  color: string;
  follow: boolean;
  img: string;
  bio: string;
}
const ProfileHeader = ({
  accountId,
  account_id,
  authUserId,
  authUser_id,
  name,
  username,
  color,
  followersCount,
  followingsCount,
  follow,
  img,
  bio,
}: PropsType) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-24 w-24 object-cover">
            <ProfileAvatarModal
              accountUserName={name}
              accountColor={color}
              src={img}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && (
          <Link href="/profile/edit">
            <div
              className="flex cursor-pointer gap-3 rounded-xl shadow-lg transition-colors duration-200 ease-in-out 
              bg-dark-3 px-4 py-2 hover:bg-primary-500 hover:bg-opacity-20"
            >
              <Image src="/assets/edit.svg" alt="edit" width={16} height={16} />

              <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
        {accountId !== authUserId && (
          <FollowButton
            user_id={JSON.stringify(authUser_id)}
            account_id={JSON.stringify(account_id)}
            init_follow={follow}
          />
        )}
      </div>
      <div className="w-full">
        <div className="w-full flex justify-evenly sm:justify-start flex-wrap items-center gap-2 mt-3">
          <ShareModal id={accountId} path="profile" />
          <FollowPageModalButton
            count={followersCount}
            type="Followers"
            accountId={accountId}
            account_id={account_id}
            accountUsername={username}
          />
          <FollowPageModalButton
            count={followingsCount}
            type="Followings"
            accountId={accountId}
            account_id={account_id}
            accountUsername={username}
          />
        </div>
        <p className="pl-0 sm:pl-1 mt-6 w-full text-justify text-base-regular text-light-2">
          {bio}
        </p>
      </div>
      <div className="mt-2 sm:mt-8 h-0.5 w-full bg-dark-3 pl-0 sm:pl-1" />
    </div>
  );
};

export default ProfileHeader;
