"use client"

import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AllMentor = () => {
  const [mentors] = api.adminRoute.mentor.getAll.useSuspenseQuery();

  return (
    <ScrollArea className="h-full w-full">
      <div className="px-4 lg:px-6">
        <DataTable columns={columns} data={mentors} />
      </div>
    </ScrollArea>
  );
};

export default AllMentor;
