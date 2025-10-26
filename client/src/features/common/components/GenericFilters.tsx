import { useState } from "react";
import Modal from "./Modal";
import { IoFunnelOutline } from "react-icons/io5";

type FilterFieldType = "text" | "number" | "select" | "toggle"; // Added "toggle"

interface FilterFieldConfig {
  key: string;
  label?: string;
  type: FilterFieldType;
  value: any;
  onChange: (val: any) => void;
  placeholder?: string;
  options?: { label: string; value: any }[];
}

interface GenericFiltersProps {
  fields: FilterFieldConfig[];
  className?: string;
  validate?: () => void;
  onSearch?: () => void;
  onReset?: () => void;
}

export default function GenericFilters({
  fields,
  className,
  validate,
  onSearch,
  onReset,
}: GenericFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
    setIsModalOpen(false);
  };

  const handleReset = () => {
    onReset?.();
  };

  const filterForm = (
    <form className="flex flex-wrap gap-4 items-end" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const id = `filter-${field.key}`;
        return (
          <div
            key={field.key}
            className="form-control min-w-[160px] flex-1 max-w-xs"
          >
            {field.label && (
              <label htmlFor={id} className="label cursor-pointer">
                <span className="label-text">{field.label}</span>
              </label>
            )}
            {field.type === "select" ? (
              <select
                id={id}
                className="select select-bordered w-full"
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  validate?.();
                }}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "toggle" ? (
              <input
                id={id}
                type="checkbox"
                className="toggle toggle-primary"
                checked={!!field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  validate?.();
                }}
              />
            ) : (
              <input
                id={id}
                type={field.type}
                placeholder={field.placeholder}
                min={field.type === "number" ? 0 : undefined}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(
                    field.type === "number"
                      ? Math.max(0, Number(e.target.value))
                      : e.target.value
                  );
                  validate?.();
                }}
                className="input input-bordered w-full"
              />
            )}
          </div>
        );
      })}

      <div className="flex gap-2 mb-1">
        {onReset && (
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline btn-sm"
          >
            Reset
          </button>
        )}
        <button type="submit" className="btn btn-neutral btn-sm">
          Apply Filters
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className={`md:hidden ${className ?? ""}`}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-outline btn-sm w-full gap-2"
        >
          <IoFunnelOutline className="w-4 h-4" />
          Filters
        </button>
      </div>
      <div className={`hidden md:block ${className ?? ""}`}>{filterForm}</div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Filters"
        widthClass="w-[90%] max-w-md"
      >
        {filterForm}
      </Modal>
    </>
  );
}
