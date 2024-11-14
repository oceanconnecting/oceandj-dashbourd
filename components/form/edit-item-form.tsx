"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateOrder } from "@/app/redux/features/orders/ordersSlice"; 
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { toast } from "sonner";
import { FormError } from "@/components/form/form-error";

export function EditOrderForm({ orderId, currentTitle, onClose }: { orderId: string, currentTitle: string, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTitle || "");

  const loading = useAppSelector((state: RootState) => state.orders.loading_update);
  const error = useAppSelector((state: RootState) => state.orders.error_update);

  const resetForm = () => {
    setTitle(currentTitle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const resultAction = await dispatch(updateOrder({
        orderId,
        data: undefined
      }));

      if (updateOrder.fulfilled.match(resultAction)) {
        toast.success("The order has been successfully updated.");
        resetForm();
      } else {
        toast.error("Failed to update the order. Please try again.");
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update the order. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit order</DialogTitle>
        <DialogDescription>Update the details of the order.</DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">order Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <FormError message={error} />}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
