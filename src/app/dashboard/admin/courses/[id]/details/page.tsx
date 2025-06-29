export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import UpdateCourseForm from "./_components/update_course_form";

const CreatePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  void api.adminRoute.course.getOne.prefetch({
    courseId: id,
  });
  void api.adminRoute.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <UpdateCourseForm id={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default CreatePage;
