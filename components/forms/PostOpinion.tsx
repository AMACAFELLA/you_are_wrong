"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Grid } from "@giphy/react-components";
import React, { SyntheticEvent, useState } from 'react';

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
import { updateUser } from "@/lib/actions/user.actions";
import { Carousel } from '@giphy/react-components';
import Modal from '@/components/ui/modal';


const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

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
    })

    const [textareaValue, setTextareaValue] = useState('');
    const [isGifModalOpen, setIsGifModalOpen] = useState(false);

    const openGifModal = () => setIsGifModalOpen(true);
    const closeGifModal = () => setIsGifModalOpen(false);

    const onGifSelect = (gif: any) => {
        setSelectedGif(gif);
        setTextareaValue(prev => prev + gif.images.original.url);
        closeGifModal();
    };


    const [selectedGif, setSelectedGif] = useState<IGif | null>(null);

    const onGifClick = (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => {
        e.preventDefault();
        setSelectedGif(gif);
    };

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

    const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

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

                {/* <div>
                    <label>Giphy GIF</label>
                    <Grid onGifClick={onGifClick} width={800} fetchGifs={fetchGifs} columns={3} />
                </div> */}
                <button onClick={openGifModal}>Add GIF</button>
                {/* Add the GifModal component */}
                <Modal isOpen={isGifModalOpen} onClose={closeGifModal}>
                    <Grid onGifClick={onGifSelect} fetchGifs={fetchGifs} width={800} columns={3} />
                </Modal>
                <Button type="submit" className="bg-primary-500">
                    Post Opinion
                </Button>
            </form>
        </Form>
    )
}

export default PostOpinion;
