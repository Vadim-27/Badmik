import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface SortableHeaderTableProps<T> {  
  field: keyof T;
  label: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  onToggle: (field: keyof T) => void;
}

export default function SortableHeaderTable<T>({
  field,
  label,
  sortField,
  sortOrder,
  onToggle,
}: SortableHeaderTableProps<T>){
  const isActive = sortField === field;

  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      <Tooltip title="Сортувати">
        <IconButton
          size="small"
          onClick={() => onToggle(field)}
          className="hover:bg-gray-200"
        >
          {isActive ? (
            sortOrder === "asc" ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )
          ) : (
            <ArrowUpward fontSize="small" style={{ opacity: 0.3 }} /> // неактивна іконка
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
}
