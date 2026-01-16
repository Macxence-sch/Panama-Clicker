/**
 * gameData.js
 * Données statiques du jeu
 */

export const GAME_DATA = {
  BASE_CLICK_VALUE: 1,
  COST_MULTIPLIER: 1.15,
  
  UPGRADES: [
    {
      id: 'cousin',
      name: 'Cousin Auto-entrepreneur',
      baseCost: 10,
      revenuePerSecond: 0.5,
      description: 'Votre cousin déclare des revenus fictifs pour vous',
      emoji: '👨‍💼'
    },
    {
      id: 'kebab',
      name: 'Snack Kebab Fantôme',
      baseCost: 60,
      revenuePerSecond: 5,
      description: 'Un restaurant qui n\'existe que sur papier',
      emoji: '🥙'
    },
    {
      id: 'barber',
      name: 'Barber',
      baseCost: 300,
      revenuePerSecond: 25,
      description: 'Un salon de coiffure qui blanchit plus que les cheveux',
      emoji: '💇'
    },
    {
      id: 'food_store',
      name: 'Magasin Alimentaire',
      baseCost: 1200,
      revenuePerSecond: 100,
      description: 'Un supermarché qui déclare des ventes fictives',
      emoji: '🛒'
    },
    {
      id: 'wizard_school',
      name: 'École de Sorcier',
      baseCost: 6000,
      revenuePerSecond: 500,
      description: 'Une école qui fait disparaître les traces comptables',
      emoji: '🧙'
    },
    {
      id: 'garden_center',
      name: 'Jardinerie',
      baseCost: 30000,
      revenuePerSecond: 2500,
      description: 'Une jardinerie qui cultive de l\'argent',
      emoji: '🌳'
    },
    {
      id: 'illegal_casino',
      name: 'Casino Ilégal',
      baseCost: 150000,
      revenuePerSecond: 12500,
      description: 'Un casino souterrain qui génère des revenus non déclarés',
      emoji: '🎰'
    }
  ],
  
  SUSPICION: {
    INCREASE_INTERVAL: 5000,
    INCREASE_AMOUNT: 1,
    BRIBE_COST_PERCENTAGE: 0.10,
    BRIBE_MIN_COST: 30,
    BRIBE_REDUCTION: 20
  },
  
  FISCAL_AUDIT: {
    DURATION: 30000,
    RPS_PENALTY: 4
  },
  
  MULTIPLIER_UPGRADES: [
    {
      id: 'tax_haven',
      name: 'Paradis Fiscal',
      baseCost: 300,
      description: 'Multiplie par 2 le revenu passif total',
      emoji: '🏝️',
      type: 'rps_multiplier',
      multiplier: 2
    },
    {
      id: 'extra_bleach',
      name: 'Lessive Extra-Blanche',
      baseCost: 600,
      description: 'Multiplie par 2 la valeur du clic manuel',
      emoji: '✨',
      type: 'click_multiplier',
      multiplier: 2
    },
    {
      id: 'illegal_loans',
      name: 'Prêt Illégaux',
      baseCost: 3000,
      description: 'Prêts à taux usuraire. 50% chance de perdre 10% de votre argent, 50% chance de gagner un multiplicateur de peur (x1.5 RPS)',
      emoji: '💰',
      type: 'special_risk',
      riskAmount: 0.10,
      fearMultiplier: 1.5
    },
    {
      id: 'crooked_lawyer',
      name: 'Avocat Véreux',
      baseCost: 9000,
      description: 'Multiplie par 2.5 le revenu passif et réduit la suspicion actuelle de 30%',
      emoji: '⚖️',
      type: 'rps_multiplier',
      multiplier: 2.5,
      suspicionReduction: 0.3
    }
  ]
}

