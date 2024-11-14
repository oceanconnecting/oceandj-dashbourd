"use client";

import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { AddTypeForm } from "@/components/form/add-type-form";
import { DeleteMultiTypesForm } from "@/components/form/delete-multi-types-form"; // Use the multi-delete form
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { PlusIcon } from "@radix-ui/react-icons";

interface DataTableToolbarProps<TData extends { id: string }> {
  table: Table<TData>;
  searchTerm: string; // Ensure searchTerm prop is typed
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure onChange prop is typed
}

export function DataTableToolbar<TData extends { id: string }>({ table, searchTerm, onChange }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isDialogOpenAdd, setIsDialogOpenAdd] = useState(false);
  const [isDialogOpenDeletes, setIsDialogOpenDeletes] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // To store selected IDs

  // Get rowSelection from table state
  const { rowSelection } = table.getState();
  const hasSelectedRows = Object.keys(rowSelection).length > 0; // Check if any rows are selected

  const handleOpenDialogAdd = () => setIsDialogOpenAdd(true);
  const handleCloseDialogAdd = () => setIsDialogOpenAdd(false);
  const handleOpenDialogDeletes = () => {
    // Get the selected rows' data and map to their actual IDs
    const selectedIdsArray = Object.keys(rowSelection)
      .map(key => table.getRowModel().rows[Number(key)].original.id); // Assuming each row has an 'id' field
    setSelectedIds(selectedIdsArray); // Save selected IDs
    setIsDialogOpenDeletes(true); // Open delete dialog
  };
  
  const handleDeleteSuccess = () => {
    setSelectedIds([]); // Clear selected IDs after deletion
    table.setRowSelection({}); // Reset the row selection in the table
  };

  const handleCloseDialogDeletes = () => setIsDialogOpenDeletes(false);

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
        {hasSelectedRows && (
          <>
            <Button variant="outline" size="sm" onClick={handleOpenDialogDeletes}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>

            {/* Dialog for deleting selected rows */}
            <Dialog open={isDialogOpenDeletes} onOpenChange={setIsDialogOpenDeletes}>
              <DeleteMultiTypesForm 
                typeIds={selectedIds} 
                onClose={handleCloseDialogDeletes} 
                onDeleteSuccess={handleDeleteSuccess} // Pass the callback
              />
            </Dialog>
          </>
        )}

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
