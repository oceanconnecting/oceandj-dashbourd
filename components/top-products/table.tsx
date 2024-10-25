/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { columns } from "@/components/top-products/columns";
import { DataTable } from "@/components/top-products/data-table";

export const Table: React.FC<{ topProducts: any[], loading: boolean }> = ({ topProducts, loading }) => {

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              <DataTable
                loading={loading}
                data={topProducts}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
