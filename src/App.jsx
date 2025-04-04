import './App.css'
import Header from './components/Header'
import Board from './components/Board'
import EditTaskModal from './components/EditTaskModal'
import { BoardProvider } from './context/BoardContext'

function App() {
  return (
    <BoardProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Board />
        </main>
        <EditTaskModal />
      </div>
    </BoardProvider>
  )
}

export default App
