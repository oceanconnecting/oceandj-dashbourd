import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DeleteOrderForm } from "@/components/form/delete-order-form";
import { TrashIcon, InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link"


const CellActions = ({ id }: { id: string }) => {
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);

  const handleOpenDialogDelete = () => setIsDialogOpenDelete(true);
  const handleCloseDialogDelete = () => setIsDialogOpenDelete(false);

  return (
    <div className="flex space-x-2">
      {/* View Button */}
      <Link href={`/orders/order-details/${id}`} className="p-1.5">
        <InfoCircledIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-700" />
      </Link>

      {/* Edit Button */}
      <Link href={`/orders/update-order/${id}`} className="p-1.5">
        <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
      </Link>

      {/* Delete Button */}

      <button className="p-1.5" onClick={handleOpenDialogDelete}>
        <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-700" />
      </button>
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DeleteOrderForm orderId={id} onClose={handleCloseDialogDelete} />
      </Dialog>
    </div>
  );
};

export default CellActions;
