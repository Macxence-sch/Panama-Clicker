/**
 * storage.js
 * Service pour gérer le localStorage
 */

const STORAGE_KEY = 'panamaClickerSave'
const PLAYER_NAME_KEY = 'panamaClickerPlayerName'

export const storage = {
  save: (data) => {
    console.log('💾 storage.save() appelé avec:', {
      money: data?.money,
      upgradesCount: Object.keys(data?.ownedUpgrades || {}).length,
      machine_size: data?.ownedUpgrades?.machine_size
    })
    
    try {
      // Vérifier que localStorage est disponible
      if (typeof localStorage === 'undefined') {
        console.error('❌ localStorage n\'est pas disponible')
        return false
      }
      
      const jsonData = JSON.stringify(data)
      console.log('📝 Données sérialisées, taille:', jsonData.length, 'caractères')
      
      localStorage.setItem(STORAGE_KEY, jsonData)
      console.log('💾 Données écrites dans localStorage avec la clé:', STORAGE_KEY)
      
      // Vérifier que la sauvegarde a bien fonctionné
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        console.error('❌ Erreur: aucune donnée trouvée après sauvegarde')
        return false
      }
      
      console.log('✅ Données vérifiées dans localStorage, taille:', saved.length, 'caractères')
      
      // Vérifier que les données sont identiques
      try {
        const parsed = JSON.parse(saved)
        console.log('✅ Données parsées avec succès:', {
          money: parsed.money,
          upgradesCount: Object.keys(parsed.ownedUpgrades || {}).length,
          machine_size: parsed.ownedUpgrades?.machine_size
        })
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing des données sauvegardées:', parseError)
      }
      
      return true
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      console.error('Type d\'erreur:', error.name)
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      
      // Vérifier si c'est une erreur de quota
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error('❌ Le localStorage est plein!')
      }
      
      // Vérifier si c'est une erreur de sécurité
      if (error.name === 'SecurityError' || error.code === 18) {
        console.error('❌ Erreur de sécurité: localStorage bloqué')
      }
      
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
  },

  /**
   * Réinitialise toutes les données sauvegardées
   */
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(PLAYER_NAME_KEY)
      console.log('LocalStorage réinitialisé')
      return true
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      return false
    }
  },

  /**
   * Réinitialise uniquement les données de jeu (garde le nom du joueur)
   */
  clearGameData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Données de jeu réinitialisées')
      return true
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des données de jeu:', error)
      return false
    }
  }
}

