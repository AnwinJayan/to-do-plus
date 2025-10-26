import { SubmitHandler } from "react-hook-form";
import { CreateList, CreateListSchema } from "../listTypes";
import GenericForm from "../../common/components/GenericForm";

interface NewListFormProps {
  onSubmit: SubmitHandler<CreateList>;
  isSubmitting?: boolean;
  externalError?: string;
}

export default function NewListForm({
  onSubmit,
  isSubmitting,
  externalError,
}: NewListFormProps) {
  return (
    <GenericForm<CreateList>
      fields={[
        {
          name: "title",
          label: "List Title",
          type: "text",
          required: true,
          placeholder: "Enter list title",
        },
      ]}
      schema={CreateListSchema}
      onSubmit={onSubmit}
      submitLabel="Create List"
      isSubmitting={isSubmitting}
      externalError={externalError}
    />
  );
}
