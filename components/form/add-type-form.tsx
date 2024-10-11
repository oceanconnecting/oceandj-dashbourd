"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addType } from "@/app/redux/features/types/typesSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { RootState } from "@/app/redux/store";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";


export function AddTypeForm({ onClose } : { onClose: () => void }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.types.loading_add);
  const error = useAppSelector((state: RootState) => state.types.error_add);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const resetForm = () => {
    setTitle("");
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      console.error("Error: Title and image are required.");
      return;
    }
    try {
      const action = await dispatch(addType({ title, image }));
      if (addType.fulfilled.match(action)) {
        toast({
          title: "Type updated",
          description: "The type has been successfully updated.",
        });
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Failed to add the type. Please try again.",
        });
        console.error("Failed to add type");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to creating the type. Please try again.",
      });
      console.error("Error creating type:", err);
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Type</DialogTitle>
        <DialogDescription>
          Fill out the form to add a new type to your store.
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
            disabled={loading} // Disable input when loading
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Type Image</Label>
          <Input
            id="image"
            type="text"
            placeholder="Enter type IMAGE link"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
        </div>

        {error && <FormError message={error} />}

      </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
    </DialogContent>
  );
}
