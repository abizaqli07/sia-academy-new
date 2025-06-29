export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import UpdateMentoringForm from "./_components/update_mentoring_form";

const MentoringDetailsPage = async () => {
  void api.mentorRoute.mentoring.getData.prefetch();
  void api.mentorRoute.mentoring.getCategory.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <UpdateMentoringForm />
        </div>
      </div>
    </HydrateClient>
  );
};

export default MentoringDetailsPage;
