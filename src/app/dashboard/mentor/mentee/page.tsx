export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import AllMentee from "./_components/all_mentee";

const MenteeListPage = async () => {
  void api.mentorRoute.mentee.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllMentee />
        </div>
      </div>
    </HydrateClient>
  );
};

export default MenteeListPage;
