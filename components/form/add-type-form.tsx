"use client";

import { UploadIcon } from "@radix-ui/react-icons";
import React, { useState, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addType } from "@/app/redux/features/types/typesSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { RootState } from "@/app/redux/store";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";

export function AddTypeForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.types.loading_add);
  const error = useAppSelector((state: RootState) => state.types.error_add);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    setUploadProgress(0);
    setUploadedImageUrl(null);
    setSizeError(null);
    setIsImageUploaded(false);
  };

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
      const MAX_SIZE = 4 * 1024 * 1024;

      if (selectedFile.size > MAX_SIZE) {
        setSizeError("The image size must be less than 4MB.");
        setImageFile(null);
        setUploadedImageUrl(null);
        setIsImageUploaded(false);
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
    const storageRef = ref(storage, `types/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error.message);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedImageUrl(downloadURL);
          setIsImageUploaded(true);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) {
      console.error("Error: Title and image are required.");
      return;
    }

    if (sizeError) {
      console.error("Error: " + sizeError);
      return; 
    }

    if (!isImageUploaded) {
      console.error("Error: Image has not been uploaded.");
      toast({
        title: "Error",
        description: "Please upload the image before creating the type.",
      });
      return;
    }

    try {
      const urlToUse = uploadedImageUrl || (await uploadImage());

      const action = await dispatch(addType({ title, image: urlToUse }));

      if (!title) {
        toast({
          title: "",
          description: "The type has been successfully added.",
        });
      }
      
      if (addType.fulfilled.match(action)) {
        toast({
          title: "Type added",
          description: "The type has been successfully added.",
        });
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Failed to add the type. Please try again.",
        });
        console.error("Failed to add type:", action.error);
      }
    } catch (err) {
      console.error("Error creating type:", err);
      toast({
        title: "Error",
        description: "Failed to create the type. Please try again.",
      });
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Type</DialogTitle>
        <DialogDescription>
          Fill out the form to add a new type to your store.
        </DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Type Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter type title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              required
              disabled={loading}
            />
            {imageFile && (
              <Button
                className="p-3"
                size="lg"
                variant="outline"
                onClick={async (e) => {
                  e.preventDefault();
                  if (imageFile) {
                    try {
                      const uploadedImageUrl = await uploadImage();
                      console.log("Uploaded Image URL:", uploadedImageUrl);
                    } catch (error) {
                      console.error("Image upload failed:", error);
                    }
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

        {uploadedImageUrl && (
          <div className="">
            <Image
              src={uploadedImageUrl}
              alt="Uploaded Image"
              className="w-32 object-cover"
              width={150} 
              height={150}
            />
          </div>
        )}

        {error && <FormError message={error} />}
        {sizeError && <FormError message={sizeError} />}
      </form>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            onClose();
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}