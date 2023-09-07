"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Avatar from "../shared/Avatar";

interface FollowPageButtonType {
  accountUserName: string;
  accountColor: string;
  src: string;
}

const ProfileAvatarModal = ({
  accountUserName,
  accountColor,
  src,
}: FollowPageButtonType) => {
  const [showModalConfirmation, setShowModalConfirmation] = useState(false);

  const handleShowModal = (state: boolean) => {
    setShowModalConfirmation(state);
  };

  return (
    <>
      {/* handle click */}
      {src && src !== "" ? (
        <Dialog
          open={showModalConfirmation}
          onOpenChange={setShowModalConfirmation}
        >
          <DialogTrigger asChild className="w-24 h-24">
            <button
              className="bg-transparent rounded-full w-24 h-24"
              onClick={() => {
                handleShowModal(true);
              }}
            >
              <Avatar
                src={src}
                bg_color={accountColor}
                alt="Profile Image"
                loadingSize="big"
                loadingText={accountUserName.charAt(0)}
              />
            </button>
          </DialogTrigger>
          <DialogContent
            className="bg-dark-2 outline-none border-light-3 
            shadow-lg px-3 justify-center items-center"
          >
            <Avatar
              src={src}
              bg_color={accountColor}
              alt="Profile Image"
              width={300}
              height={300}
              loadingText={accountUserName.charAt(0)}
              className=""
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Avatar
          src={src}
          bg_color={accountColor}
          alt="Profile Image"
          loadingSize="big"
          loadingText={accountUserName.charAt(0)}
        />
      )}
    </>
  );
};

export default ProfileAvatarModal;