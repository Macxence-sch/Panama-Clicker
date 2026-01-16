/**
 * leaderboard.js
 * Service pour gérer le leaderboard Supabase
 */

const SUPABASE_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  tableName: import.meta.env.VITE_SUPABASE_TABLE_NAME || 'scores'
}

// Debug: Vérifier que les variables sont chargées (uniquement en développement)
if (import.meta.env.DEV) {
  console.log('🔍 Configuration Supabase:', {
    url: SUPABASE_CONFIG.supabaseUrl ? '✅ Définie' : '❌ Manquante',
    key: SUPABASE_CONFIG.supabaseAnonKey ? '✅ Définie' : '❌ Manquante',
    table: SUPABASE_CONFIG.tableName
  })
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
      console.error('❌ Clé API Supabase manquante')
      return { success: false, message: 'API non configurée - Vérifiez votre fichier .env', data: [] }
    }

    if (!SUPABASE_CONFIG.supabaseUrl) {
      console.error('❌ URL Supabase manquante')
      return { success: false, message: 'URL Supabase manquante - Vérifiez votre fichier .env', data: [] }
    }

    try {
      const url = `${SUPABASE_CONFIG.supabaseUrl}/rest/v1/${SUPABASE_CONFIG.tableName}?select=*&order=money.desc&limit=${limit}`
      
      if (import.meta.env.DEV) {
        console.log('📡 Requête leaderboard:', url)
      }

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
        console.error('❌ Erreur HTTP:', response.status, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      if (import.meta.env.DEV) {
        console.log('✅ Leaderboard chargé:', data.length, 'scores')
      }

      // Convertir snake_case en camelCase
      const leaderboard = data.map(score => ({
        name: score.name,
        money: score.money,
        renaissanceCount: score.renaissance_count || 0
      }))

      return { success: true, data: leaderboard }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du leaderboard:', error)
      return { success: false, message: `Erreur: ${error.message}`, data: [] }
    }
  }
}

