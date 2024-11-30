import { motion } from "framer-motion";
import Add from "../../icons/add";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../../types";
import { v4 } from "uuid";
import ColumnContainer from "../Column/ColumnContainer";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "../Card/TaskCard";

const Board = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.col);
      return;
    }

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
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

    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over?.id;

    const isTaskActive = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    //Between tasks
    if (isTaskActive && isOverATask) {
      setTasks((prev) => {
        const oldIndex = prev.findIndex((task) => task.id === activeId);
        const newIndex = prev.findIndex((task) => task.id === overId);

        prev[oldIndex].columnId = prev[newIndex].columnId;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    //Over Columns
    const isOverAColumn = over.data.current?.type === "Column";

    if (isTaskActive && isOverAColumn) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[oldIndex].columnId = overId;

        return arrayMove(tasks, oldIndex, oldIndex);
      });
    }
  };
  //Updating the title
  const updateColumn = (id: Id, title: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === id) {
        col.title = title;
        return col;
      } else {
        return col;
      }
    });
    setColumns(updatedColumns);
  };

  // Fixing DeleteButton Not Working
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  //Creating a new Task
  const createTask = (columnId: Id) => {
    const newTask = {
      id: v4(),
      columnId: columnId,
      content: `Create a new task`,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: Id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const updateTask = (id: Id, content: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        task.content = content;
        return task;
      } else {
        return task;
      }
    });

    setTasks(updatedTasks);
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
        onDragOver={onDragOver}
      >
        <div className="m-auto flex mt-[35px] gap-[15px] ">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                col={column}
                id={column.id}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === column.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
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
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                updateTask={updateTask}
              />
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                content={activeTask.content}
                id={activeTask.id}
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
