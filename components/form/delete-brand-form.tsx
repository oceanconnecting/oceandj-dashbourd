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
import { deleteBrand } from '@/app/redux/features/brands/brandsSlice';
import { RootState } from "@/app/redux/store";

export function DeleteBrandForm({
  brandId,
  onClose,
}: {
  brandId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.brands.loading_delete);
  // const error = useAppSelector((state: RootState) => state.brands.error_delete);

  const handleDelete = async () => {
    try {
      await dispatch(deleteBrand(brandId)).unwrap();
      toast.success("The brand has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete the brand. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the brand
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
