"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProductDetails } from "@/app/redux/features/products/productsSlice";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

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
    <Card className="rounded-lg border-none mt-6 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          {loading ? (
            <p className="text-lg font-semibold">Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : currentProduct ? (
            <div className="w-full">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Product information</h3>
              <ul className="mt-8 space-y-4">
                <li className="">Id <span className="ml-4 float-right">{currentProduct.id}</span></li>
                <li className="">Title <span className="ml-4 float-right">{currentProduct.title}</span></li>
                <li className="">Description <span className="ml-4 float-right">{currentProduct.description}</span></li>
                <li className="">Price <span className="ml-4 float-right">{currentProduct.price}</span></li>
                <li className="">Discount <span className="ml-4 float-right">{currentProduct.discount}</span></li>
                <li className="">Stock <span className="ml-4 float-right">{currentProduct.stock}</span></li>
                <li className="">Category <span className="ml-4 float-right">{currentProduct.category.title}</span></li>
                <li className="mt-6 flex items-center gap-4">
                  {currentProduct.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={250}
                      height={250}
                      className="w-1/6 object-cover rounded-lg shadow-md mb-4"
                    />
                  ))}
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-lg">No Product selected</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
