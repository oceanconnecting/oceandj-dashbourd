"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addProduct, fetchProductCategories, fetchProductBrands } from "@/app/redux/features/products/productsSlice";
import { toast } from "sonner";
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
import Image from "next/image";

export function AddProductContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector((state: RootState) => state.products.loading_add);

  const categories = useAppSelector((state: RootState) => state.products.categories);
  const brands = useAppSelector((state: RootState) => state.products.brands);
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductCategories());
    dispatch(fetchProductBrands());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setDiscount(0);
    setCategoryId("");
    setBrandId("");
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
  
    if (!title || price <= 0 || stock <= 0 || categoryId === null || brandId === null) {
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
        brandId,
        stock,
        images: imageUrls,
        orderCount: 0,
      };
  
      const action = await dispatch(addProduct(productData));
  
      if (addProduct.fulfilled.match(action)) {
        toast.success("The product has been successfully added.");
        resetForm();
        router.back();
      } else {
        toast.error("Failed to add the product. Please try again.");
        console.error("Failed to add product:", action.error);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add the product. Please try again.");
    }
  };

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              <form className="flex flex-col gap-10 w-full" onSubmit={handleSubmit}>
                <div className="">
                  <h1 className="text-lg md:text-xl lg:text-2xl font-semibold leading-none tracking-tight">Add Product</h1>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the form to add a new Product to your store.</p>
                </div>
                <div className="grid gap-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="discount">Discount</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="Enter discount"
                        value={discount >= 0 ? discount : 0}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        min={-1}
                      />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setCategoryId(value)}>
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
                      <Label htmlFor="brand">Brand</Label>
                      <Select onValueChange={(value) => setBrandId(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={brandId ? brands.find((cat) => cat.id === brandId)?.title : "Select a brand"} />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                              {brand.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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

                  <div className="grid grid-cols-5 gap-4">
                    {imageUrls && imageUrls.map((image, i) => (
                      <div key={i} className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={image}
                          alt={`Image ${i}`}
                          className="w-40 h-40 object-contain rounded-md"
                        />
                      </div>
                    ))}
                  </div>

                </div>
                <div className="inline-flex items-center justify-end gap-3">
                  <Button type="submit" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="edit" disabled={loading}>
                    Add Product
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}