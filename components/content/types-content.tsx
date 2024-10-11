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
  const { types, loading, error, total, totalPages } = useAppSelector((state: RootState) => state.types);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Items per page
  // const [sortKey, setSortKey] = useState(""); // Column to sort by
  // const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Reset to page 1 when searchTerm changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();

    // Update URL parameters based on the searchTerm
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    
    // Update URL parameters based on the page
    if (page > 1) {
      params.set("page", String(page));
    }
    
    // Update URL parameters based on the limit
    if(limit > 10) {
      params.set("limit", String(limit)); // Always add limit
    }
    
    // params.set("sort", sortKey ? `${sortKey}:${sortOrder}` : ""); // Set sorting if defined

    // Change the URL using router.push
    router.push(`/dashboard/types?${params.toString()}`);

    // Dispatch fetchTypes with the updated search term and pagination
    dispatch(fetchTypes({ searchTerm, page, limit }));
  }, [searchTerm, page, limit, router, dispatch]);

  // Pagination control handlers
  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages)); // Prevent going beyond total pages
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1)); // Prevent going to page 0
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page when limit changes
  };

  // const handleSortChange = (key: string) => {
  //   // Toggle sort order between 'asc' and 'desc'
  //   setSortKey(key);
  //   setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  //   setPage(1); // Reset to first page on sort change
  // };

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
                  total={total}
                  totalPages={totalPages}
                  page={page}
                  limit={limit}
                  handlePreviousPage={handlePreviousPage}
                  handleNextPage={handleNextPage}
                  handleLimitChange={handleLimitChange} // Pass the limit change handler
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
