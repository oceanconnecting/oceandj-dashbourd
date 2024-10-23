"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
                  <div className="w-full inline-flex justify-between">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Order information</h3>
                    <Button variant="destructive">Back</Button>
                  </div>
                  <ul className="mt-12 space-y-4">
                    <li className="">Id <span className="ml-4 float-right">{currentOrder.id}</span></li>
                    < hr/>
                    <li className="">Reference <span className="ml-4 float-right">{currentOrder.reference}</span></li>
                    < hr/>
                    <li className="">Full Name <span className="ml-4 float-right">{currentOrder.name}</span></li>
                    < hr/>
                    <li className="">Email <span className="ml-4 float-right">{currentOrder.email}</span></li>
                    < hr/>
                    <li className="">Phone <span className="ml-4 float-right">{currentOrder.phone}</span></li>
                    < hr/>
                    <li className="">Address <span className="ml-4 float-right">{currentOrder.address}</span></li>
                    < hr/>
                    <li className="flex items-top justify-between">
                      <span>Products</span>
                      <div className="space-y-5">
                        {currentOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-10">
                            <span className="">Id: {item.id}</span>
                            <span className="">Title: {item.title}</span>
                            <span className="">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </li>
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
