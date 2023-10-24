"use client";
import { SignInButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const LoginComponent = ({
    children,
    styles,
}: {
    styles?: string;
    children?: React.ReactNode;
}) => {
    return (
        <SignInButton>
            <div className={`flex cursor-pointer ${styles}`}>
                <Image src="/assets/sign-in.svg" alt="sign in" width="24" height="24" />
                {children}
            </div>
        </SignInButton>
    );
};

export default LoginComponent;