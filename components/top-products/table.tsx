"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "@/components/top-products/columns";
import { DataTable } from "@/components/top-products/data-table";
import { FormError } from "@/components/form/form-error";
import { useEffect } from "react";
import { fetchTopProducts } from "@/app/redux/features/products/productsSlice";

export const Table = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state: RootState) => state.products);
  console.log(products)
  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              {error ? (
                <div className="text-red-500  flex justify-center items-center">
                  <FormError message={error} />
                </div>
              ) : (
                <DataTable
                  loading={loading}
                  data={products}
                  columns={columns}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
