import { motion } from "framer-motion";
import Add from "../../icons/add";
import { useState } from "react";
import { Column, Id } from "../../types";
import { v4 } from "uuid";
import ColumnContainer from "../Column/ColumnContainer";

function Board() {
  const [columns, setColumns] = useState<Column[]>([]);

  const generateNewColumn = () => {
    const columnToAdd: Column = {
      id: v4(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  return (
    <motion.div
      className="
        mt-[100px]
        mx-auto
        min-h-screen
        w-full
        flex
        flex-col
        overflow-x-auto
        overflow-y-hidden
        p-[40px]
        border-2
        rounded-md
      "
      transition={{ duration: 0.2 }}
      tabIndex={0}
    >
      <motion.div className="ml-auto">
        <motion.button
          onClick={() => {
            generateNewColumn();
          }}
          whileHover={{ scale: 1.01 }}
          className="
            bg-kanban-primary   
            h-[40px]
            min-w-[250px]
            w-[270px]
            cursor-pointer
            rounded-lg
            p-[10px]
            flex
            items-center
            gap-4
            ring-rose-500
            hover:ring-2

        "
          whileFocus={{ outline: "dashed #000" }}
        >
          <Add />
          Add Column
        </motion.button>
      </motion.div>
      <motion.div className="m-auto flex mt-[35px] gap-[15px] ">
        {columns.map((column) => (
          <ColumnContainer
            key={column.id}
            col={column}
            deleteColumn={deleteColumn}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Board;
