import { SubmitHandler } from "react-hook-form";
import { CreateListWithAiSchema } from "../listTypes";
import GenericForm from "../../common/components/GenericForm";

interface NewListWithAIFormProps {
  onSubmit: SubmitHandler<{ prompt: string }>;
  isSubmitting?: boolean;
  externalError?: string;
}

export default function NewListWithAIForm({
  onSubmit,
  isSubmitting,
  externalError,
}: NewListWithAIFormProps) {
  return (
    <GenericForm<{ prompt: string }>
      fields={[
        {
          name: "prompt",
          label: "What do you want to do?",
          type: "text",
          required: true,
          placeholder: "eg. bake a chocolate cake",
        },
      ]}
      schema={CreateListWithAiSchema}
      onSubmit={onSubmit}
      submitLabel="Create with AI"
      isSubmitting={isSubmitting}
      externalError={externalError}
    />
  );
}
