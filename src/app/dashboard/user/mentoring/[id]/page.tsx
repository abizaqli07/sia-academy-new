export const dynamic = "force-dynamic";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import DetailMentorSection from "./_components/detail_mentor_section";

const MentoringDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.userRoute.mentoring.getOneMentoring.prefetch({
    mentoringId: id,
  });

  const session = await auth();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <DetailMentorSection mentoringId={id} session={session} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default MentoringDetail;
