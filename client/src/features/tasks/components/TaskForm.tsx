import { SubmitHandler } from "react-hook-form";
import GenericForm from "../../common/components/GenericForm";
import { CreateTaskSchema } from "../taskTypes";

interface TaskFormProps {
  onSubmit: SubmitHandler<{ title: string }>; // Changed to match what ListViewPage expects
  isSubmitting?: boolean;
  externalError?: string;
  initialValues?: Partial<{ title: string }>;
}

export default function TaskForm({
  onSubmit,
  isSubmitting,
  externalError,
  initialValues,
}: TaskFormProps) {
  return (
    <GenericForm<{ title: string }>
      fields={[
        {
          name: "title",
          label: "Task Title",
          type: "text",
          required: true,
          placeholder: "Enter task title",
        },
      ]}
      schema={CreateTaskSchema.pick({ title: true })}
      onSubmit={onSubmit}
      submitLabel="Add Task"
      isSubmitting={isSubmitting}
      externalError={externalError}
      initialValues={initialValues}
    />
  );
}
