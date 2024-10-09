"use client"

import { useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { AddCategoryForm } from "@/components/form/add-category-form";
import { Dialog } from "@/components/ui/dialog"
import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
// import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isDialogOpenAdd, setIsDialogOpenAdd] = useState(false);

  const handleOpenDialogAdd = () => setIsDialogOpenAdd(true);
  const handleCloseDialogAdd = () => setIsDialogOpenAdd(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("image") && (
          <DataTableFacetedFilter
            column={table.getColumn("image")}
            title="Image"
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">

        <Button variant="outline" size="sm" onClick={handleOpenDialogAdd} >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
        <Dialog open={isDialogOpenAdd} onOpenChange={setIsDialogOpenAdd}>
          <AddCategoryForm onClose={handleCloseDialogAdd} />
        </Dialog>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}