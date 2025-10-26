import { useEffect, useState } from "react";
import { fetchLists, deleteList } from "../listApi";
import { List } from "../listTypes";
import ListCard from "../components/ListCard";
import FilterControls from "../components/FilterControls";
import Loader from "../../common/components/Loader";
import GlobalErrorDisplay from "../../common/components/GlobalErrorDisplay";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";

export default function ListListPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    sort?: string;
  }>({ sort: "-created_at" });
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Height of navbar (fixed at 64px)
  const NAVBAR_HEIGHT = 64;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiFilters = {
          ...filters,
          ...(favoritesOnly ? { isFavorited: true } : {}),
        };
        const data = await fetchLists(apiFilters);
        setLists(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, favoritesOnly]);

  const handleDelete = async (listId: string) => {
    setConfirmDeleteId(listId);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteList(confirmDeleteId);
      setLists((prev) => prev.filter((l) => l._id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (_err) {
      setError("Failed to delete list.");
      setConfirmDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // New: handle update for a single list
  const handleUpdate = (updated: List) => {
    setLists((prev) =>
      prev.map((l) => (l._id === updated._id ? { ...l, ...updated } : l))
    );
  };

  return (
    <div
      className="max-w-4xl -my-3 mx-auto px-4 h-full flex flex-col"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      {/* Sticky filter bar */}
      <div
        className="z-10 sticky top-0 pt-4 pb-2 flex flex-wrap gap-4 items-center justify-between border-b border-base-200"
        style={{
          minHeight: "4.5rem",
          top: 0,
          zIndex: 20,
        }}
      >
        <FilterControls
          onApply={setFilters}
          initialSearch={filters.search}
          initialSort={filters.sort}
        />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          <span className="text-sm">Favorites Only</span>
        </label>
      </div>

      {/* Scrollable list area */}
      <div
        className="flex-1 min-h-0 overflow-y-auto my-6 rounded-md border border-primary/30"
        style={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px - 72px)`, // 72px = filter bar height + padding
        }}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <GlobalErrorDisplay message={error} />
        ) : lists.length === 0 ? (
          <p className="text-gray-500">No lists found.</p>
        ) : (
          <div className="grid grid-cols-1 p-2 md:grid-cols-2 gap-4">
            {lists.map((list) => (
              <ListCard
                key={list._id}
                list={list}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!confirmDeleteId}
        title="Delete List"
        message="Are you sure you want to delete this list? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
