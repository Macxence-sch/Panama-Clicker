import React from 'react'
import { formatNumber } from '../utils/formatters'

export const Header = ({ money, revenuePerSecond, renaissanceCount, renaissanceBoost, onRenaissance, onResetStorage }) => {
  const nextBoost = Math.pow(renaissanceBoost, renaissanceCount + 1)

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1>🏝️ Panama Clicker</h1>
        <button 
          className="reset-storage-button"
          onClick={onResetStorage}
          title="Réinitialiser le localStorage"
          style={{
            padding: '5px 10px',
            backgroundColor: '#8b0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🗑️ Reset
        </button>
      </div>
      <button 
        className="reset-button"
        onClick={onRenaissance}
        disabled
        style={{ opacity: 0.5, cursor: 'not-allowed' }}
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

