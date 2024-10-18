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
                <div className="grid gap-6 mt-6 mb-4">
                  <Label htmlFor="id">Order ID: <span className="text-gray-400">{currentOrder.id}</span></Label>
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
