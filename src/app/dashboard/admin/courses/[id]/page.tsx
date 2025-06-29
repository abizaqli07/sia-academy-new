import { api, HydrateClient } from "~/trpc/server";
import CourseSetup from "./_components/course_setup";

export const dynamic = "force-dynamic";

const CourseDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.adminRoute.course.getOne.prefetch({
    courseId: id
  })

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CourseSetup id={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default CourseDetailsPage;
