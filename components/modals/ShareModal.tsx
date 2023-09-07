"use client";

import { useEffect, useMemo, useState } from "react";
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

import {
  EmailIcon,
  EmailShareButton,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
  FacebookIcon,
} from "react-share";

import { IoLogoLinkedin } from "react-icons/io5";
import CopyToClipboard from "react-copy-to-clipboard";

interface ShareProps {
  id: string;
  path: "profile" | "opinion";
}

const ShareModal = ({ id, path }: ShareProps) => {
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [copy, setcopy] = useState(false);
  const handleShareClick = (state: boolean) => {
    setShowShareConfirmation(state);
    setcopy(false);
  };

  const [url, setUrl] = useState("");
  const [shareText, setShareText] = useState("");
  useEffect(() => {
    setUrl(
      (_) =>
        `${window.location.protocol}://${window.location.host}/${path}/${id}`
    );
    setShareText(
      (_) =>
        `Check this out \n ${window.location.protocol}://${window.location.host}/${path}/${id}`
    );
  }, []);

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
          <Image
            src="/assets/share.svg"
            alt="Share"
            width="25"
            height="25"
            className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark-2 outline-none border-light-3 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-light-1 flex items-center justify-start gap-2">
            <Image
              src="/assets/share.svg"
              alt="Share"
              width="30"
              height="30"
              className="object-contain"
            />
            <p className="text-[18px]">Share on social platforms</p>
          </DialogTitle>
        </DialogHeader>
        <div className="pb-1 flex flex-wrap gap-4 mt-3 justify-evenly">
          <FacebookShareButton
            className="w-5 h-5 object-contain"
            url={shareText}
          >
            <FacebookIcon
              size={28}
              className="rounded-full"
              style={{ color: "#1197F5" }}
            />
          </FacebookShareButton>
          <TwitterShareButton url={shareText}>
            <div className="bg-dark-1 rounded-full w-[28px] h-[28px]">
              <Image
                src="/assets/twitterX.svg"
                alt="Twitter icon"
                width={28}
                height={28}
              />
            </div>
          </TwitterShareButton>
          <TelegramShareButton url={shareText}>
            <TelegramIcon size={28} className="text-primary-500 rounded-full" />
          </TelegramShareButton>
          <WhatsappShareButton url={shareText}>
            <WhatsappIcon size={28} className="text-primary-500 rounded-full" />
          </WhatsappShareButton>
          <EmailShareButton url={shareText}>
            <EmailIcon size={28} className="text-primary-500 rounded-full" />
          </EmailShareButton>
          {/* <LineShareButton url={shareText}>
            <LineIcon size={28} className="text-primary-500 rounded-full" />
          </LineShareButton> */}
          <RedditShareButton url={shareText}>
            <RedditIcon size={28} className="text-primary-500 rounded-full" />
          </RedditShareButton>
          <LinkedinShareButton url={shareText}>
            <IoLogoLinkedin
              size={28}
              className="rounded-full"
              style={{ color: "#0A66C2" }}
            />
          </LinkedinShareButton>
          {/* <WorkplaceShareButton url={shareText}>
            <WorkplaceIcon
              size={28}
              className="text-primary-500 rounded-full"
            />
          </WorkplaceShareButton> */}

          <div className="w-full py-2 bg-transparent text-ellipsis flex flex-col items-start justify-start line-clamp-2">
            <p className="bg-dark-2 text-light-2 outline-1 border-0 focus:border-0 text-[11px] sm:text-[12px] md:text-[14px] !max-w-[380px]">
              {url}
            </p>
            <span
              className={`w-full text-subtle-semibold text-green-600 ${
                copy ? "" : "!text-transparent"
              }`}
            >
              {copy ? "Link copied to clipboard !" : " _ "}
            </span>
          </div>
        </div>
        <DialogFooter className="!flex-row justify-end space-x-2">
          <Button
            onClick={handleCancel}
            className="text-dark-1 bg-light-1 hover:bg-gray-400 mt-2"
          >
            Done
          </Button>
          <CopyToClipboard
            text={url}
            onCopy={() => {
              setcopy(true);
              return;
            }}
          >
            <button
              className="text-light-1 bg-primary-500 hover:bg-secondary-500 hover:text-dark-1 
              transition-colors duration-150 ease-in-out rounded-md px-4 py-2 mt-2"
            >
              Copy
            </button>
          </CopyToClipboard>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // </ThemeProvider>
  );
};

export default ShareModal;
