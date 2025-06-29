"use client"

import { ImageIcon, LayoutDashboard, Pencil } from "lucide-react";
import Link from "next/link";
import { Banner } from "~/components/ui/banner";
import { Button } from "~/components/ui/button";
import { IconBadge } from "~/components/ui/icon-badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import { Actions } from "./actions";
import { ImageBannerForm } from "./image-banner-form";
import { ImageForm } from "./image-form";
import RegisterMentoringForm from "./register_mentoring_form";

const MentoringSetup = () => {
  const [mentorData] = api.mentorRoute.mentoring.getData.useSuspenseQuery();
  const [categories] = api.mentorRoute.mentoring.getCategory.useSuspenseQuery();
  const mentoringData = mentorData?.mentoring;

  if (categories?.length === 0 || categories === undefined) {
    return <div>Error..</div>;
  }

  if (!mentoringData) {
    return <RegisterMentoringForm categories={categories} />;
  }

  const requiredFields = [
    mentoringData.title,
    mentoringData.desc,
    mentoringData.bannerImage,
    mentoringData.materi,
    mentoringData.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {mentoringData.isHidden && (
        <Banner label="This mentoring is unpublished. It will not be visible to the mentee." />
      )}
      <ScrollArea className="h-full">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Mentoring setup</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <Actions
              disabled={!isComplete}
              mentoringId={mentoringData.id}
              isPublished={!mentoringData.isHidden}
            />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Sesuaikan mentoring anda</h2>
              </div>

              {/* Edit Details */}
              <div className="mt-6 rounded-md border bg-muted p-4">
                <div className="flex items-center justify-between font-medium">
                  Detail Mentoring
                  <Link href={`/dashboard/mentor/mentoring/details`}>
                    <Button variant="ghost">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit detail
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Edit Details Mentor */}
              <div className="mt-6 rounded-md border bg-muted p-4">
                <div className="flex items-center justify-between font-medium">
                  Detail Mentor
                  <Link href={`/dashboard/mentor/mentoring/details_mentor`}>
                    <Button variant="ghost">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit detail
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ImageIcon} />
                  <h2 className="text-xl">Gambar mentor & banner</h2>
                </div>
                {/* Mentoring Banner Image */}
                <ImageBannerForm
                  initialData={mentoringData.bannerImage}
                  mentoringId={mentoringData.id}
                />

                {/* Mentor Image */}
                <ImageForm
                  initialData={mentorData.image}
                  mentorId={mentorData.id}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default MentoringSetup;
