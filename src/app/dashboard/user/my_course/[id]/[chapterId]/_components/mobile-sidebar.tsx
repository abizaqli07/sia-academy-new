"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./course_sidebar";
import { type RouterOutputs } from "~/trpc/react";

interface MobileSidebarInterface {
  data: RouterOutputs["userRoute"]["course"]["getOneMyCourse"];
}

export const MobileSidebar = ({ data }: MobileSidebarInterface) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-end rounded-md border-[1.5px] border-gray-300 px-4 py-3 text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600">
            <Menu />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Sidebar data={data} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
