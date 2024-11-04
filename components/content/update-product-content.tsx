/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateProduct, fetchProductDetails, fetchProductCategories } from "@/app/redux/features/products/productsSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface UpdateProductFormProps {
  productId: number;
}

export function UpdateProductContent({ productId }: UpdateProductFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentProduct, loading, error } = useAppSelector((state: RootState) => ({
    currentProduct: state.products.currentProduct,
    loading: state.products.loading_details,
    error: state.products.error_details,
  }));
  const categories = useAppSelector((state: RootState) => state.products.categories);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, SetCategory] = useState("");
  const [images, SetImages] = useState<string[]>([]);
  const [orderCount, SetOrderCount] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
    dispatch(fetchProductCategories());
  }, [dispatch, productId]);

  useEffect(() => {
    if (currentProduct) {
      setTitle(currentProduct.title);
      setDescription(currentProduct.description);
      setPrice(currentProduct.price);
      setDiscount(currentProduct.discount);
      setStock(currentProduct.stock);
      setCategoryId(currentProduct.category.id);
      SetCategory(currentProduct.category);
      SetImages(currentProduct.images);
      SetOrderCount(currentProduct.orderCount);
    }
  }, [currentProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || price <= 0 || stock <= 0 || categoryId === null) {
      console.error("Error: All fields are required and must be valid.");
      return;
    }
  
    const updatedProductData = {
      id: productId,
      title,
      description,
      price,
      discount,
      categoryId,
      stock,
      images: images.length > 0 ? images : [], 
      orderCount: orderCount !== null ? orderCount : 0,
    };
  
    try {
      const action = await dispatch(updateProduct({
        ...updatedProductData,
        category: { id: categoryId!, title: categories.find((cat) => cat.id === categoryId)!.title },
      }));
  
      if (updateProduct.fulfilled.match(action)) {
        toast.success("The product has been successfully updated.");
        router.back();
      } else {
        toast.error("Failed to update the product. Please try again.");
        console.error("Failed to update product:", action.error);
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update the product. Please try again.");
    }
  };
  

  return (
    <Card className="rounded-lg border-none mt-6 shadow-lg">
      <CardContent className="p-6">
        <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Title</Label>
              <Input
                id="title"
                placeholder="Enter product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="Enter discount"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setCategoryId(Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoryId ? categories.find((cat) => cat.id === categoryId)?.title : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  type="number"
                  id="stock"
                  placeholder="Enter stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <Button type="submit" className="p-4" disabled={loading}>
              Update Product
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
