"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";

export function EditCategoryForm({ categoryId, currentTitle, currentImage, onUpdateSuccess }) {
  // State for form inputs
  const [title, setTitle] = useState(currentTitle || ""); // Prefill with current title
  const [image, setImage] = useState(currentImage || ""); // Prefill with current image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/categories/update-category?id=${categoryId}`, {
        title,
        image,
      });

      if (response.data.success) {
        // Call the callback function on successful update
        onUpdateSuccess();
      } else {
        setError("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>
          Fill out the form to update the category details.
        </DialogDescription>
      </DialogHeader>
      
      <form className="grid gap-6 mt-6 mb-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <Label htmlFor="title">Category Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update state when input changes
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
            onChange={(e) => setImage(e.target.value)} // Update state when input changes
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <Button variant="edit" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>
    </DialogContent>
  );
}
