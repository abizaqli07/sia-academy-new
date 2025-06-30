"use client";

import {
  NotebookPen
} from "lucide-react";
import { SidebarItem } from "./course_sidebar_item";
import { type RouterOutputs } from "~/trpc/react";


interface SidebarInterface {
  data: RouterOutputs["userRoute"]["course"]["getOneMyCourse"];
}

export const Sidebar = ({ data }: SidebarInterface) => {
  const chapters = data?.chapters

  if(chapters === undefined){
    return;
  }

  return (
    <div className="sticky h-fit w-full rounded-lg border-[1px] border-gray-300 p-4 shadow-lg">
      <div className="flex w-full flex-col space-y-2">
        {chapters.map((route) => (
          <SidebarItem
            key={route.courseId}
            icon={NotebookPen}
            label={route.title}
            href={`/dashboard/user/my_course/${data?.id}/${route.id}`}
          />
        ))}
      </div>
    </div>
  );
};
