"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import CellActions from "@/components/types/cell-actions";
import Image from "next/image";

interface Type {
  id: string;
  image: string;
  title: string;
  categoryCount: number;
}

export const columns: ColumnDef<Type>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="ID" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-[40px]">{row.getValue<number>("id")}</div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Image
          width={100}
          height={100}
          src={row.getValue<string>("image")}
          alt={row.getValue<string>("title")}
          className="w-14 h-14 truncate font-medium"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[600px] truncate font-medium">
          {row.getValue<string>("title")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "categoryCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Count" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[600px] truncate font-medium">
          {row.getValue<number>("categoryCount")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions row={row} />,
  },
];