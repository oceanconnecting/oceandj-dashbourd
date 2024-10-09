import { useToast } from "@/hooks/use-toast";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { deleteCategory } from '@/app/redux/features/categories/categoriesSlice';
import { RootState } from "@/app/redux/store";

export function DeleteCategoryForm({
  categoryId,
  onClose,
}: {
  categoryId: number;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.categories.loading_delete);
  // const error = useAppSelector((state: RootState) => state.categories.error_delete);

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      toast({
        title: "Category deleted",
        description: "The Category has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete the category. Please try again.",
      });
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the Category
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
