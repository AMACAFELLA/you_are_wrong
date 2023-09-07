"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInValidation } from "@/lib/validations/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { z } from "zod";

const SignInForm = () => {
  //   const pathname = usePathname();
  //   const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    console.log(values.username + "/" + values.password);
    setLoading((_) => true);
    // await createOpinion({
    //   text: values.opinion,
    //   author: userId,
    //   communityId: null,
    //   path: pathname,
    //   repost: null,
    // });
    //
    // use login server action
    setTimeout(() => {
      setLoading((_) => false);
    }, 2000);

    // will be redirected by the server
    // router.push("/profile/" + user_id);
  };

  //   const setFormUsername = (value: string): void => {
  //     form.setValue("username", value);
  //   };
  //   const setFormPassword = (value: string): void => {
  //     form.setValue("password", value);
  //   };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-0 w-full">
                <FormLabel className="font-semibold text-[13px] text-light-2 mb-0 ml-0.5">
                  Email address or username
                </FormLabel>
                <FormControl className="no-focus border border-gray-2 border-opacity-30 bg-dark-3 text-light-1 rounded-md shadow-md mt-0">
                  <Input
                    className="form-input mt-0"
                    type="text"
                    maxLength={30}
                    id="username"
                    autoFocus={true}
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red-600 text-[12px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-0 w-full relative">
                <FormLabel className="font-semibold text-[13px] text-light-2 mb-0 ml-0.5">
                  Password
                </FormLabel>
                <FormControl className="no-focus border border-gray-2 border-opacity-30 bg-dark-3 text-light-1 rounded-md shadow-md">
                  <Input
                    className="form-input"
                    type={showPass ? "text" : `password`}
                    id="password"
                    // maxLength={30}
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red-600 text-[12px]" />
                <Button
                  className="bg-dark-1 w-6 h-6 p-0.5 absolute right-3 top-7 rounded-md z-50 text-light-2 flex flex-col justify-center"
                  onMouseDown={(e) => {
                    if (!showPass) setShowPass((_prev) => !_prev);
                  }}
                  onMouseUp={(e) => {
                    if (showPass) setShowPass((_prev) => !_prev);
                  }}
                >
                  {showPass ? (
                    <RiEyeOffFill size={16} color="#FFFFFF" />
                  ) : (
                    <RiEyeFill size={16} color="#FFFFFF" />
                  )}
                </Button>
              </FormItem>
            )}
          />

          <Button
            className="rounded-md bg-primary-500 hover:bg-secondary-500 text-light-1 hover:text-dark-1 
                transition-colors duration-150 ease-in-out shadow-md"
            disabled={loading}
            type="submit"
          >
            Continue
          </Button>
          <p className="text-[13px] text-gray-2">
            Forgot your password ?{" "}
            <Link href="/forgot" className="form-link">
              Reset it
            </Link>
          </p>
        </form>
      </Form>
      <div className="text-center my-0 py-0 h-8 mt-5">
        {loading && <Spinner />}
      </div>
      <p className="text-gray-2 text-[13px]">
        No account?{" "}
        <Link href="/register" className="form-link">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
