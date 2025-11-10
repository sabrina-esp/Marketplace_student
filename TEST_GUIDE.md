# 🧪 Guide de Test - Page de Profil

## Prérequis
- MongoDB doit être en cours d'exécution sur `mongodb://localhost:27017/nextdb`
- Le serveur Next.js doit être démarré sur `http://localhost:3011`
- Un compte utilisateur doit être créé et vérifié

## 📝 Étapes de Test

### 1️⃣ Préparation
```powershell
# Démarrer MongoDB (si pas déjà démarré)
# Dans un terminal séparé

# Démarrer le serveur Next.js
npm run dev
```

### 2️⃣ Créer un Compte de Test

1. Aller sur `http://localhost:3011`
2. Cliquer sur "Sign Up" ou "Register"
3. Créer un compte :
   - Email: `test@example.com`
   - Mot de passe: `test123`
   - Nom: `Test User`
4. Vérifier l'email (vérifier les logs du serveur pour le lien de vérification)
5. Se connecter avec le compte

### 3️⃣ Tests de la Page de Profil

#### Test 1: Accès à la Page
- [ ] Naviguer vers `/profile`
- [ ] Vérifier que la page se charge correctement
- [ ] Vérifier que les informations de l'utilisateur s'affichent

#### Test 2: Protection de Route
- [ ] Se déconnecter
- [ ] Essayer d'accéder à `/profile` directement
- [ ] Vérifier la redirection vers la page d'accueil

#### Test 3: Upload d'Avatar
- [ ] Se reconnecter
- [ ] Aller sur `/profile`
- [ ] Cliquer sur l'icône de caméra sur l'avatar
- [ ] Sélectionner une image (< 1MB)
- [ ] Vérifier que l'image s'affiche immédiatement
- [ ] Vérifier le toast de succès "Photo de profil mise à jour"
- [ ] Rafraîchir la page et vérifier que l'avatar persiste

#### Test 4: Suppression d'Avatar
- [ ] Cliquer sur "Supprimer la photo"
- [ ] Confirmer la suppression
- [ ] Vérifier le retour à l'initiale du nom
- [ ] Vérifier le toast de succès

#### Test 5: Modification du Profil
- [ ] Cliquer sur "✏️ Modifier" dans Informations personnelles
- [ ] Modifier le nom: `Test User Updated`
- [ ] Ajouter un téléphone: `+33 6 12 34 56 78`
- [ ] Ajouter une bio: `Je suis un utilisateur de test`
- [ ] Cliquer sur "Enregistrer"
- [ ] Vérifier le toast de succès
- [ ] Vérifier que les données sont mises à jour

#### Test 6: Annulation de Modification
- [ ] Cliquer sur "✏️ Modifier"
- [ ] Modifier des champs
- [ ] Cliquer sur "Annuler"
- [ ] Vérifier que les modifications sont annulées

#### Test 7: Validation des Données
- [ ] Essayer de modifier le nom avec seulement 1 caractère
- [ ] Essayer d'ajouter une bio > 500 caractères
- [ ] Essayer un téléphone avec des caractères invalides
- [ ] Vérifier les messages d'erreur

#### Test 8: Changement de Mot de Passe
- [ ] Cliquer sur "🔒 Changer le mot de passe"
- [ ] Entrer l'ancien mot de passe: `test123`
- [ ] Entrer un nouveau mot de passe: `newtest123`
- [ ] Confirmer le nouveau mot de passe: `newtest123`
- [ ] Cliquer sur "Changer le mot de passe"
- [ ] Vérifier le toast de succès
- [ ] Se déconnecter
- [ ] Se reconnecter avec le nouveau mot de passe

#### Test 9: Validation du Changement de Mot de Passe
- [ ] Essayer avec un mauvais ancien mot de passe
- [ ] Essayer avec une confirmation différente
- [ ] Essayer avec un mot de passe < 6 caractères
- [ ] Vérifier les messages d'erreur appropriés

#### Test 10: Déconnexion
- [ ] Cliquer sur "Déconnexion"
- [ ] Confirmer la déconnexion
- [ ] Vérifier la redirection vers la page d'accueil
- [ ] Vérifier que le token est supprimé du localStorage

## 🔍 Vérifications dans la Base de Données

```javascript
// Dans MongoDB Compass ou mongosh
use nextdb

// Vérifier que le user a les nouveaux champs
db.users.findOne({ email: "test@example.com" })

// Vérifier la structure :
{
  _id: ObjectId("..."),
  email: "test@example.com",
  name: "Test User Updated",
  phone: "+33 6 12 34 56 78",
  bio: "Je suis un utilisateur de test",
  avatar: "data:image/png;base64,...", // ou null
  password: "...", // hashé
  isEmailVerified: true,
  // ... autres champs
}
```

## 🐛 Debug

### Si la page ne charge pas :
```powershell
# Vérifier les logs du serveur Next.js
# Vérifier la console du navigateur (F12)
```

### Si les APIs ne répondent pas :
```powershell
# Vérifier que MongoDB est démarré
# Vérifier les variables d'environnement dans .env.local
```

### Si le token est invalide :
```javascript
// Dans la console du navigateur
localStorage.getItem('token')
// Copier le token et le décoder sur jwt.io
```

## ✅ Résultat Attendu

Toutes les fonctionnalités doivent fonctionner sans erreur :
- ✅ Protection de route
- ✅ Chargement des données utilisateur
- ✅ Upload et suppression d'avatar
- ✅ Modification du profil
- ✅ Validation des formulaires
- ✅ Changement de mot de passe
- ✅ Toast notifications
- ✅ Déconnexion
- ✅ Responsive design
- ✅ États de chargement

## 📸 Screenshots Attendus

1. **Page de profil** : Avatar, nom, email, badge vérifié
2. **Mode édition** : Formulaire avec champs pré-remplis
3. **Upload avatar** : Prévisualisation de l'image
4. **Changement de mot de passe** : Formulaire sécurisé
5. **Toast notifications** : Messages de succès/erreur
6. **Mobile responsive** : Adaptation sur petit écran
