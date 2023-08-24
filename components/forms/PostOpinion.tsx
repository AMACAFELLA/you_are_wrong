"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import React, { useEffect, useState } from 'react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OpinionValidation } from "@/lib/validations/opinion";
import { postOpinion } from "@/lib/actions/opinion.actions";
import GifButton from "@/components/ui/GifButton";
import GifModal from "@/components/ui/GifModal";

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

function PostOpinion({ userId }: { userId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(OpinionValidation),
        defaultValues: {
            opinion: '',
            accountId: userId,
        },
    });

    const [isGifModalOpen, setIsGifModalOpen] = useState(false);
    const [selectedGif, setSelectedGif] = useState<IGif | null>(null);

    const openGifModal = () => {
        setIsGifModalOpen(true);
    };

    const closeGifModal = () => {
        setIsGifModalOpen(false);
    };

    useEffect(() => {
        // This effect runs only on the client
        // You can perform client-side specific operations here
    }, []);

    const onSubmit = async (values: z.infer<typeof OpinionValidation>) => {
        await postOpinion({
            text: values.opinion,
            author: userId,
            communityId: organization ? organization.id : null,
            giphyId: selectedGif ? selectedGif.id.toString() : null,
            path: pathname,
        });

        router.push("/");
    };

    return (
        <Form {...form}>
            <form
                className='mt-10 flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='opinion'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                    rows={15}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <GifButton onClick={openGifModal} />

                <GifModal isOpen={isGifModalOpen} onClose={closeGifModal} onGifSelect={setSelectedGif} />

                <Button type="submit" className="bg-primary-500">
                    Post Opinion
                </Button>
            </form>
        </Form>
    )
}

export default PostOpinion;
