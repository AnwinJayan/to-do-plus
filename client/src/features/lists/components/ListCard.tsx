import { List } from "../listTypes";
import { Link } from "react-router-dom";
import {
  FaRegTrashAlt,
  FaStar,
  FaRegStar,
  FaSave,
  FaRegEye,
} from "react-icons/fa";
import { updateList } from "../listApi";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";

interface ListCardProps {
  list: List;
  onDelete: (listId: string) => void;
  onUpdate?: (updated: List) => void;
}

export default function ListCard({ list, onDelete, onUpdate }: ListCardProps) {
  const [favorited, setFavorited] = useState(list.isFavorited);
  const [toggling, setToggling] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [saving, setSaving] = useState(false);

  const handleFavorite = async () => {
    setToggling(true);
    try {
      await updateList(list._id, { isFavorited: !favorited });
      setFavorited((prev) => !prev);
      if (onUpdate) {
        onUpdate({ ...list, isFavorited: !favorited });
      }
    } catch (_err) {
      // Optionally show error toast
    } finally {
      setToggling(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditTitle(list.title);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === list.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateList(list._id, { title: editTitle.trim() });
      setEditing(false);
      if (onUpdate) {
        onUpdate({ ...list, title: editTitle.trim() });
      }
    } catch (_err) {
      // Optionally show error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 border border-base-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          {editing ? (
            <input
              className="input input-bordered input-sm flex-1 text-lg font-bold mb-0"
              style={{
                lineHeight: "1.25",
                height: "28px",
                minHeight: "unset",
                padding: "0 0.5rem",
              }}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={saving}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setEditing(false);
              }}
            />
          ) : (
            <h2
              className="card-title text-lg mb-0 flex-1 truncate"
              title={list.title}
              style={{ height: "28px", lineHeight: "28px" }}
            >
              {list.title}
            </h2>
          )}
          <button
            className="btn btn-ghost btn-sm px-2 flex items-center gap-1"
            onClick={handleFavorite}
            aria-label={favorited ? "Unfavorite" : "Favorite"}
            type="button"
            disabled={toggling}
            title={favorited ? "Unfavorite" : "Favorite"}
          >
            {favorited ? (
              <FaStar className="w-5 h-5 text-warning" />
            ) : (
              <FaRegStar className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <Link
            to={`/lists/${list._id}`}
            className="btn btn-sm btn-ghost btn-square"
            title="View list"
          >
            <FaRegEye className="w-5 h-5" />
          </Link>
          {editing ? (
            <button
              onClick={handleSave}
              className="btn btn-sm btn-success btn-square"
              title="Save"
              disabled={saving}
            >
              <FaSave className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="btn btn-sm btn-ghost btn-square"
              title="Edit list"
            >
              <LuPencil className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(list._id)}
            className="btn btn-sm btn-ghost btn-square text-error"
            title="Delete list"
          >
            <FaRegTrashAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
