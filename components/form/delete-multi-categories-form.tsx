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
import { deleteMultiCategories } from '@/app/redux/features/categories/categoriesSlice';  // Action to delete multiple categories
import { RootState } from "@/app/redux/store";
export function DeleteMultiCategoriesForm({
  categoryIds,
  onClose,
  onDeleteSuccess, // New prop
}: {
  categoryIds: string[];
  onClose: () => void;
  onDeleteSuccess: () => void; // Callback for successful deletion
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.categories.loading_delete);
  
  const handleDelete = async () => {
    try {
      await dispatch(deleteMultiCategories(categoryIds)).unwrap();
      toast.success(`${categoryIds.length} categories have been successfully deleted.`);
      onDeleteSuccess(); // Call the callback here
    } catch (error) {
      console.error("Error deleting categories:", error);
      toast.error("Failed to delete the selected categories. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your {categoryIds.length} tasks from our servers.
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
