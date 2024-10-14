"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchTypeDetails } from "@/app/redux/features/types/typesSlice";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

interface ViewTypeFormProps {
  typeId: number;
}

export function ViewTypeForm({ typeId }: ViewTypeFormProps) {
  const dispatch = useAppDispatch();
  
  const { currentType, loading, error } = useAppSelector((state: RootState) => ({
    currentType: state.types.currentType,
    loading: state.types.loading_details,
    error: state.types.error_details,
  }));

  useEffect(() => {
    if (typeId) {
      dispatch(fetchTypeDetails(typeId));
    }
  }, [dispatch, typeId]);
  

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>View Type</DialogTitle>
        <DialogDescription>
          The details of the selected type are displayed below.
        </DialogDescription>
      </DialogHeader>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentType ? (
        <div className="grid gap-6 mt-6 mb-4">
          <Label htmlFor="id">Type ID: <span className="text-gray-400">{currentType.id}</span></Label>
          <Label htmlFor="title">Type Title: <span className="text-gray-400">{currentType.title}</span></Label>
          <Label htmlFor="title">Categories: <span className="text-gray-400">{currentType.categoryCount}</span></Label>
          <div className="grid gap-2">
            <Label htmlFor="image">Type Image</Label>
            <div className="w-full rounded-lg">
              <Image width={250} height={250} src={currentType.image} alt="Type" className="rounded-lg max-h-40 object-cover" />
            </div>
          </div>
        </div>
      ) : (
        <p>No type selected</p>
      )}
      {/* <DialogFooter>
        <Button variant="destructive" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </DialogFooter> */}
    </DialogContent>
  );
}
