import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateOrder } from '@/app/redux/features/orders/ordersSlice';
import { RootState } from "@/app/redux/store";

export function DeleteItemForm({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.orders.loading_update);

  const handleDelete = async () => {
    try {
      const data = {
        orderItems: [
          {
            action: "delete",
            orderItemId: orderId,
          },
        ],
      };

      await dispatch(updateOrder({ orderId, data })).unwrap();
      toast.success("The order has been successfully updated.");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update the order. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the order
          item and remove it from our database.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" disabled={loading} onClick={handleDelete}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
