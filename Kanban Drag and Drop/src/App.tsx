import './App.css'
import Board from './components/Board/board'

function App() {
  return (
    <>
      <div className='min-h-screen bg-gray-100'>
      <header className="p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Vrit Kanban Board</h1>
        </header>
        <Board />
      </div>
    </>
  )
}

export default App
