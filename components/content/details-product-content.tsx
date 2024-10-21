"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            // <div className="grid gap-6 w-full">
            //   <Label htmlFor="id" className="text-lg font-bold">
            //     Product ID: <span className="text-gray-400">{currentProduct.id}</span>
            //   </Label>
            //   <h2 className="text-2xl font-semibold">{currentProduct.title}</h2>
            //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //     <div className="flex flex-col items-center">
            //       {currentProduct.images.map((image, index) => (
            //         <Image
            //           key={index}
            //           src={image}
            //           alt={`Product image ${index + 1}`}
            //           width={250}
            //           height={250}
            //           className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
            //         />
            //       ))}
            //     </div>
            //     <div className="flex flex-col justify-between">
            //       <p className="text-gray-600">{currentProduct.description}</p>
            //       <div className="flex justify-between items-center mt-4">
            //         <span className="text-lg font-semibold text-green-600">
            //           Price: ${currentProduct.price.toFixed(2)}
            //         </span>
            //         {currentProduct.discount > 0 && (
            //           <span className="text-sm text-red-500 line-through">
            //             ${(currentProduct.price * (1 + currentProduct.discount)).toFixed(2)}
            //           </span>
            //         )}
            //       </div>
            //       <div className="mt-2">
            //         <span className="text-sm text-gray-500">Stock: {currentProduct.stock}</span>
            //         <span className="text-sm text-gray-500 ml-4">Orders: {currentProduct.orderCount}</span>
            //       </div>
            //     </div>
            //   </div>
            //   {currentProduct.category && (
            //     <div className="flex flex-col items-center mt-4">
            //       <h3 className="text-lg font-semibold">Category: {currentProduct.category.title}</h3>
            //       <Image
            //         src={currentProduct.category.image}
            //         alt="Category"
            //         width={100}
            //         height={100}
            //         className="w-32 h-32 object-cover rounded-lg mt-2 shadow-md"
            //       />
            //     </div>
            //   )}
            // </div>
            <div className="w-full">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Product information</h3>
                <ul className="mt-4 space-y-2">
                    <li className="text-sm border py-2.5 px-4 rounded-lg">Title <span className="ml-4 float-right">{currentProduct.title}</span></li>
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
