import React, { useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { Header } from './components/Header'
import { Clicker } from './components/Clicker'
import { SuspicionPanel } from './components/SuspicionPanel'
import { UpgradesList } from './components/UpgradesList'
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

  // Exposer une fonction de test globale pour le débogage
  useEffect(() => {
    window.testPanamaStorage = () => {
      console.log('🧪 TEST MANUEL DU LOCALSTORAGE')
      console.log('==============================')
      
      // Test 1: localStorage disponible
      console.log('1. Test localStorage disponible:', typeof localStorage !== 'undefined')
      
      // Test 2: Écrire et lire
      try {
        localStorage.setItem('test', 'test123')
        const read = localStorage.getItem('test')
        console.log('2. Test écriture/lecture:', read === 'test123' ? '✅ OK' : '❌ ÉCHEC')
        localStorage.removeItem('test')
      } catch (e) {
        console.error('2. Erreur:', e)
      }
      
      // Test 3: Sauvegarder des données de test
      try {
        const testData = {
          money: 1000,
          ownedUpgrades: { machine_size: 5, cousin: 2 },
          suspicion: 10,
          isFiscalAudit: false,
          fiscalAuditEndTime: 0,
          renaissanceCount: 0
        }
        const result = storage.save(testData)
        console.log('3. Test sauvegarde:', result ? '✅ OK' : '❌ ÉCHEC')
        
        const loaded = storage.load()
        console.log('4. Test chargement:', loaded ? '✅ OK' : '❌ ÉCHEC')
        if (loaded) {
          console.log('   Données chargées:', loaded)
        }
      } catch (e) {
        console.error('3-4. Erreur:', e)
      }
      
      // Test 5: Vérifier la clé actuelle
      const current = localStorage.getItem('panamaClickerSave')
      console.log('5. Données actuelles dans localStorage:', current ? `✅ Présentes (${current.length} caractères)` : '❌ Absentes')
      if (current) {
        try {
          const parsed = JSON.parse(current)
          console.log('   Contenu parsé:', parsed)
        } catch (e) {
          console.error('   Erreur parsing:', e)
        }
      }
      
      // Test 6: Forcer une sauvegarde
      console.log('6. Test sauvegarde forcée...')
      gameState.save()
      
      console.log('==============================')
      console.log('💡 Utilisez window.testPanamaStorage() pour relancer ce test')
    }
    
    return () => {
      delete window.testPanamaStorage
    }
  }, [gameState])

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


  const handleSubmitScore = (message, type) => {
    showNotification(message, type)
  }

  const handleResetStorage = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les données sauvegardées ? Cette action est irréversible.')) {
      storage.clear()
      window.location.reload()
    }
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
        <section className="suspicion-section">
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

        <section className="game-content">
          <div className="click-zone">
            <Clicker
              clickValue={gameState.getEffectiveClickValue()}
              onClick={gameState.handleClick}
            />
          </div>

          <div className="upgrades-panel">
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
          </div>
        </section>
      </main>

      <button
        className="open-leaderboard-button"
        onClick={() => setShowLeaderboard(true)}
      >
        🏆
      </button>

      <button
        className="reset-storage-button"
        onClick={handleResetStorage}
        title="Réinitialiser le localStorage"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: '#8b0000',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          zIndex: 1000
        }}
      >
        🗑️ Reset Storage
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

