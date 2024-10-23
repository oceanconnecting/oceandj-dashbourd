"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCategoryDetails } from "@/app/redux/features/categories/categoriesSlice";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

interface ViewCategoryFormProps {
  categoryId: number;
}

export function ViewCategoryForm({ categoryId }: ViewCategoryFormProps) {
  const dispatch = useAppDispatch();
  
  const { currentCategory, loading, error } = useAppSelector((state: RootState) => ({
    currentCategory: state.categories.currentCategory,
    loading: state.categories.loading_details,
    error: state.categories.error_details,
  }));

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryDetails(categoryId));
    }
  }, [dispatch, categoryId]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View Category</DialogTitle>
        <DialogDescription>
          The details of the selected category are displayed below.
        </DialogDescription>
      </DialogHeader>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentCategory ? (
        <div className="grid gap-6 mt-6 mb-4">
          <Label htmlFor="id">Category ID: <span className="text-gray-400">{currentCategory.id}</span></Label>
          <Label htmlFor="title">Category Title: <span className="text-gray-400">{currentCategory.title}</span></Label>
          <Label htmlFor="title">Type ID: <span className="text-gray-400">{currentCategory.typeId}</span></Label>
          <Label htmlFor="title">Products: <span className="text-gray-400">{currentCategory.productCount}</span></Label>
          <div className="grid gap-2">
            <Label htmlFor="image">Category Image</Label>
            <div className="w-full rounded-lg">
            <Image width={150} height={150} src={currentCategory.image} alt="Type" className="w-32 object-cover" />
          </div>
          </div>
        </div>
      ) : (
        <p>No Category selected</p>
      )}
      {/* <DialogFooter>
        <Button variant="destructive" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </DialogFooter> */}
    </DialogContent>
  );
}