"use client";

import React, { useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination"; 
import { DataTableToolbar } from "./data-table-toolbar";
import { Spinner } from "@/components/ui/spinner";

interface DataTableProps<TData, TValue> {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  columns: ColumnDef<TData, TValue>[]; 
  data: TData[]; // The current page data
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleLimitChange: (limit: number) => void; // Add handleLimitChange prop
}

export function DataTable<TData, TValue>({
  searchTerm,
  onChange,
  columns,
  data,
  loading,
  page,
  limit,
  total,
  totalPages,
  handlePreviousPage,
  handleNextPage,
  handleLimitChange, // Include in props
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Table instance setup
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize: limit }, // Adjust pageIndex for 0-based index
    },
    manualPagination: true, // Enable manual pagination
    pageCount: totalPages, // Set the total number of pages manually
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Sync the table's pagination state with external props (page and limit)
  useEffect(() => {
    table.setPageIndex(page - 1); // Set the correct page index (0-based)
    table.setPageSize(limit); // Set the page size
  }, [page, limit, table]);

  return (
    <div className="space-y-4 pt-6">
      <DataTableToolbar searchTerm={searchTerm} onChange={onChange} table={table} />
      <div className="rounded-lg border">
        {loading ? (
          <div className="w-full min-h-[calc(100vh-56px-56px-20px-24px-48px)] flex items-center justify-center">
            <Spinner className="text-primary" size="lg" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <DataTablePagination 
        table={table} 
        total={total}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleLimitChange={handleLimitChange} // Pass the handleLimitChange to the pagination
      />
    </div>
  );
}
