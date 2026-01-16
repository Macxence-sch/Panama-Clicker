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
  const [ownedMultiplierUpgrades, setOwnedMultiplierUpgrades] = useState(() => {
    const initial = {}
    GAME_DATA.MULTIPLIER_UPGRADES.forEach(upgrade => {
      initial[upgrade.id] = false
    })
    return initial
  })

  // Multiplicateurs
  const [rpsMultiplier, setRpsMultiplier] = useState(1)
  const [clickMultiplier, setClickMultiplier] = useState(1)
  const [fearMultiplier, setFearMultiplier] = useState(1)

  // Suspicion et contrôle fiscal
  const [suspicion, setSuspicion] = useState(0)
  const [isFiscalAudit, setIsFiscalAudit] = useState(false)
  const [fiscalAuditEndTime, setFiscalAuditEndTime] = useState(0)

  // Renaissance
  const [renaissanceCount, setRenaissanceCount] = useState(0)
  const renaissanceBoost = 1.05

  // Refs pour les valeurs qui ne doivent pas déclencher de re-render
  const multipliersRef = useRef({ rps: 1, click: 1, fear: 1 })

  /**
   * Recalcule le revenu par seconde
   */
  const recalculateRevenuePerSecond = useCallback(() => {
    let rps = 0

    GAME_DATA.UPGRADES.forEach(upgrade => {
      const quantity = ownedUpgrades[upgrade.id] || 0
      if (quantity > 0 && upgrade.revenuePerSecond) {
        rps += upgrade.revenuePerSecond * quantity
      }
    })

    // Appliquer les multiplicateurs
    const rpsMult = multipliersRef.current.rps || 1
    const fearMult = multipliersRef.current.fear || 1
    rps *= rpsMult * fearMult

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
    let clickValue = GAME_DATA.BASE_CLICK_VALUE * multipliersRef.current.click

    if (renaissanceCount > 0) {
      clickValue *= Math.pow(renaissanceBoost, renaissanceCount)
    }

    return isNaN(clickValue) || !isFinite(clickValue) 
      ? GAME_DATA.BASE_CLICK_VALUE 
      : clickValue
  }, [renaissanceCount, renaissanceBoost])

  /**
   * Calcule le coût d'une amélioration
   */
  const getUpgradeCost = useCallback((upgradeId) => {
    const upgrade = GAME_DATA.UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return Infinity

    const quantity = ownedUpgrades[upgradeId] || 0
    if (isNaN(quantity) || quantity < 0) return upgrade.baseCost

    const cost = upgrade.baseCost * Math.pow(GAME_DATA.COST_MULTIPLIER, quantity)
    return Math.floor(isNaN(cost) ? upgrade.baseCost : cost)
  }, [ownedUpgrades])

  /**
   * Achete une amélioration
   */
  const buyUpgrade = useCallback((upgradeId) => {
    const cost = getUpgradeCost(upgradeId)
    if (money >= cost) {
      setMoney(prev => prev - cost)
      setOwnedUpgrades(prev => ({
        ...prev,
        [upgradeId]: (prev[upgradeId] || 0) + 1
      }))
      return true
    }
    return false
  }, [money, getUpgradeCost])

  /**
   * Achete un upgrade multiplicateur
   */
  const buyMultiplierUpgrade = useCallback((upgradeId) => {
    const upgrade = GAME_DATA.MULTIPLIER_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) {
      return { success: false, message: 'N\'existe pas' }
    }

    if (upgrade.type !== 'special_risk' && ownedMultiplierUpgrades[upgradeId]) {
      return { success: false, message: 'Déjà possédé' }
    }

    if (money < upgrade.baseCost) {
      return { success: false, message: 'Pas assez d\'argent' }
    }

    setMoney(prev => prev - upgrade.baseCost)

    // Gérer les upgrades spéciaux avec risque
    if (upgrade.type === 'special_risk') {
      const success = Math.random() < 0.5

      if (success) {
        setFearMultiplier(prev => prev * upgrade.fearMultiplier)
        multipliersRef.current.fear *= upgrade.fearMultiplier
        setOwnedMultiplierUpgrades(prev => ({ ...prev, [upgradeId]: true }))
        return {
          success: true,
          message: `Succès ! Multiplicateur de peur x${upgrade.fearMultiplier} obtenu !`,
          gainedMultiplier: true
        }
      } else {
        const lostAmount = Math.floor(money * upgrade.riskAmount)
        setMoney(prev => Math.max(0, prev - lostAmount))
        return {
          success: false,
          message: `Échec ! Vous avez perdu ${lostAmount}€. Le débiteur a disparu...`,
          lostMoney: lostAmount
        }
      }
    }

    // Upgrade normal
    setOwnedMultiplierUpgrades(prev => ({ ...prev, [upgradeId]: true }))

    if (upgrade.type === 'rps_multiplier') {
      setRpsMultiplier(prev => prev * upgrade.multiplier)
      multipliersRef.current.rps *= upgrade.multiplier

      if (upgrade.suspicionReduction) {
        setSuspicion(prev => prev * (1 - upgrade.suspicionReduction))
      }
    } else if (upgrade.type === 'click_multiplier') {
      setClickMultiplier(prev => prev * upgrade.multiplier)
      multipliersRef.current.click *= upgrade.multiplier
    }

    return { success: true, message: 'Achat réussi !' }
  }, [money, ownedMultiplierUpgrades])

  /**
   * Gère un clic
   */
  const handleClick = useCallback(() => {
    const clickValue = getEffectiveClickValue()
    setMoney(prev => prev + clickValue)
  }, [getEffectiveClickValue])

  /**
   * Soudoye un inspecteur
   */
  const bribeInspector = useCallback(() => {
    const bribeCost = Math.max(
      GAME_DATA.SUSPICION.BRIBE_MIN_COST,
      Math.floor(money * GAME_DATA.SUSPICION.BRIBE_COST_PERCENTAGE)
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
      Math.floor(money * GAME_DATA.SUSPICION.BRIBE_COST_PERCENTAGE)
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
    setOwnedMultiplierUpgrades(() => {
      const initial = {}
      GAME_DATA.MULTIPLIER_UPGRADES.forEach(upgrade => {
        initial[upgrade.id] = false
      })
      return initial
    })
    setSuspicion(0)
    setIsFiscalAudit(false)
    setFiscalAuditEndTime(0)
    setRpsMultiplier(1)
    setClickMultiplier(1)
    setFearMultiplier(1)
    multipliersRef.current = { rps: 1, click: 1, fear: 1 }
  }, [])

  /**
   * Sauvegarde l'état
   */
  const save = useCallback(() => {
    const saveData = {
      money,
      ownedUpgrades,
      ownedMultiplierUpgrades,
      suspicion,
      rpsMultiplier,
      clickMultiplier,
      fearMultiplier,
      isFiscalAudit,
      fiscalAuditEndTime,
      renaissanceCount
    }
    storage.save(saveData)
  }, [money, ownedUpgrades, ownedMultiplierUpgrades, suspicion, rpsMultiplier, clickMultiplier, fearMultiplier, isFiscalAudit, fiscalAuditEndTime, renaissanceCount])

  /**
   * Charge l'état
   */
  const load = useCallback(() => {
    const savedData = storage.load()
    if (!savedData) return

    setMoney(savedData.money || 0)
    setOwnedUpgrades(savedData.ownedUpgrades || {})
    setOwnedMultiplierUpgrades(savedData.ownedMultiplierUpgrades || {})
    setSuspicion(Math.max(0, Math.min(100, savedData.suspicion || 0)))
    setRenaissanceCount(Math.max(0, savedData.renaissanceCount || 0))
    setRpsMultiplier(savedData.rpsMultiplier || 1)
    setClickMultiplier(savedData.clickMultiplier || 1)
    setFearMultiplier(savedData.fearMultiplier || 1)
    setIsFiscalAudit(savedData.isFiscalAudit || false)
    setFiscalAuditEndTime(savedData.fiscalAuditEndTime || 0)

    // Réappliquer les multiplicateurs depuis les upgrades possédés
    let rpsMult = 1
    let clickMult = 1
    let fearMult = savedData.fearMultiplier || 1

    GAME_DATA.MULTIPLIER_UPGRADES.forEach(upgrade => {
      if (savedData.ownedMultiplierUpgrades?.[upgrade.id] && upgrade.multiplier) {
        if (upgrade.type === 'rps_multiplier') {
          rpsMult *= upgrade.multiplier
        } else if (upgrade.type === 'click_multiplier') {
          clickMult *= upgrade.multiplier
        }
      }
    })

    setRpsMultiplier(rpsMult)
    setClickMultiplier(clickMult)
    multipliersRef.current = { rps: rpsMult, click: clickMult, fear: fearMult }
  }, [])

  // Charger au montage
  useEffect(() => {
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
    const interval = setInterval(() => {
      save()
    }, 10000)

    return () => clearInterval(interval)
  }, [save])

  return {
    // État
    money,
    totalRevenuePerSecond,
    ownedUpgrades,
    ownedMultiplierUpgrades,
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
    buyMultiplierUpgrade,
    bribeInspector,
    performRenaissance,
    save,
    load
  }
}

