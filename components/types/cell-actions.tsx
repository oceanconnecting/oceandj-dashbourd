import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TrashIcon, InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { ViewTypeForm } from "@/components/form/view-type-form";
import { EditTypeForm } from "@/components/form/edit-type-form";
import { DeleteTypeForm } from "@/components/form/delete-type-form";
import { Row } from "@tanstack/react-table"; // Import the Row type
import { TypeSchema } from "@/schemas/type"; // Assuming TypeSchemaType is the inferred type from your Zod schema
import { z } from "zod"

type TypeSchemaType = z.infer<typeof TypeSchema>

// This is the new component for the cell
const CellActions = ({ row }: { row: Row<TypeSchemaType> }) => {
  const [isDialogOpenView, setIsDialogOpenView] = useState(false);
  const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);

  const handleOpenDialogView = () => setIsDialogOpenView(true);

  const handleOpenDialogEdit = () => setIsDialogOpenEdit(true);
  const handleCloseDialogEdit = () => setIsDialogOpenEdit(false);

  const handleOpenDialogDelete = () => setIsDialogOpenDelete(true);
  const handleCloseDialogDelete = () => setIsDialogOpenDelete(false);

  return (
    <div className="flex space-x-2">
      {/* View Button */}
      <button className="p-1.5" onClick={handleOpenDialogView}>
        <InfoCircledIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-700" />
      </button>
      {isDialogOpenView && (
        <Dialog open={isDialogOpenView} onOpenChange={setIsDialogOpenView}>
          <ViewTypeForm typeId={row.getValue("title")} />
        </Dialog>
      )}

      {/* Edit Button */}
      <button className="p-1.5" onClick={handleOpenDialogEdit}>
        <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
      </button>
      <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
        <EditTypeForm
          typeId={row.getValue("title")}
          currentTitle={row.getValue("title")}
          currentImage={row.getValue("image")}
          onClose={handleCloseDialogEdit}
        />
      </Dialog>

      {/* Delete Button */}
      <button className="p-1.5" onClick={handleOpenDialogDelete}>
        <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-700" />
      </button>
      <Dialog open={isDialogOpenDelete} onOpenChange={setIsDialogOpenDelete}>
        <DeleteTypeForm typeId={row.getValue("title")} onClose={handleCloseDialogDelete} />
      </Dialog>
    </div>
  );
};

export default CellActions;
