import { Draggable } from "react-beautiful-dnd";
import { Task } from "../taskTypes";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import { memo, useState, useEffect } from "react";

interface TaskItemProps {
  task: Task;
  index: number;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void | Promise<void>;
  isDeleting?: boolean;
}

function getResponsiveMaxLen() {
  if (typeof window === "undefined") return 60;
  const width = window.innerWidth;
  if (width < 480) return 20; // mobile
  if (width < 768) return 40; // tablet
  if (width < 1024) return 50; // small desktop
  return 60; // large desktop
}

function TaskItem({
  task,
  index,
  onToggleComplete,
  onDelete,
  onEdit,
  isDeleting,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxLen, setMaxLen] = useState(getResponsiveMaxLen());

  // Update maxLen on resize

  useEffect(() => {
    function handleResize() {
      setMaxLen(getResponsiveMaxLen());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);

  const isLongText = task.title.length > maxLen || task.title.includes("\n");
  const shouldShowToggle = isLongText;

  const displayTitle =
    shouldShowToggle && !isExpanded
      ? task.title.substring(0, maxLen) + "..."
      : task.title;

  const handleEdit = () => {
    setEditing(true);
    setEditTitle(task.title);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onEdit(task._id, editTitle.trim());
      setEditing(false);
    } catch (_err) {
      // Optionally show error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
          className={`flex items-start gap-3 p-3 bg-base-100 rounded shadow border ${
            snapshot.isDragging
              ? "ring-2 ring-primary shadow-lg opacity-90 scale-102"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, !task.completed)}
            className="checkbox checkbox-primary mt-1 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {editing ? (
              <textarea
                className={`textarea textarea-bordered textarea-xs flex-1 mb-0 resize-vertical ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  padding: "0.25rem 0.5rem",
                  fontSize: maxLen <= 40 ? "0.75rem" : "0.875rem",
                  lineHeight: "1.4",
                }}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={saving}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
                rows={2}
              />
            ) : (
              <span
                className={`block ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                <span
                  className={`whitespace-pre-wrap break-words ${
                    maxLen <= 40 ? "text-xs" : "text-sm"
                  }`}
                >
                  {displayTitle}
                </span>
                {shouldShowToggle && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-xs text-primary hover:underline focus:outline-none"
                  >
                    {isExpanded ? "less" : "more"}
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {editing ? (
              <button
                onClick={handleSave}
                className="btn btn-xs btn-success btn-square"
                title="Save"
                disabled={saving}
              >
                <FaSave className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="btn btn-xs btn-ghost"
                title="Edit"
              >
                <LuPencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(task._id)}
              className={`btn btn-xs btn-ghost ${
                isDeleting
                  ? "text-gray-400 opacity-50 cursor-not-allowed"
                  : "text-error"
              }`}
              title="Delete"
              disabled={isDeleting}
            >
              <FaRegTrashAlt className="w-4 h-4" />
            </button>
            <span
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing select-none px-2 text-gray-400 hover:text-primary"
              title="Drag to reorder"
              aria-label="Drag to reorder"
            >
              <MdDragIndicator className="w-5 h-5" />
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default memo(TaskItem, (prevProps, nextProps) => {
  return (
    prevProps.task._id === nextProps.task._id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.index === nextProps.index &&
    prevProps.isDeleting === nextProps.isDeleting
  );
});
