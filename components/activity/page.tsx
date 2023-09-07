"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";
import { formattedDateString } from "../shared/helpers";
import ActivityIcon from "./ActivityIcon";
import usePagination from "@/hooks/usePagination";
import Avatar from "../shared/Avatar";

const ActivitiesComponent = () => {
  const { getToken } = useAuth();
  const [loading, activities] = usePagination({
    options: {
      baseUrl: "/api/activity",
      postFixQs: "",
      pageSize: 10,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 1,
    },
    getToken: getToken,
  });

  return (
    <>
      {activities && activities.length > 0 && (
        <>
          {activities.map((act: any, index: number) => {
            return (
              <Link key={`${act.type}"-"${act.link}-${index}`} href={act.link}>
                <article className="activity-card">
                  <div className="flex flex-col justify-start sm:flex-row sm:justify-between w-full items-start sm:items-center ">
                    <div className="flex justify-between overflow-hidden items-center">
                      <div className="relative h-full">
                        <div className="w-12 h-12 mr-2">
                          <Avatar
                            src={act.subject.image}
                            bg_color={act.subject.color}
                            alt="Profile Picture"
                            width={48}
                            height={48}
                            loadingText={act.subject.name.charAt(0)}
                          />
                          <ActivityIcon
                            type={act.type}
                            message={act.message}
                            styles="flex absolute z-[10] top-7 sm:top-7 left-8 sm:left-8"
                          />
                        </div>
                      </div>
                      <p className="flex flex-col sm:flex-row flex-1 !text-base-regular text-light-1 ml-2 leading-[10rem]">
                        <span className="mr-1 text-primary-500 text-ellipsis line-clamp-1 w-max-[132px]  h-full">
                          {act.subject.name}
                        </span>

                        <span className="text-ellipsis line-clamp-1 w-max-[210px] h-full">
                          {act.message}
                        </span>
                        {/* <span className="ml-1 text-light-2">
                            {HTMLReactParser(act.text)}
                          </span> */}
                      </p>
                    </div>
                    <div className="w-full sm:w-36">
                      <h5 className="text-subtle-medium text-gray-1 mt-2 sm:mt-0 ml-1.5 sm:ml-0 text-right">
                        {formattedDateString(act.createdAt)}
                      </h5>
                    </div>
                  </div>
                  {/* <Link
                       href={act.link}
                      className="user-card_btn px-4 py-2 text-center text-body-bold"
                   
                    >
                      View
                    </Link> */}
                </article>
              </Link>
            );
          })}
        </>
      )}
      {!loading && activities && activities.length === 0 && (
        <p className="!text-base-regular text-light-3">No Activity yet</p>
      )}
      {loading && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ActivitiesComponent;
