export const dynamic = "force-dynamic";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import HomeSection from "./_components/home_section";

const HomePage = async () => {
  const session = await auth();

  void api.userRoute.course.getFeaturedCourse.prefetch();
  void api.userRoute.mentoring.getFeaturedMentoring.prefetch();

  return (
    <>
      <HomeSection session={session} />
    </>
  );
};

export default HomePage;
