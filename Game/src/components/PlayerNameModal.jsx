import React, { useState, useEffect } from 'react'
import { storage } from '../services/storage'
import './PlayerNameModal.css'

export const PlayerNameModal = ({ onSave }) => {
  const [name, setName] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const savedName = storage.getPlayerName()
    if (!savedName) {
      setShow(true)
    }
  }, [])

  const handleSave = () => {
    const trimmedName = name.trim()
    if (trimmedName && trimmedName.length >= 1 && trimmedName.length <= 50) {
      storage.setPlayerName(trimmedName)
      setShow(false)
      onSave?.(trimmedName)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={() => setShow(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🏆 Entrez votre nom</h2>
        <p>Pour participer au leaderboard, entrez votre nom :</p>
        <input
          type="text"
          id="player-name-input"
          placeholder="Votre nom"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <div className="modal-buttons">
          <button className="modal-button" onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

