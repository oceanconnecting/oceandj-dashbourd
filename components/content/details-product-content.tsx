"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProductDetails } from "@/app/redux/features/products/productsSlice";
import { RootState } from "@/app/redux/store";


interface ViewProductFormProps {
  productId: number;
}

export function ProductDetailsContent({ productId }: ViewProductFormProps) {
  const dispatch = useAppDispatch();
  
  const { currentProduct, loading, error } = useAppSelector((state: RootState) => ({
    currentProduct: state.products.currentProduct,
    loading: state.products.loading_details,
    error: state.products.error_details,
  }));

  console.log(currentProduct)

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : currentProduct ? (
                <div className="grid gap-6 mt-6 mb-4">
                  <Label htmlFor="id">Product ID: <span className="text-gray-400">{currentProduct.id}</span></Label>
                </div>
              ) : (
                <p>No Product selected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
