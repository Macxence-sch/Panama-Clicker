/**
 * leaderboard.js
 * Service pour gérer le leaderboard Supabase
 */

const SUPABASE_CONFIG = {
  supabaseUrl: 'https://ztroellyaoerahiowvpd.supabase.co',
  supabaseAnonKey: '', // À AJOUTER
  tableName: 'scores'
}

export const leaderboardService = {
  /**
   * Met à jour la configuration Supabase
   */
  updateConfig: (config) => {
    Object.assign(SUPABASE_CONFIG, config)
  },

  /**
   * Envoie un score à Supabase
   */
  submitScore: async (name, money, renaissanceCount) => {
    if (!name) {
      return { success: false, message: 'Veuillez d\'abord entrer votre nom' }
    }

    if (!SUPABASE_CONFIG.supabaseAnonKey) {
      return { success: false, message: 'API non configurée - Vérifiez votre clé API Supabase' }
    }

    try {
      const scoreData = {
        name: name.trim(),
        money: money,
        renaissance_count: renaissanceCount
      }

      const url = `${SUPABASE_CONFIG.supabaseUrl}/rest/v1/${SUPABASE_CONFIG.tableName}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.supabaseAnonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(scoreData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      return { success: true, message: 'Score envoyé avec succès !', data: result }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score:', error)
      return { success: false, message: `Erreur: ${error.message}` }
    }
  },

  /**
   * Récupère le leaderboard depuis Supabase
   */
  getLeaderboard: async (limit = 10) => {
    if (!SUPABASE_CONFIG.supabaseAnonKey) {
      return { success: false, message: 'API non configurée', data: [] }
    }

    try {
      const url = `${SUPABASE_CONFIG.supabaseUrl}/rest/v1/${SUPABASE_CONFIG.tableName}?select=*&order=money.desc&limit=${limit}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_CONFIG.supabaseAnonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.supabaseAnonKey}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Convertir snake_case en camelCase
      const leaderboard = data.map(score => ({
        name: score.name,
        money: score.money,
        renaissanceCount: score.renaissance_count || 0
      }))

      return { success: true, data: leaderboard }
    } catch (error) {
      console.error('Erreur lors de la récupération du leaderboard:', error)
      return { success: false, message: `Erreur: ${error.message}`, data: [] }
    }
  }
}

