import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { deleteOrder } from '@/app/redux/features/orders/ordersSlice';
import { RootState } from "@/app/redux/store";

export function DeleteOrderForm({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.orders.loading_delete);
  // const error = useAppSelector((state: RootState) => state.orders.error_delete);

  const handleDelete = async () => {
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success("The Order has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting Order:", error);
      toast.error("Failed to delete the Order. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the Order
          and remove it from our database.
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
