"use client";

import Spinner from "@/components/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifyValidation } from "@/lib/validations/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, RefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";
import { z } from "zod";

const VerifyForm = ({ source }: { source: VerifySourceType }) => {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    email: string;
    password: string;
    id?: string;
    _id?: string;
  } | null>(null);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(VerifyValidation),
    defaultValues: {
      "1": -1,
      "2": -1,
      "3": -1,
      "4": -1,
      "5": -1,
      "6": -1,
    },
  });
  const keyItems = [1, 2, 3, 4, 5, 6];
  const inputRefs = keyItems.map((x) => useRef<HTMLInputElement>(null));

  const handlerForward = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError((_prev) => false);
    if (success) setSuccess((_prev) => false);
    let value = e.currentTarget.value;
    if (value) {
      try {
        let int_value = parseInt(value);
        if (isNaN(int_value)) {
          e.currentTarget.value = "";
        }
      } catch (e) {}
    }
    if (e.currentTarget.value !== "" && idx + 1 <= inputRefs.length - 1) {
      if (inputRefs && inputRefs[idx + 1].current) {
        const next = inputRefs[idx + 1].current;
        if (next) {
          next.focus();
          // verifyRequest();
        }
      }
    } else if (idx + 1 === inputRefs.length) {
      inputRefs[idx].current?.blur();
      verifyRequest();
    }
  };
  // @ts-ignore
  const handlerBackward = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError((_prev) => false);

    e.currentTarget.value = "";
    let target = idx - 1;
    if (target < 0) return;
    if (e.key.toString() === "Backspace" || e.key.toString() === "Delete") {
      if (inputRefs && inputRefs[target].current) {
        const prev = inputRefs[target].current;
        if (prev) {
          const prevVal = prev.value;
          prev.focus();
          setTimeout(() => {
            prev.value = prevVal;
            prev.selectionStart = 0;
            prev.selectionEnd = 1;
          }, 1);
        }
      }
    }
  };
  const handleResend = () => {
    setCounter((_) => 30);
    const interVal = setInterval(() => {
      setCounter((_prevCounter) => {
        if (_prevCounter - 1 === 0) {
          clearInterval(interVal);
        }
        return _prevCounter - 1;
      });
    }, 1000);
  };
  const checkVerificationsComplete = () => {
    let verificationCode = "";
    inputRefs.forEach((ref: RefObject<HTMLInputElement>) => {
      if (ref.current?.value && ref.current?.value.length === 1) {
        verificationCode += ref.current?.value;
      } else {
        return null;
      }
    });

    return verificationCode.length === 6 ? verificationCode : null;
  };
  const verifyRequest = async () => {
    const verificationCode = checkVerificationsComplete();
    if (verificationCode) {
      setLoading((_) => true);
      console.log("verificationCode :" + verificationCode);

      // send server action recieve true or false

      let actionResult = false;
      let registerData: any;
      if (source === "verify-register") {
        let registerData = localStorage.getItem("register");
        if (registerData) {
          setUser((_) => JSON.parse(registerData as string));
        }

        // console.log(registerData);
        // check code with register server action async -> redirects or returns Bearer as result
        actionResult = Math.random() > 0.5;
      } else {
        // source === "verify-forgot"
        // check verification code async ->
        actionResult = Math.random() > 0.5;
      }

      setTimeout(() => {
        // this would be gone
        if (actionResult) {
          setSuccess((_) => true);
          if (source === "verify-forgot") {
            actionResult = Math.random() > 0.5;

            // following success actions
            const verificationEmail = localStorage.getItem(source + "-email");
            localStorage.removeItem(source + "-email");
            localStorage.setItem(
              "verificationEmail",
              verificationEmail as string
            );
            localStorage.setItem("verificationCode", verificationCode);
            setLoading((_) => false);
            setTimeout(() => {
              router.push("/reset-pass");
            }, 500);
            //
          } else {
            // source === verify-register
            // this is after register got verified
            // set bearer to cookie and do -> router.push("/onboarding")

            if (user) {
              console.log("Welcome " + user.username + " / " + user.email);
            }
            setLoading((_) => false);
          }
        } else {
          setError((_) => true);
          setLoading((_) => false);
        }
      }, 1500);
    }
  };

  const onSubmit = async (values: z.infer<typeof VerifyValidation>) => {
    // console.log(values.username + "/" + values.email + "/" + values.password);
    setLoading((_) => true);
    setTimeout(() => {
      setLoading((_) => false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-row justify-between items-center gap-5">
            <div className="flex flex-row justify-between gap-2">
              {keyItems.map((item, index) => {
                const itemStr = item.toString() as
                  | "1"
                  | "2"
                  | "3"
                  | "4"
                  | "5"
                  | "6";
                return (
                  <FormField
                    control={form.control}
                    key={itemStr}
                    name={itemStr}
                    render={({ field }) => (
                      <FormItem className="flex">
                        <FormControl className="no-focus bg-opacity-10 bg-dark-3 text-light-1 border-0 border-b-2 rounded-none">
                          <Input
                            className={`w-7 p-1 text-center transition-colors duration-150 ease-in-out
                            focus:border-b-purple-600 focus:border-opacity-100 
                              border-b-2 text-[20px] ${
                                error
                                  ? "border-b-red-600 border-opacity-90"
                                  : success
                                  ? "border-b-green-500 border-opacity-90"
                                  : "border-b-light-1 border-opacity-20"
                              }`}
                            type="text"
                            maxLength={1}
                            autoComplete="off"
                            ref={inputRefs[index]}
                            onFocus={(e) => {
                              e.currentTarget.selectionStart = 0;
                              e.currentTarget.selectionEnd = 1;
                            }}
                            onChange={(e) => handlerForward(index, e)}
                            onKeyDown={(e) => handlerBackward(index, e)}
                            id={itemStr}
                            // {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-[12px]" />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
            <div className="text-center py-0 h-8 my-0">
              {loading && <Spinner />}
            </div>
          </div>
        </form>
        <div
          className={`flex justify-start gap-1 mt-2 items-center transition-all duration-150 ease-in-out 
          ${error ? "text-red-600" : success ? "text-green-500" : ""} ${
            error || success ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-body-normal">
            {error ? (
              <RiErrorWarningFill />
            ) : success ? (
              <RiCheckboxCircleFill />
            ) : (
              <RiErrorWarningFill />
            )}
          </span>
          <span className="text-small-medium">
            {error ? "Incorrect code" : success ? "Correct code" : "!"}
          </span>
        </div>
      </Form>
      <button
        disabled={counter > 0}
        className={`text-small-regular mt-8 form-link h-5 ${
          counter ? "opacity-60 hover:text-primary-500" : ""
        }`}
        // href="?"
        onClick={(e) => {
          handleResend();
        }}
      >
        Didn't receive a code? Resend {counter ? `(${counter})` : ""}
      </button>
    </div>
  );
};

export default VerifyForm;
