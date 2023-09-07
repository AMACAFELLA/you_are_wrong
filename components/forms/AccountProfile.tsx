"use client";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
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
import { z } from "zod";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { dataURItoBlob, readerResizer } from "../shared/helpers";
interface PropsType {
  user: {
    id: string;
    objectId: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export const AccountProfile = ({ user, btnTitle }: PropsType) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const [loading, setLoading] = useState(false);

  try {
    user.objectId = JSON.parse(user.objectId);
    localStorage.setItem("my_user_id", user.objectId);
  } catch (e) { }
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image,
      name: user?.name,
      username: user?.username,
      bio: user?.bio,
    },
  });
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    // const fileReader = new FileReader();
    if (e.target.files && e.target.files.length) {
      // not empty
      const file = e.target.files[0];
      readerResizer(file)
        .then((imageDataUrl) => {
          fieldChange(imageDataUrl as string);
          const blob = dataURItoBlob(imageDataUrl as string);
          const new_file = new File([blob], file.name, { type: blob.type });
          setFiles((_) => [new_file]);
        })
        .catch((_e) => {
          // console.log(e);
        });
      //   // @ts-ignore
      //   setFiles((_) => Array.from(e.target.files));
      //   if (!file.type.includes("image")) return;
      //   fileReader.onload = async (event) => {
      //     const imageDataUrl = event.target?.result?.toString() || "";
      //     fieldChange(imageDataUrl);
      //   };

      //   fileReader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    setLoading((_) => true);
    const blob = values.profile_photo;
    if (blob) {
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);
        if (imgRes && imgRes[0].fileUrl) {
          values.profile_photo = imgRes[0].fileUrl;
        }
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      email: user.email,
      name: values.name,
      image: values.profile_photo,
      bio: values.bio,
      path: pathname ?? "/",
    });
    setLoading((_) => false);
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="profile_photo"
                      style={{
                        width: 96,
                        height: 96,
                      }}
                      width="96"
                      height="96"
                      priority
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile_photo"
                      width="24"
                      height="24"
                      className="object-cover"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>

                {/* <FormMessage className="text-red-600 text-[12px]" /> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 mt-1">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red-600 text-[12px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 mt-1">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red-600 text-[12px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 mt-1">
                  Bio
                </FormLabel>
                <FormControl className="">
                  <Textarea
                    rows={6}
                    maxLength={500}
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red-600 text-[12px]" />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="bg-primary-500">
            {btnTitle}
          </Button>
        </form>
      </Form>
      <div className="text-center my-0 py-0 h-8 mt-5">
        {loading && <Spinner />}
      </div>
    </>
  );
};