"use client";

import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { Banner } from "~/components/ui/banner";
import { IconBadge } from "~/components/ui/icon-badge";
import { api } from "~/trpc/react";
import { ChapterActions } from "./chapter-actions";
import { ChapterDescriptionForm } from "./chapter-description-form";
import { ChapterTitleForm } from "./chapter-title-form";
import { ChapterVideoForm } from "./chapter-video-form";

const ChapterSetup = ({ id, courseId }: { id: string; courseId: string }) => {
  const [chapter] = api.adminRoute.chapter.getOne.useSuspenseQuery({
    id: id,
    courseId: courseId,
  });

  if (!chapter) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Something Wrong Occured
      </div>
    );
  }

  const requiredFields = [
    chapter?.title,
    chapter?.description,
    chapter?.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter?.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/admin/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={id}
                isPublished={chapter?.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm initialData={chapter} chapterId={id} />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={id}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={id}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterSetup;
