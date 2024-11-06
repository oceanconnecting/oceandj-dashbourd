import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TrashIcon, InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { ViewBrandForm } from "@/components/form/view-brand-form";
import { EditBrandForm } from "@/components/form/edit-brand-form";
import { DeleteBrandForm } from "@/components/form/delete-brand-form";
import { Row } from "@tanstack/react-table"; // Import the Row brand
import { BrandSchema } from "@/schemas/brand"; // Assuming brandSchemabrand is the inferred brand from your Zod schema
import { z } from "zod"

type BrandSchemaBrand = z.infer<typeof BrandSchema>

// This is the new component for the cell
const CellActions = ({ row }: { row: Row<BrandSchemaBrand> }) => {
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
          <ViewBrandForm brandId={row.getValue("id")} />
        </Dialog>
      )}

      {/* Edit Button */}
      <button className="p-1.5" onClick={handleOpenDialogEdit}>
        <Pencil2Icon className="w-5 h-5 text-green-500 dark:text-green-700" />
      </button>
      <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
        <EditBrandForm
          brandId={row.getValue("id")}
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
        <DeleteBrandForm brandId={row.getValue("id")} onClose={handleCloseDialogDelete} />
      </Dialog>
    </div>
  );
};

export default CellActions;
