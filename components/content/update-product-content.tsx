/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateProduct, fetchProductDetails, fetchProductCategories, fetchProductBrands } from "@/app/redux/features/products/productsSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";

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
  const brands = useAppSelector((state: RootState) => state.products.brands);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imagesFB, setImagesFB] = useState<File[]>([]);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  // const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
    dispatch(fetchProductCategories());
    dispatch(fetchProductBrands());
  }, [dispatch, productId]);

  useEffect(() => {
    if (currentProduct) {
      setTitle(currentProduct.title);
      setDescription(currentProduct.description);
      setPrice(currentProduct.price);
      setDiscount(currentProduct.discount);
      setStock(currentProduct.stock);
      setCategoryId(currentProduct.category.id);
      setCategory(currentProduct.category);
      setBrandId(currentProduct.brand.id);
      setBrand(currentProduct.brand);
      setImages(currentProduct.images);
      setOrderCount(currentProduct.orderCount);
    }
  }, [currentProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagesFB(Array.from(e.target.files));
      setUploadProgress(0);
    }
  };

  const uploadImages = async () => {
    setIsUploading(true);
    const uploadedImageUrls: string[] = [];
    let totalBytesTransferred = 0;
    const totalBytes = imagesFB.reduce((acc, image) => acc + image.size, 0);

    const uploadPromises = imagesFB.map((image) => {
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
    setImages((prevImages) => [...prevImages, ...uploadedImageUrls]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  // const removeImageUrls = (index: number) => {
  //   setImageUrls((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Before : ", images);
    // await setImages(images.concat(Array.isArray(imageUrls) ? imageUrls : [imageUrls]));
    // console.log("After : ", images);
    
    if (!title || price <= 0 || stock <= 0 || categoryId === null || brandId === null) {
      toast.error("Error: All fields are required and must be valid.");
      return;
    }

    if ( images.length > 5 ) {
      toast.error("Error: Maximum 5 images are allowed.");
      return;
    }

    const updatedProductData = {
      id: productId,
      title,
      description,
      price,
      discount,
      categoryId,
      brandId,
      stock,
      images: images.length > 0 ? images : [],
      orderCount: orderCount !== null ? orderCount : 0,
    };

    try {
      const action = await dispatch(updateProduct({
        ...updatedProductData,
        category: { id: categoryId!, title: categories.find((cat) => cat.id === categoryId)!.title },
        brand: { id: brandId!, title: brands.find((brand) => brand.id === brandId)!.title },
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
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              <div className="flex flex-col gap-8 w-full">
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-semibold leading-none tracking-tight">Update Product: {title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the form to update a product {title} in your store.</p>
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
                        value={price}
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
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        min={0}
                      />
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
                      <Label htmlFor="brand">Brand</Label>
                      <Select onValueChange={(value) => setBrandId(Number(value))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={brandId ? brands.find((brand) => brand.id === brandId)?.title : "Select a brand"} />
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
                      {imagesFB.length > 0 && (
                        <Button
                          variant="outline"
                          className="p-3 flex items-center gap-3"
                          size="lg"
                          onClick={uploadImages}
                          disabled={isUploading}
                        >
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
                    {images.map((image, i) => (
                      <div key={i} className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={image}
                          alt={`Image ${i}`}
                          className="w-40 h-40 object-contain rounded-md"
                        />
                        <Button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* <h1>New Images :</h1>
                  <div className="grid grid-cols-5 gap-4">
                    {imageUrls.map((image, i) => (
                      <div key={i} className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={image}
                          alt={`Image ${i}`}
                          className="w-40 h-40 object-contain rounded-md"
                        />
                        <Button
                          onClick={() => removeImageUrls(i)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div> */}

                </div>
                <div className="inline-flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" disabled={loading} onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button variant="edit" disabled={loading} onClick={handleSubmit}>
                    Update Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}