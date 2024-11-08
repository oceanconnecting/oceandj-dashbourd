/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchOrderDetails, updateOrder } from '@/app/redux/features/orders/ordersSlice';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';

interface ViewOrderFormProps {
  orderId: number;
}

export function UpdateOrderContent({ orderId }: ViewOrderFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentOrder, loading_details, error_details, loading_update, error_update } = useAppSelector((state: RootState) => ({
    currentOrder: state.orders.currentOrder,
    loading_details: state.orders.loading_details,
    error_details: state.orders.error_details,
    loading_update: state.orders.loading_update,
    error_update: state.orders.error_update,
  }));

  const [status, setStatus] = useState<string>(currentOrder?.status || "");
  const [orderItems, setOrderItems] = useState<any[]>(currentOrder?.items || []);
  
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);

    // Update action for order items if needed
    const updatedItems = orderItems.map(item => ({
      ...item,
      action: item.action || 'update', // Default to 'update' or use logic to set 'add'/'delete'
    }));
    setOrderItems(updatedItems); // Update orderItems state
  };

  const handleSubmit = () => {
    if (currentOrder?.id) {
      // Ensure each item in orderItems has an action property
      const updatedItems = orderItems.map(item => ({
        ...item,
        action: item.action || 'update', // Set action based on item logic
      }));

      dispatch(updateOrder({ orderId: currentOrder.id, data: { status, orderItems: updatedItems } }))
        .then(() => {
          // Directly update current order's status without page refresh
          if (currentOrder) {
            currentOrder.status = status;
          }
          router.push('/orders'); // Navigate back to orders page
        })
        .catch((error) => {
          console.error('Error updating order:', error);
        });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              {loading_details ? (
                <p>Loading...</p>
              ) : error_details ? (
                <p>Error: {error_details}</p>
              ) : currentOrder ? (
                <div className="w-full">
                  <div className="w-full inline-flex justify-between">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Order information</h3>
                    <Button onClick={handleBack} variant="destructive">Back</Button>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg">Update Order Status</h3>
                    <Select value={status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Waiting">Waiting</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={handleSubmit}
                      variant="edit"
                      disabled={loading_update} // Disable button while loading
                    >
                      {loading_update ? 'Updating...' : 'Submit'}
                    </Button>
                    {error_update && <p className="text-red-500 mt-2">{error_update}</p>}
                  </div>
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
