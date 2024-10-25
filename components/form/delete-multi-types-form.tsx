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
import { deleteMultiTypes } from '@/app/redux/features/types/typesSlice';  // Action to delete multiple types
import { RootState } from "@/app/redux/store";
export function DeleteMultiTypesForm({
  typeIds,
  onClose,
  onDeleteSuccess, // New prop
}: {
  typeIds: number[];
  onClose: () => void;
  onDeleteSuccess: () => void; // Callback for successful deletion
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.types.loading_delete);
  
  const handleDelete = async () => {
    try {
      await dispatch(deleteMultiTypes(typeIds)).unwrap();
      toast.success(`${typeIds.length} types have been successfully deleted.`);
      onDeleteSuccess(); // Call the callback here
    } catch (error) {
      console.error("Error deleting types:", error);
      toast.error("Failed to delete the selected types. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your {typeIds.length} tasks from our servers.
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
