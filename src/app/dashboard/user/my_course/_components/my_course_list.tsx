"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import MyCourseCard from "./my_course_card";

const tabs = [
  {
    id: "webinar",
    title: "Webinar",
  },
  {
    id: "bootcamp",
    title: "Bootcamp",
  },
];

const MyCourseList = () => {
  const [tab, setTab] = useState<string>("webinar");
  const [data] = api.userRoute.course.getAllMyCourse.useSuspenseQuery();

  const dataBootcamp = data.filter(
    (value) => value.course?.isWebinar === false,
  );
  const dataWebinar = data.filter((value) => value.course?.isWebinar === true);

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full gap-6 overflow-x-auto">
        {tabs.map((data) => (
          <div
            key={data.id}
            className={`border-primary cursor-pointer rounded-md border-[thin] px-6 py-2 ${tab === data.id ? "bg-primary" : "bg-white"}`}
            onClick={() => setTab(data.id)}
          >
            <div
              className={`text-base font-medium ${tab === data.id ? "text-white" : "text-primary"}`}
            >
              {data.title}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        {tab === "webinar" &&
          (dataWebinar.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {dataWebinar.map((value) => (
                <MyCourseCard key={value.id} data={value} />
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center gap-y-3 rounded-lg bg-muted px-24 py-4 text-center">
              <div className="text-2xl font-semibold">Belum Ada Webinar</div>
              <Link href={"/dashboard/user/course"}>
                <Button>Temukan Webinar</Button>
              </Link>
            </div>
          ))}
        {tab === "bootcamp" &&
          (dataBootcamp.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {dataBootcamp.map((value) => (
                <MyCourseCard key={value.id} data={value} />
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center gap-y-3 rounded-lg bg-muted px-24 py-4 text-center">
              <div className="text-2xl font-semibold">Belum Ada Bootcamp</div>
              <Link href={"/dashboard/user/course"}>
                <Button>Temukan Bootcamp</Button>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyCourseList;
