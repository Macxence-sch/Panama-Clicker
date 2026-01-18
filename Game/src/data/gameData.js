/**
 * gameData.js
 * Données statiques du jeu
 */

export const GAME_DATA = {
  BASE_CLICK_VALUE: 1,
  COST_MULTIPLIER: 1.15,
  
  UPGRADES: [
    {
      id: 'machine_size',
      name: 'Taille Machine',
      baseCost: 15,
      clickValueIncrease: 1,
      description: 'Augmente la valeur du clic de 1€',
      emoji: '🔧',
      type: 'click_upgrade'
    },
    {
      id: 'cousin',
      name: 'Cousin Auto-entrepreneur',
      baseCost: 100,
      revenuePerSecond: 1,
      description: 'Votre cousin déclare des revenus fictifs pour vous',
      emoji: '👨‍💼'
    },
    {
      id: 'barber',
      name: 'Barber',
      baseCost: 500,
      revenuePerSecond: 5,
      description: 'Un salon de coiffure qui blanchit plus que les cheveux',
      emoji: '💇'
    },
    {
      id: 'kebab',
      name: 'Snack Kebab Fantôme',
      baseCost: 2500,
      revenuePerSecond: 20,
      description: 'Un restaurant qui n\'existe que sur papier',
      emoji: '🥙'
    },
    {
      id: 'food_store',
      name: 'Magasin Alimentaire',
      baseCost: 10000,
      revenuePerSecond: 75,
      description: 'Un supermarché qui déclare des ventes fictives',
      emoji: '🛒'
    },
    {
      id: 'garden_center',
      name: 'Jardinerie',
      baseCost: 40000,
      revenuePerSecond: 250,
      description: 'Une jardinerie qui cultive de l\'argent',
      emoji: '🌳'
    },
    {
      id: 'laundromat',
      name: 'Laverie automatique',
      baseCost: 150000,
      revenuePerSecond: 900,
      description: 'Une laverie qui nettoie plus que les vêtements',
      emoji: '🧺'
    },
    {
      id: 'night_cleaning',
      name: 'Entreprise de nettoyage nocturne',
      baseCost: 600000,
      revenuePerSecond: 3500,
      description: 'Une entreprise qui nettoie les traces la nuit',
      emoji: '🌙'
    },
    {
      id: 'family_construction',
      name: 'Entreprise de BTP "familiale"',
      baseCost: 2500000,
      revenuePerSecond: 15000,
      description: 'Une entreprise familiale qui construit des comptes',
      emoji: '🏗️'
    },
    {
      id: 'cargo_port',
      name: 'Port de Marchandise',
      baseCost: 10000000,
      revenuePerSecond: 70000,
      description: 'Un port qui fait transiter de l\'argent',
      emoji: '🚢'
    },
    {
      id: 'illegal_casino',
      name: 'Casino Ilégal',
      baseCost: 50000000,
      revenuePerSecond: 350000,
      description: 'Un casino souterrain qui génère des revenus non déclarés',
      emoji: '🎰'
    },
    {
      id: 'strip_club',
      name: 'Club Striptease',
      baseCost: 200000000,
      revenuePerSecond: 1200000,
      description: 'Un club qui fait danser les comptes',
      emoji: '💃'
    },
    {
      id: 'crooked_lawyer',
      name: 'Avocat Baveux',
      baseCost: 1000000000,
      revenuePerSecond: 5000000,
      description: 'Un avocat qui fait disparaître les preuves',
      emoji: '⚖️'
    },
    {
      id: 'luxembourg_account',
      name: 'Compte bancaire luxembourgeois',
      baseCost: 5000000000,
      revenuePerSecond: 25000000,
      description: 'Un compte dans un paradis fiscal',
      emoji: '🏦'
    },
    {
      id: 'airline',
      name: 'Compagnie aérienne',
      baseCost: 25000000000,
      revenuePerSecond: 120000000,
      description: 'Une compagnie qui fait voler l\'argent',
      emoji: '✈️'
    },
    {
      id: 'gold_mine',
      name: 'Mine d\'or',
      baseCost: 150000000000,
      revenuePerSecond: 800000000,
      description: 'Une mine qui extrait de l\'or... et de l\'argent',
      emoji: '⛏️'
    },
    {
      id: 'paradise_island',
      name: 'Ile Paradisiaque',
      baseCost: 1000000000000,
      revenuePerSecond: 6000000000,
      description: 'Une île où l\'argent pousse sur les arbres',
      emoji: '🏝️'
    },
    {
      id: 'nft',
      name: 'NFT sans image',
      baseCost: 7000000000000,
      revenuePerSecond: 45000000000,
      description: 'Un NFT qui n\'existe que dans les comptes',
      emoji: '🖼️'
    },
    {
      id: 'crypto',
      name: 'Crypto obscure',
      baseCost: 50000000000000,
      revenuePerSecond: 400000000000,
      description: 'Une cryptomonnaie qui n\'existe nulle part',
      emoji: '₿'
    },
    {
      id: 'wizard_school',
      name: 'École de Sorcier',
      baseCost: 400000000000000,
      revenuePerSecond: 4000000000000,
      description: 'Une école qui fait disparaître les traces comptables',
      emoji: '🧙'
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
  }
}

