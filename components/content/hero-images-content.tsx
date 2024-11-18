'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

export const HeroImagesContent = () => {
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/hero-images/list-images');
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        setIsUploading(true);
        const res = await fetch('/api/hero-images/add-images', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to add image');
        const newImage = await res.json();
        setImages((prevImages) => [...prevImages, newImage]);
        setIsAddDialogOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCheckboxChange = (checked: boolean, imageId: number) => {
    if (checked) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  const handleDeleteImages = async () => {
    try {
      const res = await fetch('/api/hero-images/delete-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedImages }),
      });

      if (!res.ok) throw new Error('Failed to delete images');
      setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)));
      setSelectedImages([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Hero Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        width={200}
                        height={200}
                        src={img.url}
                        alt={`Hero image ${img.id}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          id={`checkbox-${img.id}`}
                          checked={selectedImages.includes(img.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, img.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new image</DialogTitle>
                      </DialogHeader>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                      {selectedFile && (
                        <p className="text-sm text-gray-500 mt-2">
                          Selected file: {selectedFile.name}
                        </p>
                      )}
                      {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                      <div className="mt-4 flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="edit" onClick={handleImageUpload} disabled={isUploading}>
                          Submit
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Confirmation Dialog */}
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={selectedImages.length === 0}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected ({selectedImages.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete the selected images?</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteImages}>
                          Confirm Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
