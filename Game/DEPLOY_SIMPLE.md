# 🚀 Déployer votre projet en 5 minutes

## Étape 1 : Configurer Supabase (Local)

Avant de déployer, configurez vos variables d'environnement :

1. Allez sur [supabase.com](https://supabase.com) → Votre projet
2. Settings → API
3. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clé publique, pas la service_role)

4. Dans le projet, créez un fichier `.env` à la racine :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici
   VITE_SUPABASE_TABLE_NAME=scores
   ```

5. Testez localement :
   ```powershell
   npm run dev
   ```

---

## Étape 2 : Créer un compte GitHub

1. Allez sur [github.com](https://github.com) et créez un compte
2. Créez un nouveau repository (bouton "+" en haut à droite)

---

## Étape 3 : Pousser votre code

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/panama-clicker.git
git push -u origin main
```
*(Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)*

---

## Étape 4 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre repository `panama-clicker`
5. Vercel détecte automatiquement Vite - cliquez sur "Deploy"
6. **⚠️ IMPORTANT** : Avant de finaliser, ajoutez vos variables d'environnement :
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     - `VITE_SUPABASE_URL` = votre URL Supabase
     - `VITE_SUPABASE_ANON_KEY` = votre clé anon
     - `VITE_SUPABASE_TABLE_NAME` = `scores`
   - Cliquez sur "Redeploy" pour appliquer les changements
7. ✅ **Votre site est en ligne !** (URL : `https://panama-clicker.vercel.app`)

---

## ⚠️ Note importante sur Supabase

Supabase gère automatiquement les headers CORS pour les API REST.
**Aucune configuration CORS supplémentaire n'est nécessaire** dans le dashboard Supabase.

---

## ✅ C'est tout !

Votre jeu est maintenant en ligne et accessible partout dans le monde ! 🎉

