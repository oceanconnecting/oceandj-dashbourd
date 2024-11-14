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
import { deleteProduct } from '@/app/redux/features/products/productsSlice';
import { RootState } from "@/app/redux/store";

export function DeleteProductForm({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.products.loading_delete);
  // const error = useAppSelector((state: RootState) => state.products.error_delete);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success("The Product has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the product
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
