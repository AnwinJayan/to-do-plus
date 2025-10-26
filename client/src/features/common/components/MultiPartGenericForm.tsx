import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, FieldValues, Path, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

export interface MultiPartFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "file" | "password" | "select";
  required?: boolean;
  placeholder?: string;
  accept?: string;
  options?: { label: string; value: string | number }[]; // For select
}

interface MultiPartGenericFormProps<T extends FieldValues> {
  fields: MultiPartFieldConfig[];
  schema: ZodType<T>;
  initialValues?: Partial<T>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
  color?: string;
  externalError?: string;
}

export default function MultiPartGenericForm<T extends FieldValues>({
  fields,
  schema,
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting,
  color,
  externalError,
}: MultiPartGenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  // For image preview
  const [preview, setPreview] = useState<string | null>(
    initialValues?.imageUrl ?? null
  );
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues as DefaultValues<T>);
    }
  }, [initialValues, reset]);

  // Watch file input for preview
  const file = watch("image" as Path<T>);

  useEffect(() => {
    if (file && file.length > 0 && file[0] instanceof File) {
      const url = URL.createObjectURL(file[0]);
      setPreview(url);
      setImageRemoved(false);
      return () => URL.revokeObjectURL(url);
    } else if (initialValues?.imageUrl && !imageRemoved) {
      setPreview(initialValues.imageUrl);
    } else {
      setPreview(null);
    }
  }, [file, initialValues?.imageUrl, imageRemoved]);

  const handleRemoveImage = () => {
    setPreview(null);
    setImageRemoved(true);
    setValue("image" as Path<T>, null as any);
  };

  const onSubmitForm = (data: any) => {
    const formData = new FormData();
    fields.forEach((field) => {
      if (field.type === "file") {
        if (imageRemoved) {
          formData.append(field.name, "null");
        } else if (data[field.name]?.[0]) {
          formData.append(field.name, data[field.name][0]);
        }
      } else {
        if (data[field.name] !== undefined && data[field.name] !== null) {
          formData.append(field.name, data[field.name]);
        }
      }
    });
    onSubmit(formData);
  };

  // Add this helper function
  const getRegisterOptions = (field: MultiPartFieldConfig) => {
    const options: any = {};
    if (field.type === "number") {
      options.valueAsNumber = true;
    }
    if (field.required) {
      options.required = "This field is required";
    }
    return options;
  };

  // Add password visibility state
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePassword = (name: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {fields.map((field) => (
        <div className="form-control w-full" key={field.name}>
          <label className="label mb-1">
            <span className="label-text">{field.label}</span>
          </label>
          {field.type === "textarea" ? (
            <textarea
              {...register(field.name as Path<T>)}
              className={`textarea textarea-bordered w-full ${
                errors[field.name as keyof T] ? "textarea-error" : ""
              }`}
              placeholder={field.placeholder}
              rows={4}
            />
          ) : field.type === "file" ? (
            <>
              <input
                type="file"
                accept={field.accept}
                {...register(field.name as Path<T>)}
                className={`file-input file-input-bordered w-full ${
                  errors[field.name as keyof T] ? "file-input-error" : ""
                }`}
              />
              {preview && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg w-24 h-24 object-cover border"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-error"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              )}
            </>
          ) : field.type === "password" ? (
            <div className="relative">
              <input
                type={showPassword[field.name] ? "text" : "password"}
                {...register(field.name as Path<T>)}
                className={`input input-bordered w-full pr-10 ${
                  errors[field.name as keyof T] ? "input-error" : ""
                }`}
                placeholder={field.placeholder}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                tabIndex={-1}
                onClick={() => togglePassword(field.name)}
              >
                {showPassword[field.name] ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : field.type === "select" ? (
            <select
              {...register(field.name as Path<T>)}
              className={`select select-bordered w-full ${
                errors[field.name as keyof T] ? "select-error" : ""
              }`}
              defaultValue={initialValues?.[field.name as keyof T] ?? ""}
            >
              <option value="" disabled>
                {field.placeholder || `Select ${field.label}`}
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              {...register(field.name as Path<T>, getRegisterOptions(field))}
              className={`input input-bordered w-full ${
                errors[field.name as keyof T] ? "input-error" : ""
              }`}
              placeholder={field.placeholder}
            />
          )}
          {errors[field.name as keyof T] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors[field.name as keyof T]?.message?.toString()}
              </span>
            </label>
          )}
        </div>
      ))}
      {externalError && (
        <div className="alert alert-error text-sm mb-2">{externalError}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || formSubmitting}
        className={`btn ${color ? color : "btn-primary"} w-full`}
      >
        {(isSubmitting || formSubmitting) && (
          <span className="loading loading-spinner"></span>
        )}
        {isSubmitting || formSubmitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
