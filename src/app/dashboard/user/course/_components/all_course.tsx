"use client";

import { IconBook2, IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { currencyFormatter } from "~/lib/utils";
import { api } from "~/trpc/react";

const AllCourseList = () => {
  const [courses] = api.userRoute.course.getAllCourse.useSuspenseQuery();

  return (
    <section className="w-full">
      <div className="flex flex-col items-center gap-8">
        <div className="flex w-full max-w-[600px] flex-col gap-4 text-center">
          <div className="text-3xl font-bold lg:text-5xl">
            Pilih <span className="text-primary">Course</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-wrap items-start justify-center gap-8">
            {courses.length > 0 ? (
              courses.map((data) => (
                <Link
                  key={data.id}
                  href={`/dashboard/user/course/${data.id}`}
                  className="dark:bg-primary-dark flex w-full max-w-[320px] flex-col gap-6 rounded-lg p-4 shadow-md"
                >
                  <div>
                    <div className="bg-primary w-full rounded-t-lg p-3 text-center font-bold text-white">
                      {data.isWebinar ? "Webinar" : "Bootcamp"}
                    </div>
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-b-lg bg-gray-500">
                      <Image
                        alt="Course Image"
                        src={
                          data.image ??
                          "/images/courses/aimasterclass_thumbnail.png"
                        }
                        fill
                        className="object-cover object-left-top"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-primary w-fit rounded-lg px-2 py-1 text-sm font-semibold text-white">
                      {data.category?.name}
                    </div>
                    <div className="text-lg font-semibold">{data.title}</div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="flex items-center gap-2 font-medium">
                        <IconBook2 className="text-xl" />{" "}
                        {data.materi?.split(",").length} Sessions
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <IconUsers className="text-xl" /> {data.purchases.length}
                        + Students
                      </div>
                    </div>
                    {data.isFree ? (
                      <div className="text-primary text-xl font-semibold">
                        Free
                      </div>
                    ) : (
                      <div>
                        <div className={`${data.isSale ? "line-through text-xs" : ""}`}>
                          {currencyFormatter.format(Number(data.price))}
                        </div>
                        {data.isSale ? (
                          <div className="text-primary text-lg font-semibold">
                            {currencyFormatter.format(Number(data.salePrice))}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-lg bg-gray-200 px-24 py-4 text-center">
                <div className="text-2xl font-semibold">Belum Ada Bootcamp</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCourseList;
