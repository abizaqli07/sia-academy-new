export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import AllCourse from "./_components/all_course";

const AllCourseListPage = async () => {
  void api.adminRoute.course.getAll.prefetch();
  void api.adminRoute.category.getAll.prefetch()

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllCourse />
        </div>
      </div>
    </HydrateClient>
  );
};

export default AllCourseListPage;
