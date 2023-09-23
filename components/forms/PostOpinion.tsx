"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { OpinionValidation } from "@/lib/validations/opinion";
import { createOpinion } from "@/lib/actions/opinion.actions";
import UsersSuggestions from "../shared/UsersSuggestions";
import Spinner from "../Spinner";
import { useState } from "react";

// @ts-ignore
export const PostOpinion = ({
  userId,
  user_id,
}: {
  userId: string;
  user_id: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(OpinionValidation),
    defaultValues: {
      opinion: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof OpinionValidation>) => {
    setLoading((_) => true);
    await createOpinion({
      text: values.opinion,
      author: userId,
      communityId: null,
      path: pathname,
      repost: null,
    });
    setLoading((_) => true);
    router.push("/profile/" + user_id);
  };

  const setFormValue = (value: string): void => {
    form.setValue("opinion", value);
  };

  return (
    <>
      <UsersSuggestions
        type="opinion"
        textAreaId="opinion-text-area"
        setFormValue={setFormValue}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10 mb-0 pb-0"
        >
          <FormField
            control={form.control}
            name="opinion"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full ">
                <FormLabel className="text-base-semibold text-light-2 mt-1">
                  Write your opinion
                </FormLabel>
                <FormControl
                  className="no-focus border border-dark-4
              resize-none bg-dark-3 text-light-1"
                >
                  <Textarea
                    rows={15}
                    maxLength={6000}
                    {...field}
                    id="opinion-text-area"
                  />
                </FormControl>
                <div
                  id="test"
                  className="hidden"
                  style={{
                    width: "2px",
                    height: "1.2em",
                    background: "red",
                    position: "absolute",
                  }}
                />
                <FormMessage className="text-red-600 text-[12px]" />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="bg-primary-500">
            Post
          </Button>
        </form>
      </Form>
      <div className="text-center my-0 py-0 h-8 mt-5">
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default PostOpinion;
