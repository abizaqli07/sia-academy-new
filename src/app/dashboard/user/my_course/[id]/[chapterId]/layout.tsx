"use client";

import { type ReactNode } from "react";
import { Sidebar } from "./_components/course_sidebar";
import { MobileSidebar } from "./_components/mobile-sidebar";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

const MyCourseDetailLayout = ({ children }: { children: ReactNode }) => {
  const params = useParams<{ id: string; chapterId: string }>();
  const { data, isLoading } = api.userRoute.course.getOneMyCourse.useQuery({
    courseId: params.id,
  });

  if (isLoading) {
    return;
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex h-full flex-col gap-x-16 gap-y-8 lg:flex-row-reverse w-fit mx-auto">
            <div className="relative hidden max-w-[300px] min-w-[250px] lg:flex">
              <Sidebar data={data} />
            </div>
            <div className="relative mb-12 flex lg:hidden">
              <MobileSidebar data={data} />
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailLayout;
