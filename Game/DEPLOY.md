# 🚀 Guide de Déploiement - Panama Clicker

## Déploiement sur Vercel ⭐

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
   - **⚠️ IMPORTANT** : Avant de finaliser, ajoutez vos variables d'environnement :
     - Cliquez sur "Environment Variables"
     - Ajoutez :
       - `VITE_SUPABASE_URL` = votre URL Supabase
       - `VITE_SUPABASE_ANON_KEY` = votre clé anon
       - `VITE_SUPABASE_TABLE_NAME` = `scores`
   - Cliquez sur "Deploy"
   - ✅ Votre site est en ligne en 2 minutes !

**URL générée :** `https://votre-projet.vercel.app`

---

## ⚙️ Configuration Supabase

### Configuration locale

1. Allez sur [supabase.com](https://supabase.com) → Votre projet
2. Settings → API
3. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clé publique, pas la service_role)

4. Créez un fichier `.env` à la racine du projet :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici
   VITE_SUPABASE_TABLE_NAME=scores
   ```

### Configuration en production (Vercel)

Les variables d'environnement doivent être configurées dans le dashboard Vercel (voir étape 3 ci-dessus).

### Note importante

Supabase gère automatiquement les headers CORS pour les API REST.
**Aucune configuration CORS supplémentaire n'est nécessaire** dans le dashboard Supabase.

---

## 📝 Checklist avant déploiement

- [ ] Créer le fichier `.env` avec vos clés Supabase
- [ ] Tester localement avec `npm run dev`
- [ ] Vérifier que le build fonctionne : `npm run build`
- [ ] Pousser le code sur GitHub
- [ ] Configurer les variables d'environnement dans Vercel
- [ ] Tester l'application déployée

