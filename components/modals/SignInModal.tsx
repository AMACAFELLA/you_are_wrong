"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { redirect } from "next/navigation";
import { useState } from "react";

const SignInModal = ({ icon }: { icon: React.ReactNode }) => {
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);

  const handleShareClick = (state: boolean) => {
    setShowShareConfirmation(state);
  };

  // const shareText = useMemo(() => `Check this out \n ${url}`, [url]);
  const handleCancel = () => {
    handleShareClick(false);
  };

  return (
    // <ThemeProvider attribute="class" defaultTheme="dark">
    <Dialog
      open={showShareConfirmation}
      onOpenChange={setShowShareConfirmation}
    >
      <DialogTrigger asChild>
        <Button
          className="outline-none bg-transparent w-fit py-1 px-0 hover:bg-transparent"
          onClick={() => handleShareClick(true)}
        >
          {icon}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark-2 outline-none border-light-3 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-light-1 flex items-center justify-start gap-2">
            <p className="text-[18px]">
              To perform this action you must sign-in first
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="pb-1 flex flex-wrap gap-4 mt-3"></div>
        <DialogFooter>
          <a
            className="text-dark-1 bg-light-1 hover:bg-gray-400 mt-2 transition-colors duration-150 ease-in-out rounded-md px-4 py-2"
            href="/sign-in"
          >
            Sign In
          </a>

          <a
            className="text-light-1 bg-primary-500 hover:bg-secondary-500 hover:text-dark-1 
              transition-colors duration-150 ease-in-out rounded-md px-4 py-2 mt-2"
            href="/sign-up"
          >
            Sign Up
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // </ThemeProvider>
  );
};

export default SignInModal;
