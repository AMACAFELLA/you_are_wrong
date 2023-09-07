"use client";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import Avatar from "./Avatar";

const SidebarLinks = ({
  type,
  text_class,
}: {
  type: "leftsidebar_link" | "bottombar_link";
  text_class: string;
}) => {
  const pathname = usePathname();
  const { userId, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileColor, setProfileColor] = useState<string>("#555555");
  const replaceProfilePicture = async (abortController: AbortController) => {
    if (!loading) {
      setLoading((_) => true);
      const token = await getToken();
      if (token) {
        let headers: { Authorization?: string } = {};
        headers["Authorization"] = `Bearer ${token}`;
        let params: {
          headers: { Authorization?: string };
          cache?: string;
          signal?: AbortSignal;
        } = {
          headers: headers,
          cache: "no-cache",
        };
        if (abortController) {
          params.signal = abortController.signal;
        }
        const res = await fetch(`/api/user/image`, {
          ...(params as RequestInit),
        }).then((res) => res.json());

        setProfileImage(res.image);
        setProfileColor(res.color);
      }
    }
  };
  useEffect(() => {
    const abortController = new AbortController();
    replaceProfilePicture(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {sidebarLinks.map((item, id) => {
        let isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        if (item.route === "/profile")
          isActive = pathname === `/profile/${userId}`;
        return (
          <Link
            href={item.route === "/profile" ? `/profile/${userId}` : item.route}
            key={item.label}
            className={`${type} ${
              isActive ? "gradient-primary hover:shadow-xl" : "hover:bg-dark-1"
            }`}
          >
            {item.route === "/profile" && profileImage ? (
              <Avatar
                src={profileImage}
                bg_color={profileColor}
                alt={item.label}
                width={26}
                height={26}
                loadingText="..."
              />
            ) : (
              <Image
                src={item.imgURL}
                alt={item.label}
                width="24"
                height="24"
              />
            )}

            <p className={`${text_class} flex items-center`}>
              {type === "leftsidebar_link"
                ? item.label
                : item.label.split(" ")[0]}
            </p>
          </Link>
        );
      })}
    </>
  );
};

export default SidebarLinks;
