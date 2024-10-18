import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TrashIcon, InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
// import { ViewProductForm } from "@/components/form/view-product-form";
// import { EditProductForm } from "@/components/form/edit-product-form";
import { DeleteProductForm } from "@/components/form/delete-product-form";
import Link from "next/link"


const CellActions = ({ id }: { id: number }) => {
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);

  const handleOpenDialogDelete = () => setIsDialogOpenDelete(true);
  const handleCloseDialogDelete = () => setIsDialogOpenDelete(false);

  return (
    <div className="flex space-x-2">
      {/* View Button */}
      <Link href={`/products/product-details/${id}`} className="p-1.5">
        <InfoCircledIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-700" />
      </Link>

      {/* Edit Button */}
      <Link href={`/products/update-product/${id}`} className="p-1.5">
        <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
      </Link>

      {/* Delete Button */}

      <button className="p-1.5" onClick={handleOpenDialogDelete}>
        <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-700" />
      </button>
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DeleteProductForm productId={id} onClose={handleCloseDialogDelete} />
      </Dialog>
    </div>
  );
};

export default CellActions;
