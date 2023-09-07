type VoteType = "down" | "up" | "";
interface VoteProps {
    type: "down" | "up";
    opinionId: string;
    voterId: string | undefined | null;
    vote: VoteType;
    voteHandler: (type: VoteType) => void;
}

