import { api } from "~/trpc/server";
import { VideoPlayer } from "./_components/video-player";
import { Preview } from "~/components/ui/preview";

const ChapterDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) => {
  const { chapterId } = await params;
  const chapter = await api.userRoute.course.getOneChapter({
    chapterId: chapterId,
  });

  return (
    <div>
      <div className="mx-auto flex max-w-4xl flex-col gap-4 pb-20">
        <h2 className="mb-2 text-2xl font-semibold">{chapter?.title}</h2>
        <div className="w-full">
          <VideoPlayer
            playbackId={chapter?.muxData?.playbackId ?? ""}
            title={chapter?.title ?? ""}
          />
        </div>
        <div>
          <Preview value={chapter?.description ?? ""} />
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailPage;
