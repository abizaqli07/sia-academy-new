export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import MyMentoringList from "./_components/my_mentoring_list";

const MyMentoringPage = async () => {
  void api.userRoute.mentoring.getAllMyMentoring.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="space-y-8 px-4 lg:px-6">
            <div className="text-3xl font-semibold md:text-4xl">
              Mentoring Saya
            </div>
            <MyMentoringList />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default MyMentoringPage;
