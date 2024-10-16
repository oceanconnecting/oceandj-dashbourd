"use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
// import { fetchProducts } from "@/app/redux/features/products/productsSlice";
// import { RootState } from "@/app/redux/store";
import { Card, CardContent } from "@/components/ui/card";
// import { columns } from "@/components/products/columns";
// import { DataTable } from "@/components/products/data-table";
// import { FormError } from "@/components/form/form-error";
// import { useRouter } from "next/navigation";

export const OrdersContent = () => {
  // const dispatch = useAppDispatch();
  // const { products, loading, error, total, totalPages } = useAppSelector((state: RootState) => state.products);
  // const router = useRouter();

  // const [searchTerm, setSearchTerm] = useState("");
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);

  // useEffect(() => {
  //   setPage(1);
  // }, [searchTerm]);

  // useEffect(() => {
  //   const params = new URLSearchParams();

  //   if (searchTerm) {
  //     params.set("search", searchTerm);
  //   }
    
  //   if (page > 1) {
  //     params.set("page", String(page));
  //   }
    
  //   if(limit > 10) {
  //     params.set("limit", String(limit));
  //   }
    
  //   router.push(`/dashboard/products?${params.toString()}`);

  //   dispatch(fetchProducts({ searchTerm, page, limit }));
  // }, [searchTerm, page, limit, router, dispatch]);

  // const handleNextPage = () => {
  //   setPage((prev) => Math.min(prev + 1, totalPages));
  // };

  // const handlePreviousPage = () => {
  //   setPage((prev) => Math.max(prev - 1, 1));
  // };

  // const handleLimitChange = (newLimit: number) => {
  //   setLimit(newLimit);
  //   setPage(1); 
  // };

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              {/* {error ? (
                <div className="text-red-500 min-h-[calc(100vh-56px-56px-20px-24px-48px)] flex justify-center items-center">
                  <FormError message={error} />
                </div>
              ) : (
                <DataTable
                  loading={loading}
                  searchTerm={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data={products}
                  columns={columns}
                  total={total}
                  totalPages={totalPages}
                  page={page}
                  limit={limit}
                  handlePreviousPage={handlePreviousPage}
                  handleNextPage={handleNextPage}
                  handleLimitChange={handleLimitChange}
                />
              )} */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}