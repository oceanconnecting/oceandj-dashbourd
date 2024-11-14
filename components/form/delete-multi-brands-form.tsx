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
import { deleteMultiBrands } from '@/app/redux/features/brands/brandsSlice';  // Action to delete multiple brands
import { RootState } from "@/app/redux/store";
export function DeleteMultiBrandsForm({
  brandIds,
  onClose,
  onDeleteSuccess, // New prop
}: {
  brandIds: string[];
  onClose: () => void;
  onDeleteSuccess: () => void; // Callback for successful deletion
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.brands.loading_delete);
  
  const handleDelete = async () => {
    try {
      await dispatch(deleteMultiBrands(brandIds)).unwrap();
      toast.success(`${brandIds.length} brands have been successfully deleted.`);
      onDeleteSuccess(); // Call the callback here
    } catch (error) {
      console.error("Error deleting brands:", error);
      toast.error("Failed to delete the selected brands. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your {brandIds.length} tasks from our servers.
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
