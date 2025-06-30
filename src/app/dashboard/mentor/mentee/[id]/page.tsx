import { api, HydrateClient } from "~/trpc/server";
import MenteeDetail from "./_components/mentee_detail";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

const MenteeDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.mentorRoute.mentee.getOne.prefetch({
    mentoringDataId: id,
  });

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <MenteeDetail id={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default MenteeDetailPage;
