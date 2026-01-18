import React from 'react'
import { formatNumber } from '../utils/formatters'
import './SuspicionPanel.css'

export const SuspicionPanel = ({ suspicion, bribeCost, canBribe, onBribe, isFiscalAudit, auditTimeLeft }) => {
  const suspicionPercent = Math.min(100, Math.max(0, suspicion))
  const barClass = suspicionPercent >= 80 ? 'max-suspicion' : ''

  return (
    <div className="suspicion-panel">
      <div className="suspicion-header">
        <h3>⚠️ Suspicion du Fisc</h3>
        <button
          className={`bribe-button ${!canBribe ? 'disabled' : ''}`}
          onClick={onBribe}
          disabled={!canBribe}
        >
          💰 {formatNumber(bribeCost)} €
        </button>
      </div>
      <div className="suspicion-bar-container">
        <div 
          className={`suspicion-bar ${barClass}`}
          style={{ width: `${suspicionPercent}%` }}
        >
          <span>{suspicionPercent.toFixed(1)}%</span>
        </div>
      </div>
      {isFiscalAudit && (
        <div className="fiscal-audit-warning">
          ⚠️ CONTRÔLE FISCAL EN COURS ({Math.ceil(auditTimeLeft / 1000)}s)
        </div>
      )}
    </div>
  )
}

