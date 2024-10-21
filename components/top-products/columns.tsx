"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header";
import Image from "next/image"

interface Product {
  id: number;
  images: string[];
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  categoryId: number;
}

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "images",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const images = row.getValue("images") as string[];
      return (
        <div className="flex space-x-2">
          {images.length > 0 && (
            <Image
              width={100}
              height={100}
              src={images[0]}
              alt={row.getValue("title")}
              className="w-14 h-14 truncate font-medium"
            />
          )}
        </div>
      )
    },
    enableSorting: false,
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
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("price")}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("discount")}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("stock")}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("categoryId")}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
]
