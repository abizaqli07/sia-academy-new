export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import MyCourseList from "./_components/my_course_list";

const MyCoursePage = async () => {
  void api.userRoute.course.getAllMyCourse.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="space-y-8 px-4 lg:px-6">
            <div className="text-3xl font-semibold md:text-4xl">
              Kursus Saya
            </div>
            <MyCourseList />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default MyCoursePage;
