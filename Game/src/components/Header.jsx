import React from 'react'
import { formatNumber } from '../utils/formatters'

export const Header = ({ money, revenuePerSecond, renaissanceCount, renaissanceBoost, onRenaissance }) => {
  const nextBoost = Math.pow(renaissanceBoost, renaissanceCount + 1)

  return (
    <header className="header">
      <h1>🏝️ Panama Clicker</h1>
      <button 
        className="reset-button"
        onClick={onRenaissance}
      >
        🔄 Renaissance (x{nextBoost.toFixed(2)})
      </button>
      <div className="score-display">
        <div className="money-display">
          <span>{formatNumber(money)}</span> €
        </div>
        <div className="rps-display">
          + <span>{formatNumber(revenuePerSecond)}</span> €/sec
        </div>
      </div>
    </header>
  )
}

