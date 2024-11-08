/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { columns } from "@/components/items/columns";
import { DataTable } from "@/components/items/data-table";

export const Table: React.FC<{ orderItems: any[], loading: boolean }> = ({ orderItems, loading }) => {
  return (
    <DataTable
      loading={loading}
      data={orderItems}
      columns={columns}
    />
  );
};