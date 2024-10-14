"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addCategory, fetchCategoryTypes } from "@/app/redux/features/categories/categoriesSlice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCategoryForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state: RootState) => state.categories.loading_add);
  const error = useAppSelector((state: RootState) => state.categories.error_add);
  const types = useAppSelector((state: RootState) => state.categories.types);
  // const typesLoading = useAppSelector((state: RootState) => state.categories.loading_types);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [typeId, setTypeId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategoryTypes());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setImage("");
    setTypeId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || typeId === null) {
      console.error("Error: Title, image, and type are required.");
      return;
    }
    try {
      const action = await dispatch(addCategory({ title, image, typeId: Number(typeId) }));
      if (addCategory.fulfilled.match(action)) {
        toast({
          title: "Category added",
          description: "The Category has been successfully added.",
        });
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Failed to add the category. Please try again.",
        });
        console.error("Failed to add category");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create the category. Please try again.",
      });
      console.error("Error creating category:", err);
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogDescription>
          Fill out the form to add a new category to your store.
        </DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Category Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter Category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Category Image</Label>
          <Input
            id="image"
            type="text"
            placeholder="Enter category IMAGE link"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="type">Category Type</Label>
          <Select onValueChange={(value) => setTypeId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={typeId ? types.find(type => type.id === typeId)?.title : "Select a type"} />
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
