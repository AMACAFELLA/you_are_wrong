"use client";

import { Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect, useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";

const EmailChip = ({
  source,
}: {
  source: "verify-forgot" | "verify-register";
}) => {
  const [email, setEmail] = useState("...");
  const router = useRouter();
  useLayoutEffect(() => {
    readEmailFromLocalStorage();
  }, []);
  const readEmailFromLocalStorage = () => {
    const emailText = localStorage.getItem(source + "-email");

    if (emailText) {
      setEmail((_) => emailText);
    } else {
      // localStorage.setItem("forgot-email", "iamsabet7@gmail.com");
    }
  };
  return (
    <div className="email-chip">
      <IoPersonCircleSharp size={20} />
      <p className="text-subtle-medium text-gray-2 flex flex-1">{email}</p>
      <Link
        href={`?`}
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
        className="form-link"
      >
        <Edit size={15} />
      </Link>
    </div>
  );
};

export default EmailChip;
