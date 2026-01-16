import React from 'react'
import { GAME_DATA } from '../data/gameData'
import { formatNumber, formatRevenue } from '../utils/formatters'
import './UpgradesList.css'

export const UpgradesList = ({ ownedUpgrades, money, getUpgradeCost, onBuyUpgrade }) => {
  return (
    <div className="investments-section">
      <h2>💼 Investissements Douteux</h2>
      <div className="upgrades-list">
        {GAME_DATA.UPGRADES.map(upgrade => {
          const cost = getUpgradeCost(upgrade.id)
          const quantity = ownedUpgrades[upgrade.id] || 0
          const canAfford = money >= cost

          return (
            <div key={upgrade.id} className="upgrade-item">
              <div className="upgrade-header">
                <span className="upgrade-emoji">{upgrade.emoji}</span>
                <div className="upgrade-info">
                  <h3 className="upgrade-name">{upgrade.name}</h3>
                  <p className="upgrade-description">{upgrade.description}</p>
                </div>
              </div>
              <div className="upgrade-stats">
                <div className="upgrade-stat">
                  <span className="stat-label">Revenu:</span>
                  <span className="stat-value">+{formatRevenue(upgrade.revenuePerSecond)} €/sec</span>
                </div>
                <div className="upgrade-stat">
                  <span className="stat-label">Possédé:</span>
                  <span className="stat-value">{quantity}</span>
                </div>
              </div>
              <button
                className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}
                onClick={() => onBuyUpgrade(upgrade.id)}
                disabled={!canAfford}
              >
                <span className="button-cost">{formatNumber(cost)}</span> €
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

