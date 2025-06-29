"use client";

import {
  Image,
  LayoutDashboard,
  ListChecks,
  Pencil
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Banner } from "~/components/ui/banner";
import { Button } from "~/components/ui/button";
import { IconBadge } from "~/components/ui/icon-badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import { Actions } from "./actions";
import { ChaptersForm } from "./chapters-form";
import { CourseSale } from "./course-sale";
import { ImageBannerForm } from "./image-banner-form";
import { ImageForm } from "./image-form";

const CourseSetup = ({id}: {id: string}) => {
  const [course] = api.adminRoute.course.getOne.useSuspenseQuery({
    courseId: id,
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.desc,
    course.titleDesc,
    course.image,
    course.bannerImage,
    course.level,
    course.materi,
    course.place,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  const requiredWebinarFields = [
    course.title,
    course.desc,
    course.titleDesc,
    course.image,
    course.bannerImage,
    course.level,
    course.materi,
    course.place,
    course.price,
  ];
  const totalWebinarFields = requiredWebinarFields.length;
  const completedWebinarFields = requiredWebinarFields.filter(Boolean).length;
  const completionWebinarText = `(${completedWebinarFields}/${totalWebinarFields})`;
  const isWebinarComplete = requiredWebinarFields.every(Boolean);

  return (
    <>
      {course.isHidden && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <ScrollArea className="h-full">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Course setup</h1>
              <span className="text-sm text-slate-700">
                {course.isWebinar
                  ? `Complete all fields ${completionWebinarText}`
                  : `Complete all fields ${completionText}`}
              </span>
            </div>
            <Actions
              disabled={course.isWebinar ? !isWebinarComplete : !isComplete}
              courseId={id}
              isPublished={!course.isHidden}
            />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>

              {/* Edit Details */}
              <div className="bg-muted mt-6 rounded-md border p-4">
                <div className="flex items-center justify-between font-medium">
                  Course Details
                  <Link href={`/dashboard/admin/courses/${id}/details`}>
                    <Button variant="ghost">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Course Sale */}
              <CourseSale
                initialData={{
                  isSale: course.isSale ?? false,
                  price: course.price,
                  salePrice: course.salePrice ?? "0",
                }}
                courseId={course.id}
              />
            </div>

            <div className={`space-y-6 ${course.isWebinar ? "hidden" : ""}`}>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course chapters</h2>
                </div>
                <ChaptersForm initialData={course} courseId={course.id} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Image} />
                  <h2 className="text-xl">Course image</h2>
                </div>
                {/* Course Image */}
                <ImageForm initialData={course} courseId={course.id} />

                {/* Course Banner Image */}
                <ImageBannerForm initialData={course} courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default CourseSetup;