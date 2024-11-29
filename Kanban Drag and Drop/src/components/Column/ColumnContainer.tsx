import { motion } from "framer-motion";
import { Column, Id } from "../../types";
import Trash from "../../icons/Trash";

interface Props {
  col: Column;
  deleteColumn: (id: Id) => void;
}

const ColumnContainer = ({ col, deleteColumn }: Props) => {
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
    >
      <motion.div className="flex gap-3 items-center mb-2">
        <div className="bg-gray-50 bg-opacity-5 rounded-full p-2 pt-1 pb-1 gap-1 flex items-center">
          <div className="w-3 h-3 rounded-full bg-current" />
          <div className="">Backlog</div>
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
