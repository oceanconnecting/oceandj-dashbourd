"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export async function AddProductContent() {
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
  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Product</Button>
        </div>
      </div>
      <Card>
        <CardContent className="grid gap-6">
          <div className="grid gap-2 pt-6">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter product description" className="min-h-[120px]" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" placeholder="Enter price" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount</Label>
              <div className="flex items-center">
                <Input id="discount" type="number" placeholder="Enter discount" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select>
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
              <Input type="number" id="stock" placeholder="Enter stock" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label >Product Images Links</Label>
            <Input type="text" placeholder="Image number 1" />
            <Input type="text" placeholder="Image number 2" />
            <Input type="text" placeholder="Image number 3" />
            <Input type="text" placeholder="Image number 4" />
            <Input type="text" placeholder="Image number 5" />
        </div>
        </CardContent>
      </Card>
    </div>
  )
}