"use client";

import { useState } from 'react';
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"; // Assuming CheckIcon is available

export function FormApis() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);

    // Reset the icon back to CopyIcon after 2 seconds
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const links = [
    { method: 'Get', description: 'List all products', url: 'http://localhost:3000/api/products/list-products' },
    { method: 'Post', description: 'Create a new product', url: 'http://localhost:3000/api/products/create' },
    { method: 'Put', description: 'Update a product', url: 'http://localhost:3000/api/products/update' },
    { method: 'Delete', description: 'Delete a product', url: 'http://localhost:3000/api/products/delete' }
  ];

  return (
    <div className="flex flex-col">
      <div className="w-full mb-10">
        <h3 className="font-semibold text-2xl mb-6">Products Information</h3>
        <div className="space-y-6">
          {links.map((linkItem, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-16 inline-flex">
                  <span className="truncate text-sm text-white font-mono px-2 py-0.5 bg-green-600 dark:bg-green-800 rounded-sm">
                    {linkItem.method}
                  </span>
                </div>
                <p className="text-md font-medium">{linkItem.description}</p>
              </div>

              <div
                className="bg-gray-900 flex flex-row items-center justify-between rounded-md border p-3 relative"
              >
                <p className="truncate text-sm text-white font-mono">
                  {linkItem.url}
                </p>

                <button
                  onClick={() => handleCopy(linkItem.url, index)}
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
  );
}
