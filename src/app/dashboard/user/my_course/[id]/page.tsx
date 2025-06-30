import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

const MyCourseDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const detail = await api.userRoute.course.getOneMyCourse({
    courseId: id,
  });

  if (!detail) {
    redirect("/404");
  }

  return redirect(
    `/dashboard/user/my_course/${detail.id}/${detail.chapters[0]?.id}`,
  );
};

export default MyCourseDetailPage;
