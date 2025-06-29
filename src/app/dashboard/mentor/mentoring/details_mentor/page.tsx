export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import UpdateMentorForm from "./_components/update_mentor_form";

const DetailMentorPage = async () => {
  void api.mentorRoute.mentoring.getData.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <UpdateMentorForm />
        </div>
      </div>
    </HydrateClient>
  );
};

export default DetailMentorPage;
