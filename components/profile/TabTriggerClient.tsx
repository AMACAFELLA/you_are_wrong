"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TabsTrigger } from "../ui/tabs";
import Image from "next/image";

const TabTriggerClient = ({ tab, total }: { tab: TabType; total: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updateUrlQueryString = (tabValue: string) => {
    let sortBy = searchParams.get("sort");
    let tab = searchParams.get("tab");
    if (!tab) tab = "threads";
    if (!sortBy) sortBy = "top";

    router.replace(`${pathname}?tab=${tabValue}&sort=${sortBy}`, {
      scroll: false,
    });
  };

  return (
    <TabsTrigger
      key={tab.label}
      value={tab.value}
      className="tab rounded-xl"
      onClickCapture={(_) => updateUrlQueryString(tab.value)}
    >
      <Image
        src={tab.icon}
        alt="Tab Label"
        width="24"
        height="24"
        className="object-contain"
      />
      <p className="max-sm:hidden">{tab.label}</p>

      <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
        {total}
      </p>
    </TabsTrigger>
  );
};

export default TabTriggerClient;