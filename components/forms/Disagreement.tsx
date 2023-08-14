"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DisagreementValidation } from "@/lib/validations/opinion";
import Image from "next/image";
import { addDisagreementToThread } from "@/lib/actions/opinion.actions";
// import { postOpinion } from "@/lib/actions/opinion.actions";
// import { updateUser } from "@/lib/actions/user.actions";

interface Props {
    opinionId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Disagreement = ({ opinionId, currentUserImg, currentUserId}: Props ) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(DisagreementValidation),
        defaultValues: {
            opinion: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof DisagreementValidation>) => {
        await addDisagreementToThread(opinionId, values.opinion, JSON.parse(currentUserId), pathname);

        form.reset();
    }
    
    return (
        <Form {...form}>
            <form
                className='disagreement-form'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='opinion'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                  src={currentUserImg}
                                  alt="Profile image"
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    placeholder="disagreement"
                                    className="no-fucs text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">
                    Disagree
                </Button>
            </form>
        </Form>
    )
}

export default Disagreement;