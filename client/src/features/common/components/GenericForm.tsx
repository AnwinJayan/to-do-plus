import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useForm,
  FieldValues,
  Path,
  SubmitHandler,
  DefaultValues,
  RegisterOptions,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

export interface GenericFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "password" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[]; // For select
}

interface GenericFormProps<T extends FieldValues> {
  fields: GenericFieldConfig[];
  schema?: ZodType<T>;
  initialValues?: Partial<T>;
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
  isSubmitting?: boolean;
  color?: string;
  externalError?: string;
}

const getRegisterOptions = <T extends FieldValues>(
  field: GenericFieldConfig
): RegisterOptions<T, Path<T>> => {
  const options: RegisterOptions<T, Path<T>> = {};

  if (field.type === "number") {
    options.valueAsNumber = true;
  }

  return options;
};

export default function GenericForm<T extends FieldValues>({
  fields,
  schema,
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting,
  color,
  externalError,
}: GenericFormProps<T>) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues as DefaultValues<T>);
    }
  }, [initialValues, reset]);

  const togglePassword = (name: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log("Form submitted with data:", data);
        onSubmit(data);
      })}
      className="space-y-6"
    >
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
              {...register(field.name as Path<T>, getRegisterOptions<T>(field))}
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
