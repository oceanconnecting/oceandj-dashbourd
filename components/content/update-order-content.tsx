"use client";

import { Card, CardContent } from "@/components/ui/card";

export function UpdateOrderContent() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full w-full flex">
              Update Order
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
