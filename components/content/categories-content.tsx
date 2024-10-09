"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCategories } from "@/app/redux/features/categories/categoriesSlice";
import { RootState } from "@/app/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "@/components/categories/columns";
import { DataTable } from "@/components/categories/data-table";
import { Spinner } from "@/components/ui/spinner";
import { FormError } from "@/components/form/form-error";

export function CategoriesContent() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              {loading ? (
                <div className="w-full min-h-[calc(100vh-56px-56px-20px-24px-48px)] flex items-center justify-center">
                  <Spinner className="text-primary" size="lg" />
                </div>
              ) : error ? (
                <div className="text-red-500 min-h-[calc(100vh-56px-56px-20px-24px-48px)] flex justify-center items-center">
                  <FormError message={error} />
                </div>
              ) : (
                <DataTable data={categories} columns={columns} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
