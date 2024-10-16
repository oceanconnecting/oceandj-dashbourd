"use client";

import { useState } from 'react';
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card"; 

export function FormApis() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const TypesLinks = [
    { method: 'Get', description: 'List all types', url: 'http://localhost:3000/api/types/list-types' },
    { method: 'Get', description: 'Type details', url: 'http://localhost:3000/api/types/type-details/${typeId}' },
    { method: 'Post', description: 'Create a new product', url: 'http://localhost:3000/api/types/add-type' },
    { method: 'Put', description: 'Update a product', url: 'http://localhost:3000/api/types/update-type/${typeId}' },
    { method: 'Delete', description: 'Delete a product', url: 'http://localhost:3000/api/types/delete-type/${typeId}' }
  ];

  const CategoriesLinks = [
    { method: 'Get', description: 'List all categories', url: 'http://localhost:3000/api/categories/list-categories' },
    { method: 'Get', description: 'Category details', url: 'http://localhost:3000/api/categories/category-details/${typeId}' },
    { method: 'Post', description: 'Create a new product', url: 'http://localhost:3000/api/categories/add-category' },
    { method: 'Put', description: 'Update a product', url: 'http://localhost:3000/api/categories/update-category/${typeId}' },
    { method: 'Delete', description: 'Delete a product', url: 'http://localhost:3000/api/categories/delete-category/${typeId}' }
  ];

  const ProductsLinks = [
    { method: 'Get', description: 'List all products', url: 'http://localhost:3000/api/products/list-products' },
    { method: 'Get', description: 'Product details', url: 'http://localhost:3000/api/products/products-details/${typeId}' },
    { method: 'Post', description: 'Create a new product', url: 'http://localhost:3000/api/products/add-products' },
    { method: 'Put', description: 'Update a product', url: 'http://localhost:3000/api/products/update-products/${typeId}' },
    { method: 'Delete', description: 'Delete a product', url: 'http://localhost:3000/api/products/delete-products/${typeId}' }
  ];

  return (
    <div className="">
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
            <div className="overflow-auto w-full flex items-start relative">
              <div className="h-full flex-1 flex-col space-y-8 flex">
<div className="w-full">
                  <h3 className="font-semibold text-2xl mb-6">Types Information</h3>
                  <div className="space-y-6">
                    {TypesLinks.map((typeLink, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-16 inline-flex">
                            <span className="truncate text-sm text-white font-mono px-2 py-0.5 bg-green-600 dark:bg-green-800 rounded-sm">
                              {typeLink.method}
                            </span>
                          </div>
                          <p className="text-md font-medium">{typeLink.description}</p>
                        </div>

                        <div
                          className="bg-gray-900 flex flex-row items-center justify-between rounded-md border p-3 relative"
                        >
                          <p className="truncate text-sm text-white font-mono">
                            {typeLink.url}
                          </p>

                          <button
                            onClick={() => handleCopy(typeLink.url, index)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-background text-white p-2 rounded-md bg-gray-900 hover:bg-gray-700"
                          >
                            {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
            <div className="overflow-auto w-full flex items-start relative">
              <div className="h-full flex-1 flex-col space-y-8 flex">
                <div className="w-full">
                  <h3 className="font-semibold text-2xl mb-6">Categories Information</h3>
                  <div className="space-y-6">
                    {CategoriesLinks.map((categoryLink, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-16 inline-flex">
                            <span className="truncate text-sm text-white font-mono px-2 py-0.5 bg-green-600 dark:bg-green-800 rounded-sm">
                              {categoryLink.method}
                            </span>
                          </div>
                          <p className="text-md font-medium">{categoryLink.description}</p>
                        </div>

                        <div
                          className="bg-gray-900 flex flex-row items-center justify-between rounded-md border p-3 relative"
                        >
                          <p className="truncate text-sm text-white font-mono">
                            {categoryLink.url}
                          </p>

                          <button
                            onClick={() => handleCopy(categoryLink.url, index)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-background text-white p-2 rounded-md bg-gray-900 hover:bg-gray-700"
                          >
                            {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
            <div className="overflow-auto w-full flex items-start relative">
              <div className="h-full flex-1 flex-col space-y-8 flex">
                <div className="w-full">
                  <h3 className="font-semibold text-2xl mb-6">Products Information</h3>
                  <div className="space-y-6">
                    {ProductsLinks.map((productLink, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-16 inline-flex">
                            <span className="truncate text-sm text-white font-mono px-2 py-0.5 bg-green-600 dark:bg-green-800 rounded-sm">
                              {productLink.method}
                            </span>
                          </div>
                          <p className="text-md font-medium">{productLink.description}</p>
                        </div>

                        <div
                          className="bg-gray-900 flex flex-row items-center justify-between rounded-md border p-3 relative"
                        >
                          <p className="truncate text-sm text-white font-mono">
                            {productLink.url}
                          </p>

                          <button
                            onClick={() => handleCopy(productLink.url, index)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-background text-white p-2 rounded-md bg-gray-900 hover:bg-gray-700"
                          >
                            {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
