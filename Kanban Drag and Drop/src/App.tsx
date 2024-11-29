import "./App.css";
import Board from "./components/Board/board";

function App() {
  return (
    <>
      <div className="min-h-screen pl-10 pr-10">
        <header className="p-4 shadow-md shadow-gray mb-6">
          <h1 className="text-2xl font-bold text-center">Vrit Kanban Board</h1>
        </header>
        <Board />
      </div>
    </>
  );
}

export default App;
