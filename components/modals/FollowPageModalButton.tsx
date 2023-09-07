"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IoIosPeople } from "react-icons/io";
import Spinner from "../Spinner";
import usePagination from "@/hooks/usePagination";
import UserCard from "../cards/UserCard";
import JumpTopButton from "../shared/JumpTopButton";
import FollowItemsPaginate from "../shared/FollowItemsPaginate";

interface FollowPageButtonType {
  count: number;
  type: "Followers" | "Followings";
  accountUsername: string;
  accountId: string;
  account_id: string;
}

const FollowPageModalButton = ({
  count,
  type,
  accountUsername,
  accountId,
  account_id,
}: FollowPageButtonType) => {
  const correctedType = count <= 1 ? type.substring(0, type.length - 1) : type;

  const [showModalConfirmation, setShowModalConfirmation] = useState(false);

  const handleShowModal = (state: boolean) => {
    setShowModalConfirmation(state);
  };

  const followIcon = <IoIosPeople size={30} />;

  return (
    <Dialog
      open={showModalConfirmation}
      onOpenChange={setShowModalConfirmation}
    >
      <DialogTrigger asChild>
        <Button
          id={type.toLowerCase() + "-btn"}
          className="bg-transparent hover:bg-primary-500 hover:bg-opacity-30 rounded-xl"
          onClick={() => handleShowModal(true)}
        >
          {count} {correctedType}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[430px] bg-dark-2 outline-none border-light-3 shadow-lg pl-0 pr-1 xs:px-3">
        <DialogHeader>
          <DialogTitle className="text-light-1 flex items-center justify-start gap-2 px-2">
            {followIcon}
            <p className="text-[18px]">
              <span className="text-light-3">@{accountUsername} </span>
              <span>{type.toLowerCase()} </span>
            </p>
          </DialogTitle>
        </DialogHeader>
        {showModalConfirmation ? (
          <FollowItemsPaginate account_id={account_id} type={type} />
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowPageModalButton;
