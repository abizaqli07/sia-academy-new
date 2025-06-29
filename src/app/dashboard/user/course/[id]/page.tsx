export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import CourseDetailSection from "./_components/course_detail_section";

const CourseDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.userRoute.course.getOneCourse.prefetch({
    courseId: id,
  });

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <CourseDetailSection id={id} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default CourseDetail;
