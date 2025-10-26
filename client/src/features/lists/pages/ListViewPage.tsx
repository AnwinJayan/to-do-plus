import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchListById } from "../listApi";
import {
  fetchTasksByListId,
  updateTask,
  deleteTask,
  createTask,
} from "../../tasks/taskApi";
import { List } from "../listTypes";
import { Task } from "../../tasks/taskTypes";
import TaskList from "../../tasks/components/TaskList";
import TaskForm from "../../tasks/components/TaskForm";
import Loader from "../../common/components/Loader";
import GlobalErrorDisplay from "../../common/components/GlobalErrorDisplay";
import { FaPlus } from "react-icons/fa";

export default function ListViewPage() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<List | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [externalError, setExternalError] = useState<string | undefined>();
  const [taskInitialValues, setTaskInitialValues] = useState<{
    title?: string;
  }>({ title: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) return;
        const [listData, taskData] = await Promise.all([
          fetchListById(id),
          fetchTasksByListId(id),
        ]);
        setList(listData);
        setTasks(taskData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, completed } : t))
      );
    } catch (_err) {
      setError("Failed to update task.");
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      setIsDeleting(true);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (_err) {
      setError("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Accepts (taskId, newTitle)
  const handleEdit = async (taskId: string, newTitle: string) => {
    try {
      await updateTask(taskId, { title: newTitle });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, title: newTitle } : t))
      );
    } catch (_err) {
      setError("Failed to update task title.");
    }
  };

  const handleAddTask = async (data: { title: string }) => {
    if (!id) return;
    setIsSubmitting(true);
    setExternalError(undefined);
    try {
      console.log("Adding task:", { ...data, listId: id });
      await createTask({ ...data, listId: id });
      const updatedTasks = await fetchTasksByListId(id);
      setTasks(updatedTasks);
      // Clear the form after successful submission
      setTaskInitialValues({ title: "" });
    } catch (err: any) {
      console.error("Error adding task:", err);
      setExternalError(err.message || "Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // Return if dropped outside the list or at the same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    setIsReordering(true);
    try {
      // Optimistic UI update for a more responsive feel
      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks(reorderedTasks);

      // Update the position of the moved task in the backend
      await updateTask(draggableId, { position: destination.index });

      // Refetch the tasks to get the updated order from the server
    } catch (_err) {
      setError("Failed to update task position.");
      if (id) {
        const updatedTasks = await fetchTasksByListId(id);
        setTasks(updatedTasks);
      }
      // Revert to original order by refetching tasks
      if (id) {
        const originalTasks = await fetchTasksByListId(id);
        setTasks(originalTasks);
      }
    } finally {
      setIsReordering(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <GlobalErrorDisplay message={error} />;
  if (!list) return <p>List not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 h-full flex flex-col overflow-hidden">
      {/* Sticky header with title and add button */}
      <div
        className="flex rounded-md items-center gap-4 mb-4 sticky top-0 z-10 bg-base-100 p-2"
        style={{ boxShadow: "0 2px 8px -6px rgba(0,0,0,0.08)" }}
      >
        <h1 className="text-2xl font-bold flex-1 truncate" title={list.title}>
          {list.title}
        </h1>
        {!showForm && (
          <button
            className="btn btn-primary whitespace-nowrap"
            onClick={() => setShowForm(true)}
          >
            <FaPlus className="mr-2" /> Add Task
          </button>
        )}
      </div>
      {/* Task form appears below title row, also sticky */}
      {showForm && (
        <div
          className="mb-4 sticky top-[48px] z-10 bg-base-100 p-2"
          style={{ boxShadow: "0 2px 8px -6px rgba(0,0,0,0.04)" }}
        >
          <TaskForm
            onSubmit={async (data) => {
              await handleAddTask(data);
            }}
            isSubmitting={isSubmitting}
            externalError={externalError}
            initialValues={taskInitialValues}
          />
          <button
            className="btn btn-ghost mt-2"
            onClick={() => setShowForm(false)}
            type="button"
          >
            Hide
          </button>
        </div>
      )}
      {/* Scrollable task list area */}
      <div className="flex-1 overflow-y-auto p-2 rounded-xl shadow-lg bg-base-200 border border-primary/30 min-h-0 transition-all">
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDragEnd={onDragEnd}
          isReordering={isReordering}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
