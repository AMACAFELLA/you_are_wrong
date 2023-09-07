"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoChevronBackSharp } from "react-icons/io5";
const JumpTopButton = ({
  type = "fixed",
  targetClass,
}: {
  type: "fixed" | "relative";
  targetClass?: string;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const threshold = type === "fixed" ? 140 : 30;
  useEffect(() => {
    attachScrollHandler();

    return () => {
      clearScrollHandler();
    };
  }, []);

  const scrollHandler = () => {
    if (targetClass) var element = document.querySelector(targetClass);
    // console.log(
    //   window.scrollY,
    //   "/",
    //   window.innerHeight,
    //   "/",
    //   window.outerHeight
    // );

    setShow((_) => {
      var scrollY = type === "fixed" ? window.scrollY : element?.scrollTop;

      if (scrollY && scrollY > threshold && !show) {
        return true;
      } else {
        return false;
      }
    });
  };

  const attachScrollHandler = () => {
    var element: any;
    if (targetClass) element = document.querySelector(targetClass);
    setShow((_) => {
      var scrollY = type === "fixed" ? window.scrollY : element?.scrollTop;

      if (scrollY && scrollY > threshold && !show) {
        return true;
      } else {
        return false;
      }
    });
    if (element) element.addEventListener("scroll", scrollHandler);
    else window.addEventListener("scroll", scrollHandler);
  };
  const clearScrollHandler = () => {
    var element: any;
    if (targetClass) element = document.querySelector(targetClass);

    if (element) element.removeEventListener("scroll", scrollHandler);
    else window.removeEventListener("scroll", scrollHandler);
  };
  const jumpToTop = () => {
    var element: any;
    if (targetClass) element = document.querySelector(targetClass);

    if (element)
      element.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    else
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };
  return (
    <Button
      // disabled={!show}
      type="button"
      onClick={jumpToTop}
      className={`fixed px-2 py-1 rounded-full shadow-lg flex justify-center items-center ${
        type === "fixed"
          ? "right-7 md:right-8 xl:right-[298px]"
          : "right-6 bottom-[-17px]"
      } ${
        show
          ? `${
              type === "fixed"
                ? "bottom-24 md:bottom-10 lg:bottom-10 sm:bottom-28"
                : ""
            } opacity-100`
          : `${type === "fixed" ? "bottom-[-50px]" : ""} opacity-0`
      } z-50 bg-primary-500 transition-all duration-300 ease-in-out hover:bg-secondary-500 hover:text-dark-2`}
    >
      <div className="rotate-90 mb-0.5">
        <IoChevronBackSharp size="25" />
      </div>
    </Button>
  );
};
export default JumpTopButton;
