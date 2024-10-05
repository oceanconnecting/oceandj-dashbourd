"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";

interface Category {
  id: number;
  title: string;
  image: string;
}

export function ViewCategoryForm({ categoryId }: { categoryId: number }) {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axios.get(`/api/categories/category-details?id=${categoryId}`);
        if (response.data.success) {
          setCategory(response.data.category);
          console.log(response.data.category);
        } else {
          console.log("Category not found");
        }
      } catch (error) {
        console.log("Error : ", error);
        console.log("Failed to fetch category details");
      }
    }

    fetchCategory();
  }, [categoryId]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View Category</DialogTitle>
        <DialogDescription>
          The details of the selected category are displayed below.
        </DialogDescription>
      </DialogHeader>
      {category && (
        <div className="grid gap-6 mt-6 mb-4">
          <Label htmlFor="id">Category ID : <span className="text-gray-400">{category.id}</span></Label>
          <Label htmlFor="title">Category Title : <span className="text-gray-400">{category.title}</span></Label>
          <div className="grid gap-2">
            <Label htmlFor="image">Category Image</Label>
            <div className="w-full rounded-lg">
              <img src={category.image} alt="Category" className="rounded-lg max-h-40 object-cover" />
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
