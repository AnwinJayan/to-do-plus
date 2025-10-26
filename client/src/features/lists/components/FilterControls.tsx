import GenericFilters from "../../common/components/GenericFilters";
import { useState } from "react";

interface filteControlProps {
  onApply: (params: { search?: string; sort?: string }) => void;
  initialSearch?: string;
  initialSort?: string;
}

export default function FilterControls({
  onApply,
  initialSearch = "",
  initialSort = "-created_at",
}: filteControlProps) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);

  return (
    <GenericFilters
      fields={[
        {
          key: "search",
          label: "Search",
          type: "text",
          value: search,
          onChange: setSearch,
          placeholder: "Search by title",
        },
        {
          key: "sort",
          label: "Sort",
          type: "select",
          value: sort,
          onChange: setSort,
          options: [
            { label: "Newest", value: "-created_at" },
            { label: "Oldest", value: "created_at" },
            { label: "A-Z", value: "title" },
            { label: "Z-A", value: "-title" },
          ],
        },
      ]}
      onSearch={() => onApply({ search, sort })}
    />
  );
}
