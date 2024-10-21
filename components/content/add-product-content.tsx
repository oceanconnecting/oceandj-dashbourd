"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addProduct, fetchProductCategories } from "@/app/redux/features/products/productsSlice";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { UploadIcon } from "@radix-ui/react-icons";
import { RootState } from "@/app/redux/store";

export function AddProductContent() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              <ProductForm />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const loading = useAppSelector((state: RootState) => state.products.loading_add);
  // const error = useAppSelector((state: RootState) => state.products.error_add);
  const categories = useAppSelector((state: RootState) => state.products.categories);
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setDiscount(0);
    setCategoryId(null);
    setStock(0);
    setImages([]);
    setImageUrls([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setUploadProgress(0);
    }
  };

  const uploadImages = async () => {
    setIsUploading(true);
    const uploadedImageUrls: string[] = [];
    let totalBytesTransferred = 0;
    const totalBytes = images.reduce((acc, image) => acc + image.size, 0);

    const uploadPromises = images.map((image) => {
      const currentDateTime = new Date().toISOString();
      const imageRef = ref(storage, `products/${currentDateTime}_${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            totalBytesTransferred += snapshot.bytesTransferred;
            const combinedProgress = (totalBytesTransferred / totalBytes) * 100;
            setUploadProgress(combinedProgress);
          },
          (error) => {
            console.error("Upload failed:", error.message);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(imageRef);
            uploadedImageUrls.push(url);
            resolve();
          }
        );
      });
    });

    await Promise.all(uploadPromises);
    setImageUrls(uploadedImageUrls);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || price <= 0 || stock <= 0 || categoryId === null) {
      console.error("Error: All fields are required and must be valid.");
      return;
    }
  
    try {
      if (images.length > 0 && imageUrls.length === 0) {
        await uploadImages();
      }
  
      const productData = {
        title,
        description,
        price,
        discount: discount || 0,
        categoryId,
        stock,
        images: imageUrls,
        orderCount: 0,
      };
  
      const action = await dispatch(addProduct(productData));
  
      if (addProduct.fulfilled.match(action)) {
        toast({
          title: "Product added",
          description: "The product has been successfully added.",
        });
        resetForm();
        router.back();
      } else {
        toast({
          title: "Error",
          description: action.error.message || "Failed to add the product. Please try again.",
        });
        console.error("Failed to add product:", action.error);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: "Failed to add the product. Please try again.",
      });
    }
  };
  

  return (
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
              value={price > 0 ? price : ""}
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
              value={discount > 0 ? discount : ""}
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
              value={stock > 0 ? stock : ""}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Product Images</Label>
          <div className="flex items-center gap-2">
            <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
            {images.length > 0 && (
              <Button
                variant="outline"
                className="p-3 flex items-center gap-3"
                size="lg"
                onClick={uploadImages}
                disabled={isUploading}
              >
                <UploadIcon className="w-4 h-4" />
                Upload Images
              </Button>
            )}
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    {uploadProgress.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="p-4" disabled={loading}>
          Add Product
        </Button>
      </div>
    </form>
  );
}