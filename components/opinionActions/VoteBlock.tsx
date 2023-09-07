"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { voteToOpinion } from "@/lib/actions/opinion.actions";
import { redirect } from "next/navigation";
import SignInModal from "../modals/SignInModal";
type VoteType = "down" | "up" | "";
interface VoteProps {
  opinionId: string;
  voterId: string | undefined | null;
  myVote: VoteType;
  votes: number;
}
const VoteBlock = ({ opinionId, voterId, myVote, votes }: VoteProps) => {
  const [voteState, setVoteState] = useState<VoteType>(myVote);
  const [votesCount, setVotesCount] = useState<number>(votes);

  const voteAction = async (
    userId: string,
    vote_type: VoteType,
    opinionId: string
  ) => {
    try {
      userId = JSON.parse(userId);
    } catch (e) {}
    try {
      opinionId = JSON.parse(opinionId);
    } catch (e) {}
    return await voteToOpinion(userId, vote_type, opinionId);
  };
  const voteHanlder = (type: VoteType) => {
    if (voterId) {
      if (voteState === type) {
        setVotesCount((_prev) => {
          return voteState === "up" ? _prev - 1 : _prev + 1;
        });
      } else {
        if (type === "down") {
          setVotesCount((_prev) => {
            return voteState === "up" ? votesCount - 2 : votesCount - 1;
          });
        } else {
          setVotesCount((_prev) => {
            return voteState === "down" ? votesCount + 2 : votesCount + 1;
          });
        }
      }
      const targetType = voteState === type ? "" : type;
      voteAction(voterId, targetType, opinionId).then((result) => {
        // console.log("Vote result : " + result);
      });
      setVoteState((prev_type) => {
        // console.log("prev : " + prev + " / type : " + type);
        if (prev_type === type) {
          return "";
        } else {
          return type;
        }
      });
    } else {
      // show login popup instead later
      // alert("You need to login first :)");
      redirect("/sign-in");
    }
  };

  const upVoteIcon = useMemo(
    () => (
      <Image
        src={`/assets/arrow_up${voteState === "up" ? "_filled" : ""}.svg`}
        alt={`up_vote${voteState === "up" ? "_filled" : ""}`}
        width="17"
        height="17"
        className="cursor-pointer w-full h-auto object-contain transition-all duration-150 ease-in-out hover:scale-110"
      />
    ),
    [voteState]
  );

  const downVoteIcon = useMemo(
    () => (
      <Image
        src={`/assets/arrow_down${voteState === "down" ? "_filled" : ""}.svg`}
        alt={`down_vote${voteState === "down" ? "_filled" : ""}`}
        width="17"
        height="17"
        className="cursor-pointer w-full h-auto object-contain transition-all duration-150 ease-in-out hover:scale-110"
      />
    ),
    [voteState]
  );

  return (
    <>
      <div
        onClick={() => {
          voteHanlder("up");
        }}
        className="w-4"
        // className="w-[18px] p-0 my-0 mx-auto"
      >
        {voterId ? upVoteIcon : <SignInModal icon={upVoteIcon} />}
      </div>
      <p
        className={`w-10 text-center mt-2 mb-2.5 ${
          voteState === "up"
            ? "text-green-500"
            : voteState === "down"
            ? "text-red-500"
            : "text-light-3"
        }`}
      >
        {votesCount}
      </p>
      <div
        onClick={() => voteHanlder("down")}
        className="w-4"
        // className="w-[18px] p-0 my-0 mx-auto"
      >
        {voterId ? downVoteIcon : <SignInModal icon={downVoteIcon} />}
      </div>
    </>
  );
};

export default VoteBlock;
