"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Task } from "@/data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
// import { DataTableRowActions } from "./data-table-row-actions"
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ViewCategoryForm } from "@/components/form/view-category-form"
import { EditCategoryForm } from "@/components/form/edit-category-form"
import { DeleteCategoryForm } from "@/components/form/delete-category-form"

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
        {/* Use layout='responsive' for better responsiveness
          <Image 
            src={row.getValue("image")} 
            alt={row.getValue("title")} // Adding alt text for accessibility
            className="w-16 h-8 object-cover" // object-cover for proper image aspect ratio
            width={64} // Specify width
            height={32} // Specify height
          /> */}
          <span className="max-w-[600px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <Button>View</Button>
  //         <Button>Edit</Button>
  //         <Button>Delete</Button>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">

          <Dialog>
            <DialogTrigger>
              <Button variant="view">
                View
              </Button>
            </DialogTrigger>
            <ViewCategoryForm categoryId={row.getValue("id")} />
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <Button variant="edit">
                Edit
              </Button>
            </DialogTrigger>
            <EditCategoryForm categoryId={row.getValue("id")} currentTitle={row.getValue("title")} currentImage={row.getValue("image")} onUpdateSuccess={() => {
              
            }} />
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <DeleteCategoryForm categoryId={row.getValue("id")} onDeleteSuccess={() => {
              
            }} />
          </AlertDialog>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]