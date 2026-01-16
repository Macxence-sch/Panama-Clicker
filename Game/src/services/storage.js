/**
 * storage.js
 * Service pour gérer le localStorage
 */

const STORAGE_KEY = 'panamaClickerSave'
const PLAYER_NAME_KEY = 'panamaClickerPlayerName'

export const storage = {
  save: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      return null
    }
  },

  getPlayerName: () => {
    return localStorage.getItem(PLAYER_NAME_KEY) || ''
  },

  setPlayerName: (name) => {
    if (name) {
      localStorage.setItem(PLAYER_NAME_KEY, name.trim())
    }
  }
}

