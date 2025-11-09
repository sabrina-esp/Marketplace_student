# Page de Profil Utilisateur - Documentation

## 📋 Fonctionnalités Implémentées

### ✅ Authentification et Sécurité
- **Protection de route** : Redirection automatique vers la page d'accueil si l'utilisateur n'est pas connecté
- **Vérification JWT** : Validation du token à chaque requête API
- **Changement de mot de passe sécurisé** : Vérification de l'ancien mot de passe avant modification
- **Déconnexion** : Suppression du token et des données utilisateur du localStorage

### 👤 Gestion du Profil

#### Informations Personnelles
- **Nom** : Modification du nom d'utilisateur
- **Email** : Affichage de l'email (non modifiable)
- **Téléphone** : Ajout/modification du numéro de téléphone
- **Bio** : Description personnelle (max 500 caractères)

#### Avatar
- **Upload d'image** : Téléchargement de photo de profil (max 1MB)
- **Prévisualisation** : Affichage instantané de l'image sélectionnée
- **Stockage base64** : Sauvegarde directe en base de données
- **Suppression** : Possibilité de supprimer la photo de profil
- **Avatar par défaut** : Initiale du nom en cas d'absence de photo

### 🎨 Interface Utilisateur
- **Design moderne** : Interface élégante avec Tailwind CSS
- **Responsive** : Adaptation à tous les écrans
- **États de chargement** : Indicateurs visuels pendant les opérations
- **Notifications Toast** : Messages de succès/erreur en temps réel
- **Validation des formulaires** : Contrôles côté client et serveur

## 🗂️ Structure des Fichiers

```
app/
├── profile/
│   └── page.tsx                    # Page de profil principale (TypeScript)
├── api/
│   └── profile/
│       ├── update/
│       │   └── route.js           # API de mise à jour du profil
│       ├── change-password/
│       │   └── route.js           # API de changement de mot de passe
│       └── upload-avatar/
│           └── route.js           # API d'upload/suppression d'avatar
└── components/
    └── Toast/
        └── Toast.tsx              # Composant de notifications

lib/
└── models/
    └── User.js                    # Modèle utilisateur mis à jour
```

## 🔌 Endpoints API

### 1. GET /api/auth/me
Récupère les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+33 6 12 34 56 78",
    "bio": "Développeur passionné",
    "avatar": "data:image/png;base64,...",
    "isVerified": true,
    "isEmailVerified": true,
    "createdAt": "...",
    "lastLoginAt": "..."
  }
}
```

### 2. PUT /api/profile/update
Met à jour les informations du profil.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+33 6 12 34 56 78",
  "bio": "Ma nouvelle bio"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "user": { ... }
}
```

### 3. PUT /api/profile/change-password
Change le mot de passe de l'utilisateur.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Mot de passe changé avec succès"
}
```

### 4. POST /api/profile/upload-avatar
Upload une photo de profil.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "avatar": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Avatar mis à jour avec succès",
  "avatar": "data:image/png;base64,..."
}
```

### 5. DELETE /api/profile/upload-avatar
Supprime la photo de profil.

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Avatar supprimé avec succès"
}
```

## 🔒 Validations

### Côté Client
- Nom : minimum 2 caractères
- Téléphone : format valide (chiffres, +, -, espaces, parenthèses)
- Bio : maximum 500 caractères
- Avatar : maximum 1MB, format image
- Mot de passe : minimum 6 caractères
- Confirmation de mot de passe : doit correspondre

### Côté Serveur
- Vérification du token JWT
- Validation des formats de données
- Limitations de taille
- Vérification de l'ancien mot de passe

## 🎯 Utilisation

### Accéder au Profil
1. Se connecter avec un compte valide
2. Naviguer vers `/profile`
3. La page charge automatiquement les données de l'utilisateur connecté

### Modifier le Profil
1. Cliquer sur "✏️ Modifier" dans la section Informations personnelles
2. Modifier les champs souhaités
3. Cliquer sur "Enregistrer" ou "Annuler"

### Changer l'Avatar
1. Cliquer sur l'icône appareil photo sur l'avatar
2. Sélectionner une image (max 1MB)
3. L'image est uploadée automatiquement
4. Pour supprimer : cliquer sur "Supprimer la photo"

### Changer le Mot de Passe
1. Cliquer sur "🔒 Changer le mot de passe" dans la section Sécurité
2. Entrer l'ancien mot de passe
3. Entrer le nouveau mot de passe (min 6 caractères)
4. Confirmer le nouveau mot de passe
5. Cliquer sur "Changer le mot de passe"

### Se Déconnecter
1. Cliquer sur le bouton "Déconnexion" en haut à droite
2. Confirmer la déconnexion
3. Redirection vers la page d'accueil

## 🔧 Modèle de Données

### Nouveaux champs ajoutés au modèle User :

```javascript
{
  phone: {
    type: String,
    trim: true,
    default: null
  },
  bio: {
    type: String,
    trim: true,
    default: null,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
  },
  avatar: {
    type: String,  // Stockage en base64
    default: null
  }
}
```

## 🎨 Design et UX

- **Gradient violet/indigo** : Design moderne et professionnel
- **Cartes blanches** : Sections bien délimitées
- **Animations** : Transitions fluides
- **Responsive** : Adaptation mobile/tablette/desktop
- **Feedback visuel** : Toast notifications pour chaque action
- **États de chargement** : Indicateurs pendant les requêtes
- **Validation en temps réel** : Compteur de caractères pour la bio

## 🚀 Prochaines Améliorations Possibles

- [ ] Upload d'avatar vers un service cloud (Cloudinary, AWS S3)
- [ ] Historique des modifications
- [ ] Authentification à deux facteurs (2FA)
- [ ] Gestion des sessions actives
- [ ] Export des données personnelles
- [ ] Mode sombre persistant
- [ ] Notifications par email lors des modifications

## 📝 Notes Techniques

- **TypeScript** : Page de profil en TypeScript pour une meilleure sécurité de type
- **Tailwind CSS** : Classes utilitaires pour un styling rapide
- **Next.js App Router** : Utilisation des dernières fonctionnalités de Next.js
- **JWT** : Authentification basée sur les tokens
- **MongoDB** : Stockage des données utilisateur
- **bcryptjs** : Hachage sécurisé des mots de passe
