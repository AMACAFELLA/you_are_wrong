"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HTMLReactParser from "html-react-parser";
import { useAuth } from "@clerk/nextjs";
import SignInModal from "./SignInModal";
import Spinner from "../Spinner";
interface RepostProps {
  opinionId: string;
  opinionText: string;
  authorUsername: string;
}

const RepostModal = ({ opinionId, opinionText, authorUsername }: RepostProps) => {
  const [showRepostConfirmation, setShowRepostConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getToken, userId } = useAuth();

  const handleRepostClick = (state: boolean) => {
    if (!loading) setShowRepostConfirmation(state);
  };

  const handleCancelRepost = () => {
    handleRepostClick(false);
  };

  const handleRepost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Perform the Repost action here -> post create-opinion action with extra repost opinion_id
    // .
    repostApiCall();
  };

  const repostApiCall = async () => {
    setLoading((_) => true);

    let headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };
    const token = await getToken();

    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`/api/repost`, {
      method: "POST",
      headers: headers,
      cache: "no-cache",
      body: JSON.stringify({ pathname: "/api/repost", opinionId: opinionId }),
    });
    // console.log(response);
    window.location.replace("/profile/" + userId);
    // setLoading((_) => false);
  };

  const repostIcon = (
    <Image
      src="/assets/repost_2.svg"
      alt="repost"
      width="24"
      height="24"
      className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
    />
  );

  return (
    <>
      {!userId && <SignInModal icon={repostIcon} />}
      {userId && ( // <ThemeProvider attribute="class" defaultTheme="dark">
        <Dialog
          open={showRepostConfirmation}
          onOpenChange={setShowRepostConfirmation}
        >
          <DialogTrigger asChild>
            <Button
              className="outline-none bg-transparent w-fit py-1 px-0 hover:bg-transparent"
              onClick={() => handleRepostClick(true)}
            >
              {repostIcon}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-dark-2 outline-none border-light-3 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-light-1 flex items-center justify-start gap-2">
                {repostIcon}
                <p className="text-[18px]"> Repost Opinion</p>
              </DialogTitle>
              <DialogDescription className="text-light-2 mt-2 text-[15px] text-left">
                Are you sure you want to repost this opinion by
                <span className="text-primary-500">@{authorUsername}</span> ?
              </DialogDescription>
            </DialogHeader>
            <div className="pb-4">
              {/* Your existing profile fields */}
              <p className="w-full text-light-2 text-ellipsis line-clamp-3 text-subtle-medium">
                {/* <span className="text-subtle-semibold text-light-3">
                  content :
                </span> */}
                {HTMLReactParser(opinionText)}
              </p>
            </div>
            <DialogFooter className="!flex-row justify-end space-x-2">
              <Button
                className="text-dark-1 bg-light-1 hover:bg-gray-400 mt-2"
                onClick={handleCancelRepost}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRepost}
                className={`text-light-1 bg-primary-500 hover:bg-secondary-500 hover:text-dark-1 mt-2 ${
                  loading && "bg-secondary-500 text-dark-1"
                }`}
                disabled={loading}
              >
                {loading ? <Spinner color="#111111" /> : "Repost"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        //</> </ThemeProvider>}
      )}
    </>
  );
};

export default RepostModal;
