"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { cn, currencyFormatter } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { type category as CategoryCourse } from "~/server/db/schema";

export const columns: ColumnDef<
  RouterOutputs["adminRoute"]["course"]["getAll"][number]
>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      type categoryType = typeof CategoryCourse.$inferSelect;
      const category: categoryType = row.getValue("category");

      return <div>{category?.name ?? "Category"}</div>;
    },
  },
  {
    accessorKey: "isHidden",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Publicity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isHidden = row.original.isHidden;

      return (
        <Badge className={cn("bg-primary", isHidden && "bg-slate-500")}>
          {isHidden ? "Draft" : "Published"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isWebinar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isWebinar = row.original.isWebinar;

      return (
        <Badge className={cn("bg-secondary", isWebinar && "bg-primary")}>
          {isWebinar ? "Webinar" : "Bootcamp"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedPrice = currencyFormatter.format(
        Number(row.getValue("price")),
      );

      return <div>{formattedPrice}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/dashboard/admin/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
