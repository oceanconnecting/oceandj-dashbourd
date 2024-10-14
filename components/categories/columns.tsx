"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
// import { Checkbox } from "@/components/ui/checkbox";
import CellActions from '@/components/categories/cell-actions';
import Image from "next/image"

interface Category {
  id: number;
  image: string;
  title: string;
  productCount: number;
  typeId: number;
}

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="ml-2 translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="ml-2 translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Image width={100} height={100} src={row.getValue("image")} alt={row.getValue("title")} className="w-14 h-14 truncate font-medium" />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "typeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="typeId" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("typeId")}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "productCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="productCount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("productCount")}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions row={row} />
  } 
]