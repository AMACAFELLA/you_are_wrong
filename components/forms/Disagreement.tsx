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
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { DisagreementValidation } from "@/lib/validations/opinion";
import { addDisagreementToOpinion } from "@/lib/actions/opinion.actions";
import { Textarea } from "../ui/textarea";
import UsersSuggestions from "../shared/UsersSuggestions";
import Avatar from "../shared/Avatar";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
interface PropsType {
  opinionId: string;
  currentUserImage: string;
  currentUserId: string;
  currentUserName: string;
  currentUserColor: string;
}
const Disagreement = ({
  opinionId,
  currentUserImage,
  currentUserId,
  currentUserName,
  currentUserColor,
}: PropsType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    scrollDownTodisagreementSection();
  }, []);

  const scrollDownTodisagreementSection = () => {
    const cm = searchParams.get("cm");
    if (cm) {
      console.log(cm);
      setTimeout(() => {
        const element = document.getElementById("disagreement-text-area");
        window.scrollTo({ top: element?.offsetTop, behavior: "smooth" });
        setTimeout(() => {
          element?.focus();
        }, 500);
      }, 100);
    }
  };
  const form = useForm({
    resolver: zodResolver(DisagreementValidation),
    defaultValues: {
      disagreement: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof DisagreementValidation>) => {
    setLoading((_) => true);
    await addDisagreementToOpinion({
      opinionId: opinionId,
      text: values.disagreement,
      authorId: JSON.parse(currentUserId),
      path: pathname,
    });

    form.reset();
    setTimeout(() => {
      const articles = document.querySelectorAll("article h5");
      setLoading((_) => false);
      articles[articles.length - 1]?.scrollIntoView({
        behavior: "smooth",
      });
    }, 1000);
  };
  const setFormValue = (value: string): void => {
    form.setValue("disagreement", value);
  };
  return (
    <>
      <UsersSuggestions
        type="disagreement"
        textAreaId="disagreement-text-area"
        setFormValue={setFormValue}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="disagreement-form">
          <FormField
            control={form.control}
            name="disagreement"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-3 items-center w-full">
                <FormLabel>
                  <div className="w-12 h-12">
                    <Avatar
                      src={currentUserImage}
                      bg_color={currentUserColor}
                      alt="profile picture"
                      loadingText={currentUserName.charAt(0)}
                      width={48}
                      height={48}
                    />
                  </div>
                </FormLabel>
                <FormControl className="border-none bg-dark-3 text-light-1">
                  <Textarea
                    rows={1}
                    maxLength={3000}
                    className="no-focus resize-none text-light-1 outline-none"
                    // type="text"
                    placeholder="State your disagreement..."
                    id="disagreement-text-area"
                    {...field}
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
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="disagreement-form_btn bg-primary-500 flex justify-center items-center"
          >
            {loading ? <Spinner color="#FFFFFF" /> : "Reply"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Disagreement;
