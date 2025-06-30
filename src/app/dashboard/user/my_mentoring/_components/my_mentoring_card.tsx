"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api, type RouterOutputs } from "~/trpc/react";
import RequestButton from "./request_button";

interface MyMentoringCardPropsInterface {
  data: RouterOutputs["userRoute"]["mentoring"]["getAllMyMentoring"][number];
}

const MyMentoringCard = ({ data }: MyMentoringCardPropsInterface) => {
  const {
    data: recentSession,
    isLoading,
    isError,
  } = api.userRoute.mentoring.getRecentSession.useQuery({
    mentoringDataId: data.mentoringId ?? "",
  });

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    isError: invoiceError,
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
    invoiceData?.status === "SETTLED"
  ) {
    status = "Payment Completed";
  }

  if (isLoading || invoiceLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (isError || invoiceError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Something Wrong Occured
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md sm:h-[250px] sm:flex-row dark:border-gray-800 dark:bg-gray-900">
      {/* Image section */}
      <div className="relative h-52 w-full bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 sm:h-full sm:w-2/5 dark:from-gray-900 dark:via-purple-950/10 dark:to-gray-900">
        {/* New badge */}

        <div className="absolute top-3 left-3 z-10">
          <div className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Mentoring
          </div>
        </div>

        {/* Background glow effect */}
        <div className="absolute inset-0">
          <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-purple-500/20 blur-2xl"></div>
        </div>

        {/* Image with hover effect */}
        <div className="flex h-full items-center justify-center">
          <div className="h-full w-full transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
            <div className="relative mx-auto h-full w-full rounded-lg drop-shadow-lg">
              <Image
                src={
                  data.mentoring?.mentoring.mentor.image ??
                  "/images/placeholder_service.webp"
                }
                alt="Image Placeholder"
                fill
                className="inset-0 z-20 object-cover"
              />
              <div className="dark:bg-background/80 absolute top-0 right-0 bottom-0 left-0 z-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Product name and description */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {data.mentoring?.mentoring?.mentor.name}
              </h3>
              <div className="text-sm font-semibold">
                {data.mentoring?.mentoring?.mentor.title}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.mentoring?.mentoring?.mentor.expertise
                .split(",")
                .map((expert, index) => (
                  <div
                    key={index}
                    className="bg-primary w-fit rounded-lg px-2 py-1 text-sm font-semibold text-white"
                  >
                    {expert}
                  </div>
                ))}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-200">
              {data.mentoring?.mentoring?.mentor.desc}
            </p>
          </div>
        </div>

        {/* Bottom section with availability and buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-x-2">
            {data?.status === "FREE" ? (
              <Badge className="bg-primary mr-1 inline-block rounded-full">
                Free
              </Badge>
            ) : paymentComplete ? (
              <Badge className="bg-primary mr-1 inline-block rounded-full">
                {status}
              </Badge>
            ) : invoiceData?.status === "EXPIRED" ? (
              <Badge variant={"destructive"}>Expired</Badge>
            ) : (
              <Link href={data?.invoiceUrl ?? ""}>
                <Button>Payout</Button>
              </Link>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {paymentComplete || data.status === "FREE" ? (
              <RequestButton
                mentoringDataId={data.mentoringId ?? ""}
                schedules={recentSession}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMentoringCard;
