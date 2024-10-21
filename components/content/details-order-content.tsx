"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchOrderDetails } from "@/app/redux/features/orders/ordersSlice";
import { RootState } from "@/app/redux/store";


interface ViewOrderFormProps {
  orderId: number;
}

export function OrderDetailsContent({ orderId }: ViewOrderFormProps) {
  const dispatch = useAppDispatch();
  
  const { currentOrder, loading, error } = useAppSelector((state: RootState) => ({
    currentOrder: state.orders.currentOrder,
    loading: state.orders.loading_details,
    error: state.orders.error_details,
  }));

  console.log(currentOrder)

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

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
              ) : currentOrder ? (
                <div className="w-full">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Order information</h3>
                    <ul className="mt-4 space-y-2">
                        <li className="text-sm border py-2.5 px-4 rounded-lg">Name <span className="ml-4 float-right">{currentOrder.name}</span></li>
                        <li className="text-sm border py-2.5 px-4 rounded-lg">Reference <span className="ml-4 float-right">{currentOrder.reference}</span></li>
                    </ul>
                </div>
              ) : (
                <p>No Order selected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
