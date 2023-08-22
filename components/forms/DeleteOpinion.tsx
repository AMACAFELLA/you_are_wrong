"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteOpinion } from "@/lib/actions/opinion.actions";

interface Props {
    opinionId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isDisagreement?: boolean;
}

function DeleteOpinion({
    opinionId,
    currentUserId,
    authorId,
    parentId,
    isDisagreement,
}: Props) {
    const pathname = usePathname();
    const router = useRouter();

    if (currentUserId !== authorId || pathname === "/") return null;

    return (
        <Image
            src='/assets/delete.svg'
            alt='delete'
            width={18}
            height={18}
            className='cursor-pointer object-contain'
            onClick={async () => {
                await deleteOpinion(JSON.parse(opinionId), pathname);
                if (!parentId || !isDisagreement) {
                    router.push("/");
                }
            }}
        />
    );
}

export default DeleteOpinion;