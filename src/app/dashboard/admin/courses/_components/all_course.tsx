"use client";

import { api } from "~/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const AllCourse = () => {
  const [data] = api.adminRoute.course.getAll.useSuspenseQuery();

  return (
    <div className="px-4 lg:px-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AllCourse;
