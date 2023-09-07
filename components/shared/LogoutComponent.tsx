"use client";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const LogoutComponent = ({
  children,
  styles,
}: {
  styles?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <SignedIn>
      <SignOutButton signOutCallback={() => router.push("/sign-in")}>
        <div className={`flex cursor-pointer ${styles}`}>
          <Image src="/assets/logout.svg" alt="logout" width="24" height="24" />
          {children}
        </div>
      </SignOutButton>
    </SignedIn>
  );
};

export default LogoutComponent;
