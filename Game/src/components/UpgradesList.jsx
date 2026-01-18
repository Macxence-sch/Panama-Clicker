import React, { useState } from 'react'
import { GAME_DATA } from '../data/gameData'
import { formatNumber, formatRevenue } from '../utils/formatters'
import './UpgradesList.css'

export const UpgradesList = ({ ownedUpgrades, money, getUpgradeCost, onBuyUpgrade }) => {
  const [hoveredUpgrade, setHoveredUpgrade] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Calcule le revenu réel d'un upgrade en tenant compte des possessions et de l'augmentation de 5%
  const getUpgradeRevenue = (upgrade, quantity) => {
    if (!upgrade.revenuePerSecond || quantity === 0) return 0
    
    let totalRevenue = 0
    for (let i = 0; i < quantity; i++) {
      const multiplier = Math.pow(1.05, i) // 1.05^0 = 1, 1.05^1 = 1.05, 1.05^2 = 1.1025, etc.
      totalRevenue += upgrade.revenuePerSecond * multiplier
    }
    return totalRevenue
  }

  // Calcule le revenu du prochain achat
  const getNextUpgradeRevenue = (upgrade, quantity) => {
    if (!upgrade.revenuePerSecond) return 0
    const multiplier = Math.pow(1.05, quantity) // Le prochain aura ce multiplicateur
    return upgrade.revenuePerSecond * multiplier
  }

  // Calcule la valeur de clic totale d'un upgrade en tenant compte des possessions et de l'augmentation de 5%
  const getUpgradeClickValue = (upgrade, quantity) => {
    if (!upgrade.clickValueIncrease || quantity === 0) return 0
    
    let totalClickIncrease = 0
    for (let i = 0; i < quantity; i++) {
      const multiplier = Math.pow(1.05, i) // 1.05^0 = 1, 1.05^1 = 1.05, 1.05^2 = 1.1025, etc.
      totalClickIncrease += upgrade.clickValueIncrease * multiplier
    }
    return totalClickIncrease
  }

  // Calcule la valeur de clic du prochain achat
  const getNextUpgradeClickValue = (upgrade, quantity) => {
    if (!upgrade.clickValueIncrease) return 0
    const multiplier = Math.pow(1.05, quantity) // Le prochain aura ce multiplicateur
    return upgrade.clickValueIncrease * multiplier
  }

  const handleMouseEnter = (e, upgrade) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const scrollX = window.scrollX || window.pageXOffset
    
    // Positionner le tooltip au-dessus de l'élément, centré horizontalement
    let x = rect.left + scrollX + rect.width / 2
    let y = rect.top + scrollY - 10
    
    // Ajuster si le tooltip sort de l'écran à droite ou à gauche
    const tooltipWidth = 300 // Largeur approximative du tooltip
    if (x + tooltipWidth / 2 > window.innerWidth + scrollX) {
      x = window.innerWidth + scrollX - tooltipWidth / 2 - 10
    }
    if (x - tooltipWidth / 2 < scrollX) {
      x = scrollX + tooltipWidth / 2 + 10
    }
    
    setTooltipPosition({ x, y })
    setHoveredUpgrade(upgrade)
  }

  const handleMouseLeave = () => {
    setHoveredUpgrade(null)
  }

  return (
    <>
      <div className="investments-section">
        <h2>💼 Investissements Douteux</h2>
        <div className="upgrades-list">
          {GAME_DATA.UPGRADES.map(upgrade => {
            const cost = getUpgradeCost(upgrade.id)
            const quantity = ownedUpgrades[upgrade.id] || 0
            const canAfford = money >= cost

            return (
              <div
                key={upgrade.id}
                className={`upgrade-item ${!canAfford ? 'disabled' : ''}`}
                onClick={() => canAfford && onBuyUpgrade(upgrade.id)}
                onMouseEnter={(e) => handleMouseEnter(e, upgrade)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={(e) => {
                  if (hoveredUpgrade?.id === upgrade.id) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const scrollY = window.scrollY || window.pageYOffset
                    const scrollX = window.scrollX || window.pageXOffset
                    setTooltipPosition({
                      x: rect.left + scrollX + rect.width / 2,
                      y: rect.top + scrollY - 10
                    })
                  }
                }}
              >
                <div className="upgrade-icon">{upgrade.emoji}</div>
                <div className="upgrade-content">
                  <div className="upgrade-name">{upgrade.name}</div>
                  <div className="upgrade-cost">
                    <span className="cost-icon">💰</span>
                    <span className="cost-amount">{formatNumber(cost)} €</span>
                  </div>
                </div>
                <div className="upgrade-quantity">{quantity}</div>
              </div>
            )
          })}
        </div>
      </div>

      {hoveredUpgrade && (
        <div
          className="upgrade-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
          onMouseEnter={() => setHoveredUpgrade(hoveredUpgrade)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="tooltip-header">
            <span className="tooltip-emoji">{hoveredUpgrade.emoji}</span>
            <h4 className="tooltip-name">{hoveredUpgrade.name}</h4>
          </div>
                  <p className="tooltip-description">{hoveredUpgrade.description}</p>
                  <div className="tooltip-stats">
                    {hoveredUpgrade.type === 'click_upgrade' ? (
                      <>
                        <div className="tooltip-stat">
                          <span className="stat-label">Valeur totale:</span>
                          <span className="stat-value">+{formatNumber(getUpgradeClickValue(hoveredUpgrade, ownedUpgrades[hoveredUpgrade.id] || 0))} / click</span>
                        </div>
                        <div className="tooltip-stat">
                          <span className="stat-label">Valeur de base:</span>
                          <span className="stat-value">+{hoveredUpgrade.clickValueIncrease} / click</span>
                        </div>
                        {ownedUpgrades[hoveredUpgrade.id] > 0 && (
                          <div className="tooltip-stat">
                            <span className="stat-label">Prochain ajoutera:</span>
                            <span className="stat-value">+{formatNumber(getNextUpgradeClickValue(hoveredUpgrade, ownedUpgrades[hoveredUpgrade.id]))} / click</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="tooltip-stat">
                          <span className="stat-label">Revenu total:</span>
                          <span className="stat-value">{formatRevenue(getUpgradeRevenue(hoveredUpgrade, ownedUpgrades[hoveredUpgrade.id] || 0))} €/sec</span>
                        </div>
                        <div className="tooltip-stat">
                          <span className="stat-label">Revenu de base:</span>
                          <span className="stat-value">{formatRevenue(hoveredUpgrade.revenuePerSecond)} €/sec</span>
                        </div>
                        {ownedUpgrades[hoveredUpgrade.id] > 0 && (
                          <div className="tooltip-stat">
                            <span className="stat-label">Prochain rapportera:</span>
                            <span className="stat-value">{formatRevenue(getNextUpgradeRevenue(hoveredUpgrade, ownedUpgrades[hoveredUpgrade.id]))} €/sec</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="tooltip-stat">
                      <span className="stat-label">Possédé:</span>
                      <span className="stat-value">{ownedUpgrades[hoveredUpgrade.id] || 0}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span className="stat-label">Coût:</span>
                      <span className="stat-value">{formatNumber(getUpgradeCost(hoveredUpgrade.id))} €</span>
                    </div>
                  </div>
        </div>
      )}
    </>
  )
}

