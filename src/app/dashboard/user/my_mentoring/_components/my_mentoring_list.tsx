"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import MyMentoringCard from "./my_mentoring_card";

const MyMentoringList = () => {
  const [data] = api.userRoute.mentoring.getAllMyMentoring.useSuspenseQuery();

  return (
    <div className="w-full space-y-8">
      <div className="w-full">
        {data.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {data.map((value) => (
              <MyMentoringCard key={value.id} data={value} />
            ))}
          </div>
        ) : (
          <div className="bg-muted dark:bg-primary-dark flex h-[200px] flex-col items-center justify-center gap-y-3 rounded-lg px-24 py-4 text-center">
            <div className="text-2xl font-semibold">Belum Ada Mentoring</div>
            <Link href={"/dashboard/user/mentoring"}>
              <Button>Temukan Mentoring</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMentoringList;
