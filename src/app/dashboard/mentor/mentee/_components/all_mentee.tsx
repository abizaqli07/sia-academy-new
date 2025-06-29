"use client";

import { api } from "~/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const AllMentee = () => {
  const [mentees] = api.mentorRoute.mentee.getAll.useSuspenseQuery();

  return (
    <div className="px-4 lg:px-6">
      <DataTable columns={columns} data={mentees} />
    </div>
  );
};

export default AllMentee;
