import { Card, CardContent } from "@/components/ui/card"; 
import { FormApis } from "@/components/form/form-apis"; 

export const ApisContent = () => {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-56px-20px-24px-48px)]">
          <div className="overflow-auto w-full flex items-start relative">
            <div className="h-full flex-1 flex-col space-y-8 flex">
              <FormApis />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}