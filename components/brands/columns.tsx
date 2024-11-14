"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import CellActions from "@/components/brands/cell-actions";
import Image from "next/image";

interface Brand {
  id: string;
  image: string;
  title: string;
  productCount: number;
}

export const columns: ColumnDef<Brand>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="ID"/>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-[40px]">{row.getValue<string>("id")}</div>
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
    accessorKey: "productCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Count" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[600px] truncate font-medium">
          {row.getValue<number>("productCount")}
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