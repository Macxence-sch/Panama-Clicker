import React, { useState } from 'react'
import { formatNumber } from '../utils/formatters'
import './Clicker.css'

export const Clicker = ({ clickValue, onClick }) => {
  const [particles, setParticles] = useState([])

  const handleClick = (e) => {
    onClick()
    
    // Créer une particule
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const particle = {
      id: Date.now(),
      x,
      y,
      value: clickValue
    }

    setParticles(prev => [...prev, particle])

    // Supprimer la particule après l'animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id))
    }, 1000)
  }

  return (
    <div className="clicker-area">
      <div 
        className="washing-machine"
        onClick={handleClick}
      >
        <div className="machine-top-panel"></div>
        <div className="machine-door">
          <div className="door-glass"></div>
          <div className="door-handle"></div>
        </div>
        <div className="machine-controls">
          <div className="control-knob"></div>
          <div className="control-knob"></div>
        </div>
        <div className="machine-brand">PANAMA</div>
        <div className="machine-led"></div>

        {/* Particules de clic */}
        <div className="particle-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="click-particle"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`
              }}
            >
              +{formatNumber(particle.value)}€
            </div>
          ))}
        </div>
      </div>
      <p className="click-hint">Cliquez pour blanchir de l'argent</p>
      <p className="click-value">+{formatNumber(clickValue)} € par clic</p>
    </div>
  )
}

