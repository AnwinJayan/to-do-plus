import TaskItem from "./TaskItem";
import { Task } from "../taskTypes";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { memo } from "react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void | Promise<void>;
  onDragEnd: (result: any) => void;
  isReordering?: boolean;
  isDeleting?: boolean;
}

function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onDragEnd,
  isReordering,
  isDeleting = false,
}: TaskListProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="task-list"
        direction="vertical"
        isDropDisabled={isReordering}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
        type="TASK"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 ${isReordering ? "opacity-80" : ""}`}
          >
            {tasks.map((task, idx) => (
              <TaskItem
                key={task._id}
                task={task}
                index={idx}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                isDeleting={isDeleting}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// Memoize the TaskList component for better performance
export default memo(TaskList);
