interface Props {
    opinionId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Disagreement = ({ opinionId, currentUserImg, currentUserId}: Props ) => {
    return (
        <div>
            <h1 className="text-white">Disagreement form</h1>
        </div>
    )
}

export default Disagreement;