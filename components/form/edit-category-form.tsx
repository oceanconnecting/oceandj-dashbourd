"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateCategory, fetchCategoryTypes } from "@/app/redux/features/categories/categoriesSlice"; 
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { toast } from "sonner";
import { FormError } from "@/components/form/form-error";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { storage } from "../../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UploadIcon } from "@radix-ui/react-icons";

export function EditCategoryForm({
  categoryId,
  currentTitle,
  currentImage,
  currentTypeId,
  onClose,
}: {
  categoryId: number;
  currentTitle: string;
  currentImage: string;
  currentTypeId: number;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTitle || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<number | null>(currentTypeId || null);
  const loading = useAppSelector((state: RootState) => state.categories.loading_update);
  const error = useAppSelector((state: RootState) => state.categories.error_update);
  const types = useAppSelector((state: RootState) => state.categories.types); 

  useEffect(() => {
    dispatch(fetchCategoryTypes());
  }, [dispatch]);

  const generateImageName = (fileName: string) => {
    const now = new Date();
    const dateString = now.toISOString().replace(/[-:T]/g, "").split(".")[0];
    const fileExtension = fileName.split(".").pop();
    const baseFileName = fileName.replace(`.${fileExtension}`, "");
    return `${baseFileName}_${dateString}.${fileExtension}`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const MAX_SIZE = 4 * 1024 * 1024; // 4MB

      if (selectedFile.size > MAX_SIZE) {
        setSizeError("The image size must be less than 4MB.");
        setImageFile(null);
      } else {
        setSizeError(null);
        setImageFile(selectedFile);
      }
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      throw new Error("No image file selected.");
    }

    const newFileName = generateImageName(imageFile.name);
    const storageRef = ref(storage, `categories/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error.message);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL); // Update image URL once upload completes
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl || !typeId) {
      console.error("Error: Title, image, and type are required.");
      return;
    }

    try {
      const imageToUse = imageUrl || (imageFile ? await uploadImage() : currentImage);
      const resultAction = await dispatch(updateCategory({ categoryId, title, image: imageToUse, typeId }));
      if (updateCategory.fulfilled.match(resultAction)) {
        toast.success("The category has been successfully updated.");
        onClose();
      } else {
        toast.error("Failed to update the category. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update the category. Please try again.");
      console.error("Error updating Category:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>Fill out the form to update the category details.</DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Category Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="type">Category Type</Label>
          <Select onValueChange={(value) => setTypeId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={typeId ? types.find((type) => type.id === typeId)?.title : "Select a type"}
              />
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

        <div className="grid gap-3">
          <Label htmlFor="image">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
            />
            {imageFile && (
              <Button
                className="p-3"
                size="lg"
                variant="outline"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const uploadedImageUrl = await uploadImage();
                    setImageUrl(uploadedImageUrl);
                  } catch (error) {
                    console.error("Image upload failed:", error);
                  }
                }}
                disabled={loading}
              >
                <UploadIcon className="w-4 h-4" />
              </Button>
            )}
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
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-teal-600">
                      {uploadProgress === 100 ? "Upload Complete" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-2 overflow-hidden text-xs bg-gray-200 rounded">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <FormError message={error} />}
        {sizeError && <FormError message={sizeError} />}
      </form>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}