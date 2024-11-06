"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBrandDetails } from "@/app/redux/features/brands/brandsSlice";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

interface ViewBrandFormProps {
  brandId: number;
}

export function ViewBrandForm({ brandId }: ViewBrandFormProps) {
  const dispatch = useAppDispatch();
  
  const { currentBrand, loading, error } = useAppSelector((state: RootState) => ({
    currentBrand: state.brands.currentBrand,
    loading: state.brands.loading_details,
    error: state.brands.error_details,
  }));

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrandDetails(brandId));
    }
  }, [dispatch, brandId]);
  

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View Brand</DialogTitle>
        <DialogDescription>
          The details of the selected brand are displayed below.
        </DialogDescription>
      </DialogHeader>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentBrand ? (
        <div className="grid gap-6 mt-6 mb-4">
          <Label htmlFor="id">Brand ID: <span className="text-gray-400">{currentBrand.id}</span></Label>
          <Label htmlFor="title">Brand Title: <span className="text-gray-400">{currentBrand.title}</span></Label>
          <Label htmlFor="title">Products: <span className="text-gray-400">{currentBrand.productCount}</span></Label>
          <div className="grid gap-2">
            <Label htmlFor="image">Brand Image</Label>
            <div className="w-full rounded-lg">
              <Image width={150} height={150} src={currentBrand.image} alt="Brand" className="w-32 object-cover" />
            </div>
          </div>
        </div>
      ) : (
        <p>No brand selected</p>
      )}
    </DialogContent>
  );
}
