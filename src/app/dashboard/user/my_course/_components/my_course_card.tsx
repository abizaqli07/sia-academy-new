"use client";

import {
  IconBook2,
  IconCalendarEvent,
  IconLocationPin,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

import { api, type RouterOutputs } from "~/trpc/react";

interface MyCourseCardPropsInterface {
  data: RouterOutputs["userRoute"]["course"]["getAllMyCourse"][number];
}

const MyCourseCard = ({ data }: MyCourseCardPropsInterface) => {
  const router = useRouter();

  const {
    data: invoiceData,
    isLoading,
    isError,
  } = api.userRoute.purchase.getInvoiceData.useQuery({
    invoiceId: data.invoiceId ?? "",
  });

  let status = "";
  const paymentComplete =
    invoiceData?.status === "PAID" || invoiceData?.status === "SETTLED";

  if (invoiceData?.status === undefined) {
    status = "Loading";
  } else if (
    invoiceData?.status === "PAID" ||
    invoiceData.status === "SETTLED"
  ) {
    status = "Payment Completed";
  }

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Something Wrong Occured
      </div>
    );
  }

  return (
    <div className="bg-muted relative flex w-full flex-col gap-4 rounded-lg border-[1.5px] p-4 md:flex-row">
      <div className="bg-primary top-0 left-0 z-30 rounded-lg px-4 py-2 font-semibold text-white md:absolute md:rounded-tr-none md:rounded-bl-none">
        {data.course?.isWebinar ? "Webinar" : "Bootcamp"}
      </div>

      <div className="bg-primary relative aspect-[3/2] w-full flex-[2] shrink-0 overflow-hidden rounded-lg md:aspect-[3/2]">
        <Image
          fill
          src={
            data.course?.image ??
            "/images/default/thumbnail_career_guidance_default.png"
          }
          alt="Thumbnail Course"
          className="object-cover"
        />
      </div>
      <div className="flex flex-[3] shrink-0 flex-col gap-3">
        <div className="text-2xl font-semibold">{data.course?.title}</div>
        <div className="bg-primary w-fit rounded-lg px-2 py-1 text-sm font-semibold text-white">
          {data.course?.category?.name}
        </div>
        <div className="flex flex-col gap-1 font-medium">
          <div className="flex items-center gap-2">
            <IconBook2 className="size-6" />{" "}
            {data.course?.materi?.split(",").length} Sessions
          </div>
          <div className="flex items-center gap-2">
            <IconCalendarEvent className="size-6" />
            {data.course?.date?.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <IconLocationPin className="size-6" />
            {data.course?.place}
          </div>
          {data.status === "FREE" && data.course?.placeUrl ? (
            <Button
              onClick={() => router.push(data.course?.placeUrl ?? "")}
              className="mt-4"
            >
              Zoom meet Link
            </Button>
          ) : (
            ""
          )}
          {data.course?.isWebinar === false && paymentComplete ? (
            <Button
              onClick={() =>
                router.push(`/dashboard/user/my_course/${data.courseId}`)
              }
            >
              Start Learning
            </Button>
          ) : (
            <div></div>
          )}
        </div>
        <Separator />
        <div className="flex w-full items-center justify-between">
          <div className="font-medium">Status</div>
          {data?.status === "FREE" ? (
            <Badge>Free</Badge>
          ) : paymentComplete ? (
            <Badge>{status}</Badge>
          ) : invoiceData?.status === "EXPIRED" ? (
            <Badge variant={"destructive"}>Expired</Badge>
          ) : (
            <Link href={data?.invoiceUrl ?? ""}>
              <Button>Payout</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
