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
import { deleteType } from '@/app/redux/features/types/typesSlice';
import { RootState } from "@/app/redux/store";

export function DeleteTypeForm({
  typeId,
  onClose,
}: {
  typeId: number;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.types.loading_delete);
  // const error = useAppSelector((state: RootState) => state.types.error_delete);

  const handleDelete = async () => {
    try {
      await dispatch(deleteType(typeId)).unwrap();
      toast.success("The type has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete the type. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the type
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
