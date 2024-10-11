"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateCategory, fetchCategoryTypes } from "@/app/redux/features/categories/categoriesSlice"; // Adjust the import based on your project structure
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { useToast } from "@/hooks/use-toast";
import { FormError } from "@/components/form/form-error";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function EditCategoryForm({
  categoryId,
  currentTitle,
  currentImage,
  currentTypeId,
  onClose,
}: {
  categoryId: number;
  currentTitle: string;
  currentImage: string;
  currentTypeId: number;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTitle || "");
  const [image, setImage] = useState(currentImage || "");
  const [typeId, setTypeId] = useState<number | null>(currentTypeId || null);
  const loading = useAppSelector((state: RootState) => state.categories.loading_update);
  const error = useAppSelector((state: RootState) => state.categories.error_update);
  const types = useAppSelector((state: RootState) => state.categories.types); // Assuming types are fetched into the Redux store

  useEffect(() => {
    dispatch(fetchCategoryTypes());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || !typeId) {
      console.error("Error: Title, image, and type are required.");
      return;
    }
    try {
      const resultAction = await dispatch(updateCategory({ categoryId, title, image, typeId }));
      if (updateCategory.fulfilled.match(resultAction)) {
        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to update the category. Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the category. Please try again.",
      });
      console.error("Error updating Category:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>Fill out the form to update the category details.</DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Category Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Category Image (URL)</Label>
          <Input
            id="image"
            type="text"
            placeholder="Enter category image link"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="type">Category Type</Label>
          <Select onValueChange={(value) => setTypeId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={typeId ? types.find((type) => type.id === typeId)?.title : "Select a type"}
              />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
