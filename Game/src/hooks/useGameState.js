import { useState, useEffect, useCallback, useRef } from 'react'
import { GAME_DATA } from '../data/gameData'
import { storage } from '../services/storage'

/**
 * Hook personnalisé pour gérer l'état du jeu
 */
export const useGameState = () => {
  // État principal
  const [money, setMoney] = useState(0)
  const [totalRevenuePerSecond, setTotalRevenuePerSecond] = useState(0)
  const [ownedUpgrades, setOwnedUpgrades] = useState(() => {
    const initial = {}
    GAME_DATA.UPGRADES.forEach(upgrade => {
      initial[upgrade.id] = 0
    })
    return initial
  })

  // Suspicion et contrôle fiscal
  const [suspicion, setSuspicion] = useState(0)
  const [isFiscalAudit, setIsFiscalAudit] = useState(false)
  const [fiscalAuditEndTime, setFiscalAuditEndTime] = useState(0)

  // Renaissance
  const [renaissanceCount, setRenaissanceCount] = useState(0)
  const renaissanceBoost = 1.05

  // Protection contre les autoclickers
  const lastClickTime = useRef(0)
  const clickHistory = useRef([])
  const MIN_CLICK_INTERVAL = 50 // Minimum 50ms entre les clics (20 clics/seconde max)
  const MAX_CLICKS_PER_SECOND = 15 // Maximum 15 clics par seconde

  /**
   * Recalcule le revenu par seconde
   */
  const recalculateRevenuePerSecond = useCallback(() => {
    let rps = 0

    GAME_DATA.UPGRADES.forEach(upgrade => {
      const quantity = ownedUpgrades[upgrade.id] || 0
      if (quantity > 0 && upgrade.revenuePerSecond) {
        // Calculer le revenu avec augmentation de 5% par possession
        // Le premier rapporte 100%, le deuxième 105%, le troisième 110.25%, etc.
        let totalRevenue = 0
        for (let i = 0; i < quantity; i++) {
          const multiplier = Math.pow(1.05, i) // 1.05^0 = 1, 1.05^1 = 1.05, 1.05^2 = 1.1025, etc.
          totalRevenue += upgrade.revenuePerSecond * multiplier
        }
        rps += totalRevenue
      }
    })

    // Appliquer le boost de renaissance
    if (renaissanceCount > 0) {
      rps *= Math.pow(renaissanceBoost, renaissanceCount)
    }

    setTotalRevenuePerSecond(isNaN(rps) || !isFinite(rps) ? 0 : rps)
  }, [ownedUpgrades, renaissanceCount, renaissanceBoost])

  /**
   * Calcule le RPS effectif (avec pénalité de contrôle fiscal)
   */
  const getEffectiveRevenuePerSecond = useCallback(() => {
    if (isFiscalAudit) {
      return totalRevenuePerSecond / GAME_DATA.FISCAL_AUDIT.RPS_PENALTY
    }
    return totalRevenuePerSecond
  }, [totalRevenuePerSecond, isFiscalAudit])

  /**
   * Calcule la valeur effective d'un clic
   */
  const getEffectiveClickValue = useCallback(() => {
    let clickValue = GAME_DATA.BASE_CLICK_VALUE

    // Ajouter les upgrades de clic (Taille Machine) avec augmentation de 5% par possession
    GAME_DATA.UPGRADES.forEach(upgrade => {
      if (upgrade.type === 'click_upgrade' && upgrade.clickValueIncrease) {
        const quantity = ownedUpgrades[upgrade.id] || 0
        if (quantity > 0) {
          // Calculer la valeur du clic avec augmentation de 5% par possession
          // Le premier ajoute 100%, le deuxième 105%, le troisième 110.25%, etc.
          let totalClickIncrease = 0
          for (let i = 0; i < quantity; i++) {
            const multiplier = Math.pow(1.05, i) // 1.05^0 = 1, 1.05^1 = 1.05, 1.05^2 = 1.1025, etc.
            totalClickIncrease += upgrade.clickValueIncrease * multiplier
          }
          clickValue += totalClickIncrease
        }
      }
    })

    // Appliquer le boost de renaissance
    if (renaissanceCount > 0) {
      clickValue *= Math.pow(renaissanceBoost, renaissanceCount)
    }

    return isNaN(clickValue) || !isFinite(clickValue) 
      ? GAME_DATA.BASE_CLICK_VALUE 
      : clickValue
  }, [ownedUpgrades, renaissanceCount, renaissanceBoost])

  /**
   * Calcule le coût d'une amélioration
   */
  const getUpgradeCost = useCallback((upgradeId) => {
    const upgrade = GAME_DATA.UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return Infinity

    const quantity = ownedUpgrades[upgradeId] || 0
    if (isNaN(quantity) || quantity < 0) return upgrade.baseCost

    const cost = upgrade.baseCost * Math.pow(GAME_DATA.COST_MULTIPLIER, quantity)
    return isNaN(cost) ? upgrade.baseCost : cost
  }, [ownedUpgrades])

  /**
   * Achete une amélioration
   */
  const buyUpgrade = useCallback((upgradeId) => {
    const cost = getUpgradeCost(upgradeId)
    if (money >= cost) {
      setMoney(prev => prev - cost)
      setOwnedUpgrades(prev => {
        const updated = {}
        
        // D'abord, initialiser tous les upgrades depuis GAME_DATA
        GAME_DATA.UPGRADES.forEach(upgrade => {
          updated[upgrade.id] = prev[upgrade.id] || 0
        })
        
        // Ensuite, copier toutes les valeurs de prev (au cas où il y aurait des upgrades supplémentaires)
        Object.keys(prev).forEach(key => {
          if (!updated.hasOwnProperty(key)) {
            updated[key] = prev[key]
          }
        })
        
        // Mettre à jour l'upgrade acheté
        updated[upgradeId] = (updated[upgradeId] || 0) + 1
        
        // Debug: vérifier que machine_size est présent après l'achat
        if (import.meta.env.DEV) {
          console.log('Après achat - machine_size:', updated.machine_size)
          console.log('Après achat - upgradeId acheté:', upgradeId)
        }
        
        return updated
      })
      return true
    }
    return false
  }, [money, getUpgradeCost])


  /**
   * Gère un clic
   */
  const handleClick = useCallback(() => {
    const now = Date.now()
    const timeSinceLastClick = now - lastClickTime.current
    
    // Vérifier l'intervalle minimum entre les clics
    if (timeSinceLastClick < MIN_CLICK_INTERVAL) {
      return // Ignorer le clic si trop rapide
    }
    
    // Nettoyer l'historique des clics (garder seulement les 2 dernières secondes)
    clickHistory.current = clickHistory.current.filter(clickTime => now - clickTime < 2000)
    
    // Vérifier le nombre de clics par seconde
    const clicksInLastSecond = clickHistory.current.filter(clickTime => now - clickTime < 1000).length
    if (clicksInLastSecond >= MAX_CLICKS_PER_SECOND) {
      return // Ignorer le clic si trop de clics dans la dernière seconde
    }
    
    // Vérifier si les clics sont trop réguliers (signe d'autoclicker)
    if (clickHistory.current.length >= 5) {
      const intervals = []
      for (let i = 1; i < clickHistory.current.length; i++) {
        intervals.push(clickHistory.current[i] - clickHistory.current[i - 1])
      }
      // Si tous les intervalles sont identiques à ±5ms, c'est suspect
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const allSimilar = intervals.every(interval => Math.abs(interval - avgInterval) < 5)
      if (allSimilar && avgInterval < 100) {
        return // Ignorer si les clics sont trop réguliers et rapides
      }
    }
    
    // Enregistrer le clic
    lastClickTime.current = now
    clickHistory.current.push(now)
    
    const clickValue = getEffectiveClickValue()
    setMoney(prev => prev + clickValue)
  }, [getEffectiveClickValue])

  /**
   * Soudoye un inspecteur
   */
  const bribeInspector = useCallback(() => {
    const bribeCost = Math.max(
      GAME_DATA.SUSPICION.BRIBE_MIN_COST,
      money * GAME_DATA.SUSPICION.BRIBE_COST_PERCENTAGE
    )

    if (money >= bribeCost) {
      setMoney(prev => prev - bribeCost)
      setSuspicion(prev => Math.max(0, prev - GAME_DATA.SUSPICION.BRIBE_REDUCTION))
      return true
    }
    return false
  }, [money])

  /**
   * Calcule le coût pour soudoyer
   */
  const getBribeCost = useCallback(() => {
    return Math.max(
      GAME_DATA.SUSPICION.BRIBE_MIN_COST,
      money * GAME_DATA.SUSPICION.BRIBE_COST_PERCENTAGE
    )
  }, [money])

  /**
   * Effectue une renaissance
   */
  const performRenaissance = useCallback(() => {
    setRenaissanceCount(prev => prev + 1)
    setMoney(0)
    setOwnedUpgrades(() => {
      const initial = {}
      GAME_DATA.UPGRADES.forEach(upgrade => {
        initial[upgrade.id] = 0
      })
      return initial
    })
    setSuspicion(0)
    setIsFiscalAudit(false)
    setFiscalAuditEndTime(0)
  }, [])

  /**
   * Sauvegarde l'état
   */
  const save = useCallback(() => {
    console.log('🔄 Fonction save() appelée')
    try {
      // S'assurer que tous les upgrades sont présents dans ownedUpgrades avant de sauvegarder
      const completeUpgrades = { ...ownedUpgrades }
      GAME_DATA.UPGRADES.forEach(upgrade => {
        if (completeUpgrades[upgrade.id] === undefined) {
          completeUpgrades[upgrade.id] = 0
        }
      })
      
      // Nettoyer les valeurs pour la sérialisation JSON
      const cleanSaveData = {
        money: isNaN(money) || !isFinite(money) ? 0 : Number(money),
        ownedUpgrades: completeUpgrades,
        suspicion: isNaN(suspicion) || !isFinite(suspicion) ? 0 : Math.max(0, Math.min(100, Number(suspicion))),
        isFiscalAudit: Boolean(isFiscalAudit),
        fiscalAuditEndTime: isNaN(fiscalAuditEndTime) || !isFinite(fiscalAuditEndTime) ? 0 : Number(fiscalAuditEndTime),
        renaissanceCount: isNaN(renaissanceCount) || !isFinite(renaissanceCount) ? 0 : Math.max(0, Number(renaissanceCount))
      }
      
      console.log('💾 Tentative de sauvegarde:', {
        money: cleanSaveData.money,
        upgradesCount: Object.keys(cleanSaveData.ownedUpgrades).length,
        machine_size: cleanSaveData.ownedUpgrades.machine_size
      })
      
      // Sauvegarder directement sans test préalable (storage.save gère déjà les erreurs)
      const saveResult = storage.save(cleanSaveData)
      
      if (saveResult) {
        console.log('✅ Sauvegarde réussie')
      } else {
        console.error('❌ Échec de la sauvegarde')
      }
    } catch (error) {
      console.error('❌ ERREUR dans la fonction save:', error)
      console.error('Stack:', error.stack)
    }
  }, [money, ownedUpgrades, suspicion, isFiscalAudit, fiscalAuditEndTime, renaissanceCount])

  /**
   * Charge l'état
   */
  const load = useCallback(() => {
    const savedData = storage.load()
    if (!savedData) return

    setMoney(savedData.money || 0)
    
    // S'assurer que tous les upgrades sont initialisés, y compris les nouveaux
    const loadedUpgrades = savedData.ownedUpgrades || {}
    const completeUpgrades = {}
    
    // Initialiser tous les upgrades depuis GAME_DATA
    GAME_DATA.UPGRADES.forEach(upgrade => {
      // Si l'upgrade existe dans les données sauvegardées, utiliser sa valeur, sinon 0
      if (loadedUpgrades.hasOwnProperty(upgrade.id)) {
        completeUpgrades[upgrade.id] = loadedUpgrades[upgrade.id]
      } else {
        completeUpgrades[upgrade.id] = 0
      }
    })
    
    // Migration: s'assurer que machine_size existe (pour les anciennes sauvegardes)
    if (!completeUpgrades.hasOwnProperty('machine_size')) {
      completeUpgrades.machine_size = 0
    }
    
    console.log('=== CHARGEMENT ===')
    console.log('machine_size après migration:', completeUpgrades.machine_size)
    console.log('Tous les IDs après migration:', Object.keys(completeUpgrades))
    console.log('IDs attendus:', GAME_DATA.UPGRADES.map(u => u.id))
    console.log('machine_size dans GAME_DATA:', GAME_DATA.UPGRADES.find(u => u.id === 'machine_size'))
    
    setOwnedUpgrades(completeUpgrades)
    
    // Sauvegarder immédiatement pour migrer les anciennes sauvegardes
    const saveData = {
      money: savedData.money || 0,
      ownedUpgrades: completeUpgrades,
      suspicion: Math.max(0, Math.min(100, savedData.suspicion || 0)),
      isFiscalAudit: savedData.isFiscalAudit || false,
      fiscalAuditEndTime: savedData.fiscalAuditEndTime || 0,
      renaissanceCount: Math.max(0, savedData.renaissanceCount || 0)
    }
    storage.save(saveData)
    
    // Vérifier ce qui a été réellement sauvegardé
    const saved = storage.load()
    console.log('Vérification après migration - machine_size:', saved?.ownedUpgrades?.machine_size)
    console.log('Vérification après migration - tous les IDs:', Object.keys(saved?.ownedUpgrades || {}))
    
    setSuspicion(Math.max(0, Math.min(100, savedData.suspicion || 0)))
    setRenaissanceCount(Math.max(0, savedData.renaissanceCount || 0))
    setIsFiscalAudit(savedData.isFiscalAudit || false)
    setFiscalAuditEndTime(savedData.fiscalAuditEndTime || 0)
  }, [])

  // Charger au montage
  useEffect(() => {
    // Test du localStorage au démarrage
    console.log('🧪 TEST LOCALSTORAGE AU DÉMARRAGE')
    try {
      const testKey = 'panamaClickerTest'
      localStorage.setItem(testKey, 'test')
      const testValue = localStorage.getItem(testKey)
      if (testValue === 'test') {
        console.log('✅ localStorage fonctionne')
        localStorage.removeItem(testKey)
      } else {
        console.error('❌ localStorage ne fonctionne pas correctement')
      }
    } catch (error) {
      console.error('❌ Erreur localStorage:', error)
    }
    
    load()
  }, [load])

  // Recalculer RPS quand nécessaire
  useEffect(() => {
    recalculateRevenuePerSecond()
  }, [recalculateRevenuePerSecond])

  // Boucle de jeu : ajouter le revenu passif
  useEffect(() => {
    const interval = setInterval(() => {
      const effectiveRPS = getEffectiveRevenuePerSecond()
      if (effectiveRPS > 0) {
        setMoney(prev => prev + effectiveRPS)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [getEffectiveRevenuePerSecond])

  // Boucle de suspicion
  useEffect(() => {
    if (isFiscalAudit) return

    const interval = setInterval(() => {
      setSuspicion(prev => Math.min(100, prev + GAME_DATA.SUSPICION.INCREASE_AMOUNT))
    }, GAME_DATA.SUSPICION.INCREASE_INTERVAL)

    return () => clearInterval(interval)
  }, [isFiscalAudit])

  // Vérifier le contrôle fiscal
  useEffect(() => {
    if (!isFiscalAudit) return

    const checkInterval = setInterval(() => {
      if (Date.now() >= fiscalAuditEndTime) {
        setIsFiscalAudit(false)
        setFiscalAuditEndTime(0)
      }
    }, 1000)

    return () => clearInterval(checkInterval)
  }, [isFiscalAudit, fiscalAuditEndTime])

  // Déclencher le contrôle fiscal si suspicion = 100%
  useEffect(() => {
    if (suspicion >= 100 && !isFiscalAudit) {
      setIsFiscalAudit(true)
      setFiscalAuditEndTime(Date.now() + GAME_DATA.FISCAL_AUDIT.DURATION)
      setSuspicion(0)
    }
  }, [suspicion, isFiscalAudit])

  // Sauvegarde automatique
  useEffect(() => {
    console.log('⏰ Configuration de la sauvegarde automatique (toutes les 10 secondes)')
    
    // Test immédiat
    setTimeout(() => {
      console.log('🧪 Test de sauvegarde immédiat')
      save()
    }, 2000)
    
    const interval = setInterval(() => {
      console.log('⏰ Sauvegarde automatique déclenchée')
      save()
    }, 10000)

    return () => {
      console.log('🛑 Arrêt de la sauvegarde automatique')
      clearInterval(interval)
    }
  }, [save])

  return {
    // État
    money,
    totalRevenuePerSecond,
    ownedUpgrades,
    suspicion,
    isFiscalAudit,
    fiscalAuditEndTime,
    renaissanceCount,
    renaissanceBoost,

    // Calculs
    getEffectiveRevenuePerSecond,
    getEffectiveClickValue,
    getUpgradeCost,
    getBribeCost,

    // Actions
    handleClick,
    buyUpgrade,
    bribeInspector,
    performRenaissance,
    save,
    load
  }
}

