"use client";

import {
  IconAlarm,
  IconCalendarEvent,
  IconChartArrowsVertical,
  IconLocationPin,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type z } from "zod";
import BootcampBenefitComp from "~/components/block/bootcamp_benefit";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { currencyFormatter } from "~/lib/utils";
import { type CourseIdSchema } from "~/server/validator/course";
import { api, type RouterOutputs } from "~/trpc/react";

const CourseDetailSection = ({ id }: { id: string }) => {
  const [data] = api.userRoute.course.getOneCourse.useSuspenseQuery({
    courseId: id,
  });

  return (
    <>
      <div className="flex min-h-screen gap-8 max-w-[1350px] mx-auto">
        {/* Main Section */}
        <section className="min-h-screen w-full pt-8 lg:flex-[2]">
          {/* Header */}
          <div className="flex w-full flex-col gap-8 rounded-lg">
            <div className="relative aspect-[3/1] max-h-[300px] w-full rounded-lg">
              <Image
                alt="Banner Course"
                src={data?.bannerImage ?? "/images/courses/aimasterclass.png"}
                fill
                className="rounded-xl object-contain object-top"
              />
            </div>
            {data?.isFree && (
              <div className="w-full space-y-4">
                <div className="text-lg font-bold">
                  PENGETAHUAN INDUSTRI EKSKLUSIF{" "}
                  {data.isFree ? ", GRATIS!" : ""}
                </div>
                <div className="text-primary text-5xl font-bold">
                  {data.title}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 rounded-lg border-[1.5px] border-gray-300 p-2 lg:hidden">
              <BuySection data={data} />
            </div>
          </div>

          {/* Benefit */}
          <BootcampBenefitComp />

          <Separator className="mt-[20px] bg-gray-400" />

          {/* Description */}
          <div className="mt-[20px] w-full">
            <div className="flex flex-col gap-4">
              <div className="text-xl font-bold">
                <span className="text-primary text-sm">Tentang Kelas</span>{" "}
                <br />
                {data?.titleDesc}
              </div>
              <div className="text-justify text-gray-600">
                <div
                  className="space-y-4"
                  dangerouslySetInnerHTML={{ __html: data?.desc ?? "" }}
                ></div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <div className="text-xl font-bold">
                <span className="text-primary text-sm">Kurikulum</span> <br />
                Materi yang dipelajari!
              </div>
              <div className="flex flex-wrap gap-4">
                {data?.materi?.split(",").map((materi, index) => (
                  <div
                    key={index}
                    className="bg-primary/30 w-fit rounded-lg px-4 py-2"
                  >
                    {materi}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="relative hidden min-h-screen w-full flex-[1] pt-8 lg:flex">
          <div className="dark:bg-background sticky top-8 flex h-fit w-full flex-col gap-4 rounded-lg bg-gray-200 p-4 dark:border-2 dark:border-gray-500">
            <BuySection data={data} />
          </div>
        </section>
      </div>
    </>
  );
};

interface BuySectionInterface {
  data: RouterOutputs["userRoute"]["course"]["getOneCourse"];
}

const BuySection = ({ data }: BuySectionInterface) => {
  const router = useRouter();
  const context = api.useUtils();

  const HDate = data?.date?.valueOf() ?? Date.now().valueOf();

  const isNotAvailable =
    HDate < Date.now().valueOf() && data?.isWebinar === true;

  const createInvoice = api.userRoute.purchase.purchaseCourse.useMutation({
    async onSuccess(data) {
      await context.userRoute.course.getAllMyCourse.invalidate();

      if (data.url === null) {
        console.log(data.error);
      } else {
        router.push(data.url);
      }
    },
    onError(error) {
      toast(error.data?.code, {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof CourseIdSchema>) => {
    createInvoice.mutate(values);
  };

  return (
    <>
      <div className="text-2xl font-bold">{data?.title}</div>
      <div className="flex flex-col gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <IconCalendarEvent className="text-xl" />
          {data?.date?.toLocaleDateString("in-ID")}
        </div>
        {data?.isFree ? (
          <div className="flex items-center gap-2">
            <IconAlarm className="text-xl" />
            {data?.date?.toLocaleTimeString("in-ID")} WIB
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <IconChartArrowsVertical className="text-xl" />
            {data?.level}
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconLocationPin className="text-xl" />
          {data?.place}
        </div>
      </div>
      <Separator className="bg-gray-400" />
      <div className="dark:bg-primary-dark flex w-full flex-col gap-3 rounded-lg bg-gray-200 p-4">
        {(data?.isSale ?? data?.isFree) ? (
          <Badge variant={"destructive"} className="w-fit">
            Promo
          </Badge>
        ) : (
          <></>
        )}
        <div className="flex justify-between font-semibold">
          <div>Total Harga :</div>
          {data?.isFree ? (
            <div className="text-primary text-xl font-semibold">Free</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`${data?.isSale ? "line-through text-xs" : ""}`}>
                {currencyFormatter.format(Number(data?.price))}
              </div>
              {data?.isSale ? (
                <div className="text-primary text-lg font-semibold">
                  {currencyFormatter.format(Number(data?.salePrice))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={() =>
            onSubmit({
              courseId: data?.id ?? "",
            })
          }
          disabled={isNotAvailable}
        >
          {isNotAvailable ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
        </Button>

        {isNotAvailable && (
          <div className="text-center text-sm font-medium text-red-500">
            *Tunggu webinar kami selanjutnya*
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetailSection;
