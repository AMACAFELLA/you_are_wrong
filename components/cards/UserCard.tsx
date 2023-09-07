import React from "react";
import Link from "next/link";
import { parseFoundText } from "../utils";
import Avatar from "../shared/Avatar";
interface UserCardProps {
  user: AuthorType;
  type: string;
  searchString: string;
}

const UserCard = ({ user, type, searchString }: UserCardProps) => {
  const { id, name, username, image } = user;

  const parsedName =
    searchString && searchString.length && type === "search"
      ? parseFoundText(name, searchString)
      : name;

  const parsedUserName =
    searchString && searchString.length && type === "search"
      ? parseFoundText(username, searchString)
      : username;

  return (
    <article className="user-card w-full">
      <div className="flex flex-row gap-2">
        <UserLink
          type={type}
          className="flex flex-row gap-2 w-fit h-fit group justify-start"
          link={`/profile/${id}`}
        >
          <div className="w-9 h-9">
            <Avatar
              src={image}
              bg_color={user.color}
              alt="Profile Picture"
              width={40}
              height={40}
              loadingText={name.toString().charAt(0).toUpperCase()}
            />
          </div>
          <div className="flex-1 text-ellipsis">
            <h4
              className="text-base-semibold text-light-1 text-ellipsis line-clamp-1 max-w-[150px] xs:max-w-[230px] 
              transition-all duration-200 ease-in-out group-hover:text-primary-500"
            >
              {parsedName}
            </h4>
            <p
              className="text-small-medium text-gray-1 text-ellipsis line-clamp-1 max-w-[150px] xs:max-w-[230px]
              transition-all duration-200 ease-in-out group-hover:text-secondary-500"
            >
              @{parsedUserName}
            </p>
          </div>
        </UserLink>
      </div>
      {type !== "suggested" && (
        <Link
          className="user-card_btn px-4 py-2 text-center text-body-bold"
          href={`/profile/${id}`}
        >
          View
        </Link>
      )}
    </article>
  );
};

const UserLink = ({
  type,
  children,
  link,
  className,
}: {
  type: string;
  children: React.ReactNode | React.ReactNode[];
  link: string;
  className: string;
}) => {
  return type === "suggested" ? (
    <Link
      // <a
      className={className}
      href={link}
    >
      {children}
      {/* </a> */}
    </Link>
  ) : (
    <>{children}</>
  );
};

export default UserCard;
