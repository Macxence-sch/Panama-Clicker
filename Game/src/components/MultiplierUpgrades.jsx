import React, { useState } from 'react'
import { GAME_DATA } from '../data/gameData'
import { formatNumber } from '../utils/formatters'
import './MultiplierUpgrades.css'

export const MultiplierUpgrades = ({ ownedMultiplierUpgrades, money, onBuyMultiplierUpgrade }) => {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="multiplier-upgrades-section">
      <h3>⚖️ Tactiques Juridiques</h3>
      <div className="multiplier-upgrades-list">
        {GAME_DATA.MULTIPLIER_UPGRADES.map(upgrade => {
          const isOwned = upgrade.type !== 'special_risk' && ownedMultiplierUpgrades[upgrade.id]
          const canAfford = money >= upgrade.baseCost
          const isDisabled = isOwned || !canAfford

          return (
            <div key={upgrade.id} className="multiplier-upgrade-item">
              <button
                className={`multiplier-icon-button ${isOwned ? 'owned' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => onBuyMultiplierUpgrade(upgrade.id)}
                disabled={isDisabled}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setTooltip({
                    id: upgrade.id,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 5
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <div className="multiplier-icon">
                  <span className="multiplier-emoji">{upgrade.emoji}</span>
                </div>
              </button>

              {tooltip?.id === upgrade.id && (
                <div
                  className="multiplier-tooltip"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`
                  }}
                  onMouseEnter={() => setTooltip({ ...tooltip })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="tooltip-header">
                    <span className="tooltip-emoji">{upgrade.emoji}</span>
                    <h4 className="tooltip-name">{upgrade.name}</h4>
                  </div>
                  <p className="tooltip-description">{upgrade.description}</p>
                  <div className="tooltip-cost">
                    Coût: {formatNumber(upgrade.baseCost)} €
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

