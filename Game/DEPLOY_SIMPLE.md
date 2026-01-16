# 🚀 Déployer votre projet en 5 minutes

## Option 1 : Vercel (Le plus simple) ⭐

### Étape 1 : Créer un compte GitHub
1. Allez sur [github.com](https://github.com) et créez un compte
2. Créez un nouveau repository (bouton "+" en haut à droite)

### Étape 2 : Pousser votre code
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

### Étape 3 : Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre repository `panama-clicker`
5. Vercel détecte automatiquement Vite - cliquez sur "Deploy"
6. ✅ **Votre site est en ligne !** (URL : `https://panama-clicker.vercel.app`)

---

## Option 2 : Netlify (Alternative)

### Méthode rapide (sans Git) :
1. Exécutez dans PowerShell :
   ```powershell
   npm run build
   ```
2. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
3. Glissez-déposez le dossier `dist` qui vient d'être créé
4. ✅ Votre site est en ligne !

### Méthode avec Git (recommandée) :
1. Poussez votre code sur GitHub (voir Option 1, étapes 1-2)
2. Allez sur [netlify.com](https://netlify.com)
3. Connectez-vous avec GitHub
4. Cliquez sur "New site from Git"
5. Sélectionnez votre repository
6. Build command : `npm run build`
7. Publish directory : `dist`
8. Cliquez sur "Deploy"

---

## ⚠️ Important : Configurer Supabase

Après le déploiement, vous devez autoriser votre site dans Supabase :

1. Allez sur [supabase.com](https://supabase.com) → Votre projet
2. Settings → API
3. Dans la section "CORS", ajoutez votre URL :
   - Si Vercel : `https://panama-clicker.vercel.app`
   - Si Netlify : `https://panama-clicker.netlify.app`
4. Cliquez sur "Save"

---

## ✅ C'est tout !

Votre jeu est maintenant en ligne et accessible partout dans le monde ! 🎉

