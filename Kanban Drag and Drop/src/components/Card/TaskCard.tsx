import { motion } from "framer-motion";
import { Id, Task } from "../../types";
import Trash from "../../icons/Trash";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: Id;
  task: Task;
  content: string;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, val: string) => void;
}

const TaskCard = ({ content, id, task, deleteTask, updateTask }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        className="relative min-h-20 shadow-sm shadow-gray-60 p-4 rounded-lg cursor-pointer border-2 border-gray-100"
        onDoubleClick={() => setEditMode(true)}
        onHoverStart={() => setIsDeleteVisible(true)}
        onHoverEnd={() => setIsDeleteVisible(false)}
        {...attributes}
        {...listeners}
      ></motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="relative h-24 shadow-sm shadow-gray-600 p-4 rounded-lg cursor-pointer"
      onDoubleClick={() => setEditMode(true)}
      onHoverStart={() => setIsDeleteVisible(true)}
      onHoverEnd={() => setIsDeleteVisible(false)}
      {...attributes}
      {...listeners}
    >
      <div className="w-full whitespace-pre-wrap break-words h-full overflow-y-auto">
        {editMode ? (
          <textarea
            value={content}
            placeholder="Note your new task"
            className="bg-inherit resize-none outline-none w-full max-w-full h-full"
            onChange={(e) => updateTask(id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
            onBlur={() => setEditMode(false)}
          ></textarea>
        ) : (
          content
        )}
      </div>
      <div
        className={`absolute right-4 top-[50%] translate-y-[-50%] p-2 hover:bg-slate-700 rounded-lg ${
          !isDeleteVisible && "hidden"
        }`}
        onClick={() => {
          deleteTask(id);
        }}
      >
        <Trash />
      </div>
    </motion.div>
  );
};

export default TaskCard;
