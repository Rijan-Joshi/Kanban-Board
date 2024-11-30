import { motion } from "framer-motion";
import { Column, Id, Task } from "../../types";
import Trash from "../../icons/Trash";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Adding from "../../icons/Adding";
import TaskCard from "../Card/TaskCard";

interface Props {
  id: Id;
  col: Column;
  deleteColumn: (id: Id) => void;
  deleteTask: (id: Id) => void;
  updateColumn: (id: Id, val: string) => void;
  createTask: (ColumnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

const ColumnContainer = ({
  col,
  deleteColumn,
  id,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const activeIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

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
      type: "Column",
      col,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <motion.div
        className="
        bg-slate-100
        bg-opacity-5
        h-auto
        w-[350px]
        max-h-[500px]
        border-2
        border-gray-100
        rounded-md
        flex
        flex-col
        gap-3
        p-2
    "
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      ></motion.div>
    );
  }

  return (
    <motion.div
      className="
        h-auto
        w-[350px]
        max-h-[500px]
        
        flex
        flex-col
        gap-3
        p-2
    "
      ref={setNodeRef}
      style={style}
    >
      <motion.div
        className="flex bg-slate-100
        bg-opacity-5 p-2 rounded-md gap-3 items-center mb-2"
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
      >
        <div className="bg-gray-50 bg-opacity-5 rounded-full p-3 pt-1 pb-1 gap-1 flex items-center">
          <div className="w-3 h-3 rounded-full bg-current" />
          <div className="title pl-2">
            {!editMode ? (
              col.title
            ) : (
              <input
                className="bg-transparent outline-none w-[60%]"
                autoFocus
                onChange={(e) => updateColumn(col.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
                onBlur={() => setEditMode(false)}
              />
            )}
          </div>
        </div>
        <div>{tasks.length}</div>

        <motion.button
          onClick={() => deleteColumn(col.id)}
          className=" flex items-center ml-auto cursor-pointer hover:bg-gray-50 hover:bg-opacity-5 hover:p-2 hover:rounded-md"
        >
          <Trash />
        </motion.button>
      </motion.div>
      <motion.div
        className=" bg-slate-100
        bg-opacity-5 p-2 pt-[25px] h-[500px] max-h-[600px] rounded-md flex flex-grow overflow-auto flex-col gap-4"
      >
        <SortableContext items={activeIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              id={task.id}
              content={task.content}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </motion.div>

      <motion.button
        className="inline-flex max-w-fit gap-3 p-[5px] pl-2 rounded-md cursor-pointer hover:bg-gray-50 hover:bg-opacity-5 hover:border-2 hover:border-white"
        onClick={() => createTask(id)}
      >
        <Adding />
        Add Task
      </motion.button>
    </motion.div>
  );
};

export default ColumnContainer;
