"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TypeSchema } from "@/schemas/type"
import { useState } from "react"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Dialog } from "@/components/ui/dialog";
import { ViewTypeForm } from "@/components/form/view-type-form"
import { EditTypeForm } from "@/components/form/edit-type-form"
import { DeleteTypeForm } from "@/components/form/delete-type-form"
import { TrashIcon, InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons"

export const columns: ColumnDef<TypeSchema>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <img src={row.getValue("image")} alt={row.getValue("title")} className="w-14 h-14 truncate font-medium" />
        </div>
      )
    },
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
  },
  {
    accessorKey: "categoryCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="categoryCount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("categoryCount")}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDialogOpenView, setIsDialogOpenView] = useState(false);
      const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
      const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);
  
      const handleOpenDialogView = () => setIsDialogOpenView(true);
      const handleCloseDialogView = () => setIsDialogOpenView(false);
  
      const handleOpenDialogEdit = () => setIsDialogOpenEdit(true);
      const handleCloseDialogEdit = () => setIsDialogOpenEdit(false);
  
      const handleOpenDialogDelete = () => setIsDialogOpenDelete(true);
      const handleCloseDialogDelete = () => setIsDialogOpenDelete(false);
  
      return (
        <div className="flex space-x-2">
          {/* View Button */}
          <button className="p-1.5" onClick={handleOpenDialogView}>
            <InfoCircledIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-700" />
          </button>
          {isDialogOpenView && <Dialog open={isDialogOpenView} onOpenChange={setIsDialogOpenView}>
            <ViewTypeForm 
              typeId={row.getValue("id")} 
              onClose={handleCloseDialogView}
            />
          </Dialog>}
  
          {/* Edit Button */}
          <button className="p-1.5" onClick={handleOpenDialogEdit}>
            <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
          </button>
          <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
            <EditTypeForm
              typeId={row.getValue("id")}
              currentTitle={row.getValue("title")}
              currentImage={row.getValue("image")}
              onClose={handleCloseDialogEdit}
            />
          </Dialog>
  
          {/* Delete Button */}
          <button className="p-1.5" onClick={handleOpenDialogDelete}>
            <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-700" />
          </button>
          <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
            <DeleteTypeForm
              typeId={row.getValue("id")}
              onClose={handleCloseDialogDelete}
            />
          </Dialog>
        </div>
      );
    }
  }  
]