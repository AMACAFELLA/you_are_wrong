"use client";
import { usePathname, useRouter } from "next/navigation";
import { addUserAgree } from "@/lib/actions/opinion.actions";
import Image from "next/image";

interface Props {
    opinionId: string;
    currentUserId: string;
    imageSource: string;
}

function AgreedOpinions({ opinionId, currentUserId, imageSource }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Image
            src={imageSource}
            alt="heart" width="24"
            height={24}
            className="cursor-pointer object-contain"
            onClick={async () => {
                await addUserAgree(opinionId, JSON.parse(currentUserId), pathname);
                router.push(pathname);
                router.refresh();
            }}
        />
    );
}

export default AgreedOpinions;