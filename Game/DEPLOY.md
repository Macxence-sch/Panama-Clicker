# 🚀 Guide de Déploiement - Panama Clicker

## Options gratuites pour déployer votre projet

### 1. **Vercel** (Recommandé - Le plus simple) ⭐

**Avantages :**
- ✅ Gratuit et illimité
- ✅ Déploiement automatique depuis GitHub
- ✅ Configuration automatique pour Vite/React
- ✅ HTTPS automatique
- ✅ CDN global (très rapide)

**Étapes :**

1. **Créer un compte GitHub** (si vous n'en avez pas)
   - Allez sur [github.com](https://github.com)
   - Créez un compte
   - Créez un nouveau repository (ex: `panama-clicker`)

2. **Pousser votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/panama-clicker.git
   git push -u origin main
   ```

3. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Cliquez sur "New Project"
   - Importez votre repository
   - Vercel détecte automatiquement Vite
   - Cliquez sur "Deploy"
   - ✅ Votre site est en ligne en 2 minutes !

**URL générée :** `https://votre-projet.vercel.app`

---

### 2. **Netlify** (Alternative excellente)

**Avantages :**
- ✅ Gratuit
- ✅ Déploiement drag & drop (sans Git)
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique

**Étapes :**

1. **Avec GitHub (recommandé)**
   - Allez sur [netlify.com](https://netlify.com)
   - Connectez-vous avec GitHub
   - Cliquez sur "New site from Git"
   - Sélectionnez votre repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Cliquez sur "Deploy"

2. **Sans GitHub (drag & drop)**
   ```bash
   npm run build
   ```
   - Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
   - Glissez-déposez le dossier `dist`
   - ✅ Votre site est en ligne !

**URL générée :** `https://votre-projet.netlify.app`

---

### 3. **Cloudflare Pages** (Très rapide)

**Avantages :**
- ✅ Gratuit
- ✅ CDN ultra-rapide
- ✅ Déploiement depuis GitHub

**Étapes :**
1. Allez sur [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connectez-vous avec GitHub
3. Sélectionnez votre repository
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Cliquez sur "Save and Deploy"

**URL générée :** `https://votre-projet.pages.dev`

---

### 4. **GitHub Pages** (Gratuit mais nécessite configuration)

**Avantages :**
- ✅ Gratuit
- ✅ Intégré à GitHub

**Configuration nécessaire :**
- Voir le fichier `github-pages-setup.md` pour les instructions détaillées

---

## ⚙️ Configuration Supabase pour la production

**Important :** Après le déploiement, vous devez configurer CORS dans Supabase :

1. Allez dans votre projet Supabase
2. Settings → API
3. Dans "CORS", ajoutez votre URL de déploiement :
   - `https://votre-projet.vercel.app`
   - `https://votre-projet.netlify.app`
   - etc.

---

## 📝 Checklist avant déploiement

- [ ] Ajouter votre clé API Supabase dans `src/services/leaderboard.js`
- [ ] Tester localement avec `npm run dev`
- [ ] Vérifier que le build fonctionne : `npm run build`
- [ ] Pousser le code sur GitHub
- [ ] Configurer CORS dans Supabase avec votre URL de production

---

## 🎯 Recommandation

**Utilisez Vercel** - C'est le plus simple et le plus rapide pour un projet React/Vite !

