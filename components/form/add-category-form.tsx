"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AddCategoryForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setImage("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !image) {
      setError("Both title and image are required.");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const res = await fetch("/api/categories/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category.");
      }

      const data = await res.json();
      if (data.success) {
        // Call the onAddSuccess callback to refresh data
        // onAddSuccess();
        // Reset form after successful submission
        resetForm();
      } else {
        setError("Failed to create category.");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Error creating category. Please try again.");
    } finally {
      setLoading(false);
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
      
      <form className="grid gap-6 mt-6 mb-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <Label htmlFor="title">Category Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Bind state to input
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Category Image</Label>
          <Input
            id="image"
            type="text"
            placeholder="Enter category IMAGE link"
            value={image}
            onChange={(e) => setImage(e.target.value)} // Bind state to input
            required
          />
        </div>

        {error && <FormError message={error} />} {/* Show error message */}
      </form>

      <Button
        variant="edit"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Creating..." : "Create"}
      </Button>
    </DialogContent>
  );
}
