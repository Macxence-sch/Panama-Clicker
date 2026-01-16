import React, { useState, useEffect } from 'react'
import { leaderboardService } from '../services/leaderboard'
import { formatNumber } from '../utils/formatters'
import './Leaderboard.css'

export const Leaderboard = ({ isOpen, onClose, playerName, money, renaissanceCount, onSubmitScore }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadLeaderboard = async () => {
    setLoading(true)
    const result = await leaderboardService.getLeaderboard(10)
    if (result.success) {
      setLeaderboard(result.data || [])
    } else {
      console.error('Erreur leaderboard:', result.message)
      // Afficher un message d'erreur à l'utilisateur
      if (result.message && onSubmitScore) {
        onSubmitScore(result.message, 'error')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard()
    }
  }, [isOpen])

  const handleSubmitScore = async () => {
    setSubmitting(true)
    const result = await leaderboardService.submitScore(playerName, money, renaissanceCount)
    if (result.success) {
      await loadLeaderboard()
      onSubmitScore?.(result.message)
    } else {
      onSubmitScore?.(result.message, 'error')
    }
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="leaderboard-overlay" onClick={onClose} />
      <div className="leaderboard-panel">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="leaderboard-controls">
          <button
            className="submit-score-button"
            onClick={handleSubmitScore}
            disabled={submitting || !playerName}
          >
            {submitting ? '⏳ Envoi...' : '📤 Envoyer mon score'}
          </button>
          <button className="refresh-button" onClick={loadLeaderboard} disabled={loading}>
            🔄 Actualiser
          </button>
        </div>
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : leaderboard.length > 0 ? (
            <div className="leaderboard-list">
              {leaderboard.map((score, index) => {
                const rank = index + 1
                const isCurrentPlayer = score.name === playerName
                const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : ''

                return (
                  <div key={index} className={`leaderboard-item ${rankClass} ${isCurrentPlayer ? 'current-player' : ''}`}>
                    <div className="leaderboard-rank">{rank}</div>
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">
                        {score.name}
                        {isCurrentPlayer && <span className="you-badge">Vous</span>}
                      </div>
                      <div className="leaderboard-stats">
                        <span className="stat-item">💰 {formatNumber(score.money)} €</span>
                        <span className="stat-item">🔄 {score.renaissanceCount || 0} renaissance{score.renaissanceCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="leaderboard-empty">
              <p>Aucun score disponible</p>
              <p className="leaderboard-hint">Soyez le premier à envoyer votre score !</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

