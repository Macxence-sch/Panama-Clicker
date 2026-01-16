import React, { useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { Header } from './components/Header'
import { Clicker } from './components/Clicker'
import { SuspicionPanel } from './components/SuspicionPanel'
import { UpgradesList } from './components/UpgradesList'
import { MultiplierUpgrades } from './components/MultiplierUpgrades'
import { Leaderboard } from './components/Leaderboard'
import { PlayerNameModal } from './components/PlayerNameModal'
import { storage } from './services/storage'
import { GAME_DATA } from './data/gameData'
import './App.css'

function App() {
  const gameState = useGameState()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerName, setPlayerName] = useState(storage.getPlayerName())
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleRenaissance = () => {
    const currentBoost = Math.pow(gameState.renaissanceBoost, gameState.renaissanceCount)
    const nextBoost = Math.pow(gameState.renaissanceBoost, gameState.renaissanceCount + 1)
    if (window.confirm(
      `Voulez-vous effectuer une Renaissance ? Vous perdrez votre progression mais gagnerez un boost permanent de x${gameState.renaissanceBoost} (x${nextBoost.toFixed(2)} total).`
    )) {
      gameState.performRenaissance()
      showNotification('Renaissance effectuée !', 'success')
    }
  }

  const handleBuyMultiplierUpgrade = (upgradeId) => {
    const result = gameState.buyMultiplierUpgrade(upgradeId)
    if (result.message) {
      showNotification(result.message, result.success ? 'success' : result.lostMoney ? 'error' : 'warning')
    }
  }

  const handleSubmitScore = (message, type) => {
    showNotification(message, type)
  }

  const effectiveRPS = gameState.getEffectiveRevenuePerSecond()
  const auditTimeLeft = gameState.isFiscalAudit 
    ? Math.max(0, gameState.fiscalAuditEndTime - Date.now())
    : 0

  return (
    <div className="app">
      <Header
        money={gameState.money}
        revenuePerSecond={effectiveRPS}
        renaissanceCount={gameState.renaissanceCount}
        renaissanceBoost={gameState.renaissanceBoost}
        onRenaissance={handleRenaissance}
      />

      <main className="game-container">
        <section className="click-zone">
          <Clicker
            clickValue={gameState.getEffectiveClickValue()}
            onClick={gameState.handleClick}
          />
          <SuspicionPanel
            suspicion={gameState.suspicion}
            bribeCost={gameState.getBribeCost()}
            canBribe={gameState.money >= gameState.getBribeCost()}
            onBribe={() => {
              if (gameState.bribeInspector()) {
                showNotification('Inspecteur soudoyé !', 'success')
              }
            }}
            isFiscalAudit={gameState.isFiscalAudit}
            auditTimeLeft={auditTimeLeft}
          />
        </section>

        <section className="upgrades-panel">
          <MultiplierUpgrades
            ownedMultiplierUpgrades={gameState.ownedMultiplierUpgrades}
            money={gameState.money}
            onBuyMultiplierUpgrade={handleBuyMultiplierUpgrade}
          />
          <UpgradesList
            ownedUpgrades={gameState.ownedUpgrades}
            money={gameState.money}
            getUpgradeCost={gameState.getUpgradeCost}
            onBuyUpgrade={(id) => {
              if (gameState.buyUpgrade(id)) {
                showNotification('Achat réussi !', 'success')
              }
            }}
          />
        </section>
      </main>

      <button
        className="open-leaderboard-button"
        onClick={() => setShowLeaderboard(true)}
      >
        🏆
      </button>

      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        playerName={playerName}
        money={gameState.money}
        renaissanceCount={gameState.renaissanceCount}
        onSubmitScore={handleSubmitScore}
      />

      <PlayerNameModal
        onSave={(name) => {
          setPlayerName(name)
          showNotification('Nom enregistré !', 'success')
        }}
      />

      {notification && (
        <div className={`notification notification-${notification.type} show`}>
          {notification.message}
        </div>
      )}

      {gameState.isFiscalAudit && (
        <div className="fiscal-audit-alert">
          CONTRÔLE FISCAL EN COURS ({Math.ceil(auditTimeLeft / 1000)}s)
        </div>
      )}
    </div>
  )
}

export default App

