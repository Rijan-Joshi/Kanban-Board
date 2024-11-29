import { motion } from "framer-motion";
import { Column, Id } from "../../types";
import Trash from "../../icons/Trash";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Props {
  col: Column;
  deleteColumn: (id: Id) => void;
  id: Id;
}

const ColumnContainer = ({ col, deleteColumn, id }: Props) => {
  const [editing, setEditing] = useState<boolean>(false);

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
        bg-slate-100
        bg-opacity-5
        h-auto
        w-[350px]
        max-h-[500px]
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
    >
      <motion.div className="flex gap-3 items-center mb-2">
        <div className="bg-gray-50 bg-opacity-5 rounded-full p-2 pt-1 pb-1 gap-1 flex items-center">
          <div className="w-3 h-3 rounded-full bg-current" />
          <div className="title">Backlog</div>
        </div>
        <div>2</div>

        <motion.button
          onClick={() => deleteColumn(col.id)}
          className="flex items-center ml-auto cursor-pointer hover:bg-gray-50 hover:bg-opacity-5 hover:p-2 hover:rounded-md"
        >
          <Trash />
        </motion.button>
      </motion.div>
      <motion.div className="flex flex-grow"> Cards </motion.div>
      <motion.div> Footer </motion.div>
    </motion.div>
  );
};

export default ColumnContainer;
