"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link"

interface DataTableToolbarProps<TData extends { id: number }> {
  table: Table<TData>;
  searchTerm: string; // Ensure searchTerm prop is Category
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure onChange prop is Category
}

export function DataTableToolbar<TData extends { id: number }>({ table, searchTerm, onChange }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Categories..."
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
        <Button variant="outline" size="sm">
          <Link href="/order/add-order" className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Order
          </Link>
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
