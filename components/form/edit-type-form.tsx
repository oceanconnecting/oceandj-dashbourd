"use client";

import { useState, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateType } from "@/app/redux/features/types/typesSlice"; 
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { toast } from "sonner";
import { FormError } from "@/components/form/form-error";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";

export function EditTypeForm({ typeId, currentTitle, currentImage, onClose }: { typeId: string, currentTitle: string, currentImage: string, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTitle || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const loading = useAppSelector((state: RootState) => state.types.loading_update);
  const error = useAppSelector((state: RootState) => state.types.error_update);

  const resetForm = () => {
    setTitle(currentTitle);
    setImageFile(null);
    setUploadProgress(0);
    setImageUrl(currentImage);
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
        setImageUrl(currentImage);
      } else {
        setSizeError(null);
        setImageFile(selectedFile);
      }
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return currentImage;

    const newFileName = generateImageName(imageFile.name);
    const storageRef = ref(storage, `types/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setIsImageUploaded(true);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!imageFile && !imageUrl)) return;

    if (sizeError) return;

    if (imageFile && !isImageUploaded) {
      toast.error("Please upload the image before submitting.");
      return;
    }

    try {
      const uploadedImageUrl = imageFile ? await uploadImage() : imageUrl;
      const resultAction = await dispatch(updateType({ typeId, title, image: uploadedImageUrl }));

      if (updateType.fulfilled.match(resultAction)) {
        toast.success("The type has been successfully updated.");
        resetForm();
      } else {
        toast.error("Failed to update the type. Please try again.");
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update the type. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Type</DialogTitle>
        <DialogDescription>Update the details of the type.</DialogDescription>
      </DialogHeader>

      <form className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Type Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Input id="image" type="file" onChange={handleFileChange} disabled={loading} />
            {imageFile && (
              <Button
                className="p-3"
                size="lg"
                variant="outline"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const uploadedImageUrl = await uploadImage();
                    console.log("Uploaded Image URL:", uploadedImageUrl);
                  } catch (error) {
                    console.error("Image upload failed:", error);
                  }
                }}
                disabled={loading}
              >
                Upload
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

        {imageUrl && (
          <div className="mb-3">
            <Image 
              src={imageUrl} 
              alt="Current Image" 
              className="w-32 object-cover"
              width={150} 
              height={150}  
            />
          </div>
        )}

        {error && <FormError message={error} />}
        {sizeError && <FormError message={sizeError} />}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="edit" type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
