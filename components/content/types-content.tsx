"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchTypes } from "@/app/redux/features/types/typesSlice";
import { RootState } from "@/app/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "@/components/types/columns";
import { DataTable } from "@/components/types/data-table";
import { FormError } from "@/components/form/form-error";
import { useRouter } from "next/navigation";

export function TypesContent() {
  const dispatch = useAppDispatch();
  const { types, loading, error } = useAppSelector((state: RootState) => state.types);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Update URL parameters based on the searchTerm
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
  
    // Change the URL using router.push
    router.push(`/dashboard/types?${params.toString()}`);
  
    // Extract search term from the URL and update local state
    const search = params.get("search") || "";
    setSearchTerm(search); // Update local state with the new search term
  
    // Dispatch fetchTypes with the updated search term
    dispatch(fetchTypes(search));
  }, [searchTerm, router, dispatch]);

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent>
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              {error ? (
                <div className="text-red-500 min-h-[calc(100vh-56px-56px-20px-24px-48px)] flex justify-center items-center">
                  <FormError message={error} />
                </div>
              ) : (
                <DataTable
                  loading={loading}
                  searchTerm={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data={types}
                  columns={columns}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
