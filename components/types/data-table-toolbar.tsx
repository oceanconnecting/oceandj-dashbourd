"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { AddTypeForm } from "@/components/form/add-type-form";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { PlusIcon } from "@radix-ui/react-icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string; // Ensure searchTerm prop is typed
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure onChange prop is typed
}

export function DataTableToolbar<TData>({ table, searchTerm, onChange }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isDialogOpenAdd, setIsDialogOpenAdd] = useState(false);

  const handleOpenDialogAdd = () => setIsDialogOpenAdd(true);
  const handleCloseDialogAdd = () => setIsDialogOpenAdd(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter types..."
          value={searchTerm}
          onChange={onChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
        <Button variant="outline" size="sm" onClick={handleOpenDialogAdd}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Type
        </Button>
        <Dialog open={isDialogOpenAdd} onOpenChange={setIsDialogOpenAdd}>
          <AddTypeForm onClose={handleCloseDialogAdd} />
        </Dialog>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
