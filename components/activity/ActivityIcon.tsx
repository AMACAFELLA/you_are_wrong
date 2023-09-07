import React from "react";
import Image from "next/image";
import { RiUserFollowFill } from "react-icons/ri";
const ActivityIcon = ({
  type,
  message,
  styles,
}: {
  type: string;
  message: string;
  styles: string;
}) => {
  const selectColor = () => {
    switch (type) {
      case "vote":
        if (message.startsWith("up")) return "bg-green-700";
        else return "bg-red-700";
      case "reply":
        return "bg-primary-500";
      case "repost":
        return "bg-orange-600";
      case "mention":
        return "bg-sky-700";
      default:
        return "bg-secondary-500";
    }
  };

  const iconColor = selectColor();

  return (
    <span
      className={`${styles} flex justify-center items-center w-5 h-5 overflow-hidden rounded-full p-1 ${iconColor}`}
    >
      {type === "vote" && (
        <Image
          src={`/assets/${
            message.split(" ")[0].split("vote")[0]
          }vote_white.svg`}
          alt={`${message.split(" ")[0]} icon`}
          width="22"
          height="22"
          className="cursor-pointer object-cover scale-90"
        />
      )}
      {type === "reply" && (
        <Image
          src="/assets/reply_white.svg"
          alt="reply"
          width="22"
          height="22"
          className="cursor-pointer object-contain scale-100"
        />
      )}
      {type === "mention" && (
        <Image
          src="/assets/atsign_white.svg"
          alt="mention"
          width="22"
          height="22"
          className="cursor-pointer object-contain scale-100"
        />
      )}
      {type === "repost" && (
        <Image
          src="/assets/repost_2_white.svg"
          alt="repost"
          width="26"
          height="26"
          className="cursor-pointer object-contain scale-125"
        />
      )}
      {type === "follow" && <RiUserFollowFill size={24} />}
    </span>
  );
};

export default ActivityIcon;
