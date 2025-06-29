export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import ChapterSetup from "./_components/chapter_setup";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) => {
  const {id, chapterId} = await params
  void api.adminRoute.chapter.getOne.prefetch({
    id: chapterId,
    courseId: id
  });

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ChapterSetup id={chapterId} courseId={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default ChapterIdPage;
