// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils'

const initialSquares = Array(9).fill(null)
const historyKey = 'tic-tac-toe:history'
const stepKey = 'tic-tac-toe:step'

function Board({onClick, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState(historyKey, [initialSquares])
  const [currentStep, setCurrentStep] = useLocalStorageState(stepKey,0)
  const currentSquares = history[currentStep]

  console.log('Current squares', currentSquares)
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    console.log('Square Clicked: ', square)
    if (winner || currentSquares[square]) {
      return 
    }

    let historyCopy = [...history]
    let squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    historyCopy.push(squaresCopy)

    setHistory(historyCopy)
    setCurrentStep(currentStep+1)
  }

  function restart() {
    setHistory([initialSquares])
    setCurrentStep(0)
  }

  const moves = history.map((history, step) => {
    const desc = step ? `Go to move #${step}` : 'Go to game start'
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })  

  return (
    <div className="game">
    <div className="game-board">
      <Board onClick={selectSquare} squares={currentSquares} />
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
    <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol> 
    </div>
  </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
