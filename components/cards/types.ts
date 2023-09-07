interface AuthorType {
    _id: string;
    id: string;
    color: string;
    name: string;
    username: string;
    image: string;
}
interface OpinionProps {
    id: string;
    currentUserId: string;
    repost: string | null;
    parentId: string;
    content: string;
    author: AuthorType;
    createdAt: string;
    disagreements: {
        author: AuthorType;
    }[];
    isDisagreement?: boolean;
    isMainOpinion?: boolean;
    votes: number;
    myVote?: VoteType;
}