"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateType } from "@/app/redux/features/types/typesSlice"; // Adjust the import based on your project structure
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { useToast } from "@/hooks/use-toast";
import { FormError } from "@/components/form/form-error";

export function EditTypeForm({ typeId, currentTitle, currentImage, onClose } : { typeId: number, currentTitle: string, currentImage: string, onClose: () => void } ) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTitle || "");
  const [image, setImage] = useState(currentImage || "");
  const loading = useAppSelector((state: RootState) => state.types.loading_update);
  const error = useAppSelector((state: RootState) => state.types.error_update);
  const types = useAppSelector((state: RootState) => state.categories.types);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      console.error("Error: Title and image are required.");
      return;
    }
    try {
      const resultAction = await dispatch(updateType({ typeId, title, image }));
      if (updateType.fulfilled.match(resultAction)) {
        toast({
          title: "Type added",
          description: "The type has been successfully added.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update the type. Please try again.",
        });
        console.log("Failed to update type");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the type. Please try again.",
      });
      console.error("Error updating type:", error);
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit type</DialogTitle>
        <DialogDescription>
          Fill out the form to update the type details.
        </DialogDescription>
      </DialogHeader>
      
      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Type Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter type title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Type Image (URL)</Label>
          <Input
            id="image"
            type="text"
            placeholder="Enter type image link"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        {error && <FormError message={error} />}

      </form>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
