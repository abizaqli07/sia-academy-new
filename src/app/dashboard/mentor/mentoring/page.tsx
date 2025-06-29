export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import MentoringSetup from "./_components/mentoring_setup";

const MentoringMentorPage = async () => {
  void api.mentorRoute.mentoring.getData.prefetch();
  void api.mentorRoute.mentoring.getCategory.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <MentoringSetup />
        </div>
      </div>
    </HydrateClient>
  );
};

export default MentoringMentorPage;
