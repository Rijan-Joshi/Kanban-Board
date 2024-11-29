import { motion } from "framer-motion";
import Add from "../../icons/add";
import { useMemo, useState } from "react";
import { Column, Id } from "../../types";
import { v4 } from "uuid";
import ColumnContainer from "../Column/ColumnContainer";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const Board = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column>();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  //Generating new column on clicking the add button
  const generateNewColumn = () => {
    const columnToAdd: Column = {
      id: v4(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
  };

  //Deleting the columns not required
  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  //Handling the start of the drag for drag overlay
  const handleDragStart = (e: DragStartEvent) => {
    console.log("Event", e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.col);
      return;
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    if (active.id === over?.id) return;

    if (active.id !== over?.id) {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((col) => col.id === active.id);
        const newIndex = prev.findIndex((col) => col.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Fixing DeleteButton Not Working

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

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
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="m-auto flex mt-[35px] gap-[15px] ">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                col={column}
                id={column.id}
                deleteColumn={deleteColumn}
              />
            ))}
          </SortableContext>
        </div>
        {/* Drag Overlay */}{" "}
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                col={activeColumn}
                id={activeColumn.id}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </motion.div>
  );
};

export default Board;
