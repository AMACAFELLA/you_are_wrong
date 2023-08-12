interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    }
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    disagreements : {
        author: {
            image: string;
        }
    }[]
    isDisagreement?: boolean;
}

const OpinionCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    disagreements,
}: Props) => {
   return (
    <article>
        <h2 className="text-small-regular text-light-2">
            {content}
        </h2>
    </article>
   )
}

export default OpinionCard;