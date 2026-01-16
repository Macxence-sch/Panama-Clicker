import React from 'react'
import { formatNumber } from '../utils/formatters'
import './SuspicionPanel.css'

export const SuspicionPanel = ({ suspicion, bribeCost, canBribe, onBribe, isFiscalAudit, auditTimeLeft }) => {
  const suspicionPercent = Math.floor(suspicion)
  const barClass = suspicionPercent >= 80 ? 'max-suspicion' : ''

  return (
    <div className="suspicion-panel">
      <h3>⚠️ Suspicion du Fisc</h3>
      <div className="suspicion-bar-container">
        <div 
          className={`suspicion-bar ${barClass}`}
          style={{ width: `${suspicionPercent}%` }}
        >
          <span>{suspicionPercent}%</span>
        </div>
      </div>
      <button
        className={`bribe-button ${!canBribe ? 'disabled' : ''}`}
        onClick={onBribe}
        disabled={!canBribe}
      >
        💰 Soudoyer un inspecteur
        <small>{formatNumber(bribeCost)} €</small>
      </button>
      {isFiscalAudit && (
        <div className="fiscal-audit-warning">
          ⚠️ CONTRÔLE FISCAL EN COURS ({Math.ceil(auditTimeLeft / 1000)}s)
        </div>
      )}
    </div>
  )
}

