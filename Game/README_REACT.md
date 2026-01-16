# Panama Clicker - Version React

## 🚀 Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

3. **Build pour la production :**
   ```bash
   npm run build
   ```

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── Header.jsx
│   ├── Clicker.jsx
│   ├── SuspicionPanel.jsx
│   ├── UpgradesList.jsx
│   ├── MultiplierUpgrades.jsx
│   ├── Leaderboard.jsx
│   └── PlayerNameModal.jsx
├── hooks/               # Hooks personnalisés
│   └── useGameState.js
├── services/            # Services (API, localStorage)
│   ├── storage.js
│   └── leaderboard.js
├── data/                # Données statiques
│   └── gameData.js
├── utils/               # Utilitaires
│   └── formatters.js
├── styles/              # Styles globaux
│   └── index.css
├── App.jsx              # Composant principal
└── main.jsx             # Point d'entrée
```

## ⚙️ Configuration Supabase

1. Ouvrez `src/services/leaderboard.js`
2. Ajoutez votre clé API Supabase :
   ```javascript
   supabaseAnonKey: 'VOTRE_CLE_API_ICI',
   ```

## 🎮 Fonctionnalités

- ✅ Gestion d'état avec hooks React
- ✅ Sauvegarde automatique dans localStorage
- ✅ Leaderboard Supabase
- ✅ Composants modulaires et réutilisables
- ✅ Design responsive
- ✅ Animations et effets visuels

## 📝 Notes

- Le projet utilise **Vite** comme bundler (plus rapide que Create React App)
- Tous les styles sont dans `src/styles/index.css` et `src/App.css`
- Les composants sont dans `src/components/`
- La logique du jeu est dans `src/hooks/useGameState.js`

