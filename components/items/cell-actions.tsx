import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TrashIcon } from "@radix-ui/react-icons";
// import { EditItemForm } from "@/components/form/edit-item-form";
import { DeleteItemForm } from "@/components/form/delete-item-form";
import { Row } from "@tanstack/react-table";
import { ItemSchema } from "@/schemas/item";
import { z } from "zod"

type ItemSchemaItem = z.infer<typeof ItemSchema>

const CellActions = ({ row }: { row: Row<ItemSchemaItem> }) => {
  // const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);

  // const handleOpenDialogEdit = () => setIsDialogOpenEdit(true);
  // const handleCloseDialogEdit = () => setIsDialogOpenEdit(false);

  const handleOpenDialogDelete = () => setIsDialogOpenDelete(true);
  const handleCloseDialogDelete = () => setIsDialogOpenDelete(false);

  return (
    <div className="flex space-x-2">

      {/* Edit Button
      <button className="p-1.5" onClick={handleOpenDialogEdit}>
        <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
      </button>
      <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
        <EditItemForm
          orderId={row.getValue("id")}
          currentTitle={row.getValue("title")}
          currentImage={row.getValue("image")}
          onClose={handleCloseDialogEdit}
        />
      </Dialog> */}

      {/* Delete Button */}
      <button className="p-1.5" onClick={handleOpenDialogDelete}>
        <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-700" />
      </button>
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DeleteItemForm orderId={row.getValue("id")} onClose={handleCloseDialogDelete} />
      </Dialog>
    </div>
  );
};

export default CellActions;
