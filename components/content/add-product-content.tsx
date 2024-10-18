/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { uploadBytesResumable } from "firebase/storage";

export function AddProductContent() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              <Component />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Component() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
      setUploadProgress(new Array(files.length).fill(0));
    }
  };


  const uploadImages = async () => {
    const uploadedImageUrls: string[] = [];
    const uploadPromises = images.map((image, index) => {
      const imageRef = ref(storage, `products/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image); // use uploadBytesResumable

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = progress;
              return newProgress;
            });
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
  };


  const handleSaveProduct = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    await uploadImages();

    console.log({
      name,
      description,
      price,
      discount,
      category,
      stock,
      imageUrls,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>Back</Button>
          <Button onClick={handleSaveProduct}>Save Product</Button>
          <Button onClick={uploadImages}>Upload Images</Button>
        </div>
      </div>
      <Card>
        <CardContent className="grid gap-6">
          <div className="grid gap-2 pt-6">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter product description" className="min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" placeholder="Enter price" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount</Label>
              <div className="flex items-center">
                <Input id="discount" type="number" placeholder="Enter discount" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input type="number" id="stock" placeholder="Enter stock" value={stock || ''} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Product Images</Label>
            <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>
          {uploadProgress.length > 0 && uploadProgress.map((progress, index) => (
            <div key={index} className="mt-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                      {progress.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-teal-600">
                      {progress === 100 ? "Upload Complete" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-2 overflow-hidden text-xs bg-gray-200 rounded">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
