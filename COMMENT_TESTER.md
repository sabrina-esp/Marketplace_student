# 🧪 GUIDE DE TEST RAPIDE - Page de Profil

## ⚡ Test Rapide (5 minutes)

### Étape 1 : Vérifier que le serveur fonctionne ✅
Le serveur est déjà démarré sur `http://localhost:3011`

---

### Étape 2 : Se Connecter

1. **Ouvrir le navigateur** : `http://localhost:3011`

2. **Se connecter avec un compte existant** ou **créer un nouveau compte** :
   - Cliquer sur "Sign In" ou "Register"
   - Utiliser vos identifiants ou créer un nouveau compte
   - **Important** : Le compte doit être vérifié (vérifier les logs du serveur pour le lien de vérification)

3. **Exemple de compte de test** :
   ```
   Email: test@example.com
   Mot de passe: test123
   ```

---

### Étape 3 : Accéder à la Page de Profil

**Méthode 1 - URL directe :**
```
http://localhost:3011/profile
```

**Méthode 2 - Navigation :**
- Si votre site a un lien vers le profil, cliquez dessus
- Sinon, tapez directement l'URL ci-dessus

**✅ Ce que vous devriez voir :**
- Un bel écran avec un gradient violet/indigo
- Votre avatar (initiale de votre nom dans un cercle)
- Vos informations : nom, email
- Badge "✓ Email vérifié" si votre email est vérifié
- Bouton "Déconnexion" en haut à droite

---

### Étape 4 : Tester l'Upload d'Avatar 📷

1. **Cliquer sur l'icône caméra** sur votre avatar
2. **Sélectionner une image** de votre ordinateur (max 1MB)
3. **Attendre** : L'image devrait s'afficher immédiatement
4. **Vérifier** : Un toast vert "Photo de profil mise à jour" apparaît
5. **Rafraîchir la page** (F5) : L'avatar doit persister

**Pour supprimer l'avatar :**
- Cliquer sur "Supprimer la photo"
- Confirmer → Retour à l'initiale

---

### Étape 5 : Modifier le Profil ✏️

1. **Cliquer sur "✏️ Modifier"** dans la section "Informations personnelles"

2. **Modifier les champs** :
   ```
   Nom: Votre Nouveau Nom
   Téléphone: +33 6 12 34 56 78
   Bio: Je suis un développeur passionné !
   ```

3. **Cliquer sur "Enregistrer"**

4. **Vérifier** :
   - Toast vert "Profil mis à jour avec succès"
   - Les données s'affichent en mode lecture
   - Rafraîchir (F5) → Les données persistent

**Pour annuler :**
- Modifier des champs
- Cliquer sur "Annuler" → Les changements sont annulés

---

### Étape 6 : Changer le Mot de Passe 🔒

1. **Cliquer sur "🔒 Changer le mot de passe"** dans la section "Sécurité"

2. **Remplir le formulaire** :
   ```
   Mot de passe actuel: [votre mot de passe actuel]
   Nouveau mot de passe: nouveauMDP123
   Confirmer: nouveauMDP123
   ```

3. **Cliquer sur "Changer le mot de passe"**

4. **Vérifier** :
   - Toast vert "Mot de passe changé avec succès"
   - Formulaire se ferme

5. **Tester la connexion** :
   - Se déconnecter
   - Se reconnecter avec le NOUVEAU mot de passe

---

### Étape 7 : Tester la Déconnexion 🚪

1. **Cliquer sur "Déconnexion"** (bouton rouge en haut à droite)
2. **Confirmer** dans la popup
3. **Vérifier** : Redirection vers la page d'accueil
4. **Vérifier la protection** :
   - Essayer d'accéder à `http://localhost:3011/profile`
   - Vous devriez être redirigé vers la page d'accueil

---

## 🐛 Tests de Validation

### Test 1 : Validation du Nom
- Essayer de mettre un nom avec 1 seul caractère
- **Résultat attendu** : Message d'erreur

### Test 2 : Validation de la Bio
- Essayer de mettre plus de 500 caractères
- **Résultat attendu** : Compteur rouge + message d'erreur

### Test 3 : Validation du Mot de Passe
- Essayer un nouveau mot de passe < 6 caractères
- **Résultat attendu** : Message d'erreur

### Test 4 : Confirmation du Mot de Passe
- Mettre des mots de passe différents dans "Nouveau" et "Confirmer"
- **Résultat attendu** : Toast rouge "Les mots de passe ne correspondent pas"

### Test 5 : Mauvais Mot de Passe Actuel
- Mettre un mauvais mot de passe actuel
- **Résultat attendu** : Toast rouge "Mot de passe actuel incorrect"

### Test 6 : Image Trop Volumineuse
- Essayer d'uploader une image > 1MB
- **Résultat attendu** : Toast rouge "L'image ne doit pas dépasser 1MB"

---

## 📱 Test Responsive

### Mobile
1. **Ouvrir les DevTools** (F12)
2. **Cliquer sur l'icône mobile** (Toggle device toolbar)
3. **Sélectionner "iPhone 12 Pro"** ou autre
4. **Vérifier** que tout s'affiche bien

### Tablette
1. Sélectionner "iPad Air"
2. Vérifier l'affichage

---

## 🔍 Vérification dans la Base de Données

### Avec MongoDB Compass :
1. Ouvrir MongoDB Compass
2. Se connecter à `mongodb://localhost:27017`
3. Base de données : `nextdb`
4. Collection : `users`
5. Chercher votre utilisateur
6. **Vérifier** que les champs sont bien enregistrés :
   ```json
   {
     "name": "Votre Nouveau Nom",
     "phone": "+33 6 12 34 56 78",
     "bio": "Je suis un développeur passionné !",
     "avatar": "data:image/png;base64,..."
   }
   ```

---

## 🎯 Checklist Complète

- [ ] ✅ Page de profil se charge
- [ ] ✅ Données utilisateur affichées correctement
- [ ] ✅ Avatar par défaut (initiale) affiché
- [ ] ✅ Upload d'avatar fonctionne
- [ ] ✅ Suppression d'avatar fonctionne
- [ ] ✅ Modification du profil fonctionne
- [ ] ✅ Annulation de modification fonctionne
- [ ] ✅ Validation des champs fonctionne
- [ ] ✅ Toast de succès s'affichent
- [ ] ✅ Toast d'erreur s'affichent
- [ ] ✅ Changement de mot de passe fonctionne
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Protection de route fonctionne
- [ ] ✅ Données persistent après rafraîchissement
- [ ] ✅ Responsive mobile/tablette fonctionne
- [ ] ✅ Données enregistrées en base de données

---

## 🎥 Test Vidéo (Optionnel)

Pour enregistrer votre test :
1. Ouvrir OBS Studio ou un enregistreur d'écran
2. Suivre toutes les étapes ci-dessus
3. Enregistrer une vidéo de démonstration

---

## 💡 Astuce : Test Console Navigateur

Ouvrir la console (F12) et taper :

```javascript
// Vérifier le token
console.log('Token:', localStorage.getItem('token'));

// Vérifier les données utilisateur
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Tester l'API manuellement
const token = localStorage.getItem('token');
fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log('Profile API:', d));
```

---

## ✅ RÉSULTAT ATTENDU

Si tout fonctionne :
- 🟢 Toutes les fonctionnalités marchent sans erreur
- 🟢 Les données sont bien sauvegardées
- 🟢 L'interface est fluide et responsive
- 🟢 Les validations protègent contre les erreurs
- 🟢 Les notifications informent l'utilisateur

**Félicitations ! Votre page de profil est opérationnelle ! 🎉**

---

## 🆘 En cas de Problème

### Problème : "Non authentifié"
**Solution :** Se reconnecter pour obtenir un nouveau token

### Problème : "Erreur serveur"
**Solution :** Vérifier que MongoDB est démarré

### Problème : Avatar ne s'affiche pas
**Solution :** Vérifier la taille de l'image (< 1MB)

### Problème : Modification ne se sauvegarde pas
**Solution :** Vérifier la console du navigateur pour les erreurs

### Problème : Page ne charge pas
**Solution :** Vérifier que le serveur Next.js est démarré
