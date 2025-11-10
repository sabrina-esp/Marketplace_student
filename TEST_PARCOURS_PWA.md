# 🎯 Guide de Test du Parcours Utilisateur PWA

## 📋 Vue d'Ensemble

Ce guide vous permet de tester le **parcours utilisateur complet de A à Z** de la PWA Marketplace Student, tel que documenté dans le scénario de Marie Dubois.

---

## 🚀 Démarrage Rapide

### 1. Lancer l'Application

```powershell
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur : **http://localhost:3011**

---

## 📱 Ressources de Test Disponibles

### 1. **Documentation Complète du Parcours**
📄 Fichier : `PARCOURS_UTILISATEUR_PWA.md`

- Scénario détaillé de Marie sur 30 jours
- 24 étapes du parcours utilisateur
- 12 phases de l'expérience
- Statistiques et insights

### 2. **Démonstration Interactive**
🔗 URL : **http://localhost:3011/demo**

- Interface visuelle interactive
- Navigation étape par étape
- Progression en temps réel
- Animations et effets visuels

### 3. **Présentation Visuelle**
🔗 URL : **http://localhost:3011/pwa-journey.html**

- Timeline visuelle du parcours
- Design moderne et engageant
- Statistiques clés
- Parfait pour présentation

---

## 🧪 Plan de Test par Phase

### Phase 1 : Découverte & Installation PWA

#### Test 1.1 : Première Visite
```
1. Ouvrir http://localhost:3011 dans Chrome
2. Attendre 5 secondes
3. ✅ Vérifier : La bannière violette PWA apparaît en bas
```

#### Test 1.2 : Installation
```
1. Cliquer sur "Install App" dans la bannière
2. Accepter l'installation dans le popup du navigateur
3. ✅ Vérifier : L'icône apparaît sur le bureau/home screen
4. ✅ Vérifier : Console affiche "✅ PWA installed successfully"
```

---

### Phase 2 : Inscription & Vérification

#### Test 2.1 : Création de Compte
```
1. Cliquer "Sign Up" dans la navbar
2. Remplir le formulaire :
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
3. Cliquer "Create Account"
4. ✅ Vérifier : Message de succès affiché
5. ✅ Vérifier : Email de vérification envoyé
```

#### Test 2.2 : Vérification Email
```
1. Ouvrir la console serveur
2. Copier le code de vérification (6 chiffres)
3. Entrer le code dans la page de vérification
4. ✅ Vérifier : "Email Verified Successfully!"
5. ✅ Vérifier : Redirection vers le dashboard
```

---

### Phase 3 : Navigation & Exploration

#### Test 3.1 : Page d'Accueil
```
1. Naviguer vers http://localhost:3011
2. ✅ Vérifier : Banner visible
3. ✅ Vérifier : Companies logos affichés
4. ✅ Vérifier : Onglets de cours fonctionnels
5. ✅ Vérifier : Témoignages d'étudiants
```

#### Test 3.2 : Navigation Fluide
```
1. Tester tous les liens de navigation
2. ✅ Vérifier : Transitions smooth
3. ✅ Vérifier : Pas d'erreurs console
4. ✅ Vérifier : Responsive sur mobile
```

---

### Phase 4 : Profil & Personnalisation

#### Test 4.1 : Accès au Profil
```
1. Se connecter avec un compte
2. Naviguer vers http://localhost:3011/profile
3. ✅ Vérifier : Informations utilisateur affichées
4. ✅ Vérifier : Avatar par défaut présent
```

#### Test 4.2 : Modification du Profil
```
1. Cliquer "Edit Profile"
2. Modifier :
   - Name
   - Phone
   - Bio
3. Upload une photo d'avatar
4. Cliquer "Save Changes"
5. ✅ Vérifier : Message "Profile updated successfully!"
6. ✅ Vérifier : Les modifications sont sauvegardées
```

#### Test 4.3 : Mode Sombre
```
1. Sur la page profile
2. Cliquer l'icône 🌙 (Moon)
3. ✅ Vérifier : Interface passe en dark mode
4. ✅ Vérifier : Préférence sauvegardée
5. Recharger la page
6. ✅ Vérifier : Dark mode toujours actif
```

---

### Phase 5 : Système d'Invitation

#### Test 5.1 : Inviter un Ami
```
1. Sur http://localhost:3011/profile
2. Cliquer "Invite a Friend"
3. Entrer un email : friend@example.com
4. (Optionnel) Ajouter un message personnel
5. Cliquer "Send Invitation"
6. ✅ Vérifier : "Invitation sent successfully!"
7. ✅ Vérifier : Console serveur montre l'email envoyé
```

#### Test 5.2 : Vérifier l'Email d'Invitation
```
1. Ouvrir les logs du serveur
2. ✅ Vérifier : Email contient :
   - Nom de l'invitant
   - Message personnel (si ajouté)
   - Lien d'inscription avec tracking
   - Design HTML responsive
```

---

### Phase 6 : Notifications Push

#### Test 6.1 : Abonnement aux Notifications
```
1. Naviguer vers http://localhost:3011/profile
2. Section "Notifications"
3. ✅ Vérifier : Status de l'abonnement affiché
4. Cliquer "Subscribe to Notifications" (si non abonné)
5. Accepter dans le popup du navigateur
6. ✅ Vérifier : "Subscribed to push notifications!"
```

#### Test 6.2 : Test d'Envoi de Notification
```
1. Aller sur http://localhost:3011/api/notifications/test
2. Ou utiliser le bouton test dans le profil
3. ✅ Vérifier : Notification apparaît sur le système
4. ✅ Vérifier : Titre et message corrects
5. Cliquer sur la notification
6. ✅ Vérifier : Ouvre l'app PWA
```

---

### Phase 7 : Mode Offline

#### Test 7.1 : Tester le Service Worker
```
1. Ouvrir Chrome DevTools (F12)
2. Aller dans l'onglet "Application"
3. Section "Service Workers"
4. ✅ Vérifier : Service Worker actif
5. ✅ Vérifier : Status "activated and is running"
```

#### Test 7.2 : Navigation Offline
```
1. Dans DevTools, onglet "Network"
2. Cocher "Offline" (simule perte de connexion)
3. Naviguer vers http://localhost:3011/profile
4. ✅ Vérifier : Page se charge depuis le cache
5. Essayer d'autres pages
6. ✅ Vérifier : Fallback vers page offline si non cachée
```

#### Test 7.3 : Page Offline Dédiée
```
1. En mode offline
2. Naviguer vers une page non cachée
3. ✅ Vérifier : Page /offline s'affiche
4. ✅ Vérifier : Message clair et design cohérent
5. ✅ Vérifier : Bouton "Retry Connection"
```

---

### Phase 8 : Paramètres & Confidentialité

#### Test 8.1 : Page Settings
```
1. Naviguer vers http://localhost:3011/settings
2. ✅ Vérifier : Onglets disponibles
3. ✅ Vérifier : Préférences sauvegardées
```

#### Test 8.2 : Page Privacy
```
1. Naviguer vers http://localhost:3011/privacy
2. ✅ Vérifier : Options de confidentialité
3. Modifier les préférences
4. ✅ Vérifier : Changements sauvegardés
```

---

### Phase 9 : Support & Aide

#### Test 9.1 : Page Help
```
1. Naviguer vers http://localhost:3011/help
2. ✅ Vérifier : Formulaire de contact visible
3. Remplir et envoyer un message
4. ✅ Vérifier : Confirmation d'envoi
5. ✅ Vérifier : Email reçu par le support
```

---

### Phase 10 : Performance PWA

#### Test 10.1 : Audit Lighthouse
```
1. Ouvrir Chrome DevTools
2. Onglet "Lighthouse"
3. Sélectionner "Progressive Web App"
4. Cliquer "Generate report"
5. ✅ Vérifier : Score PWA > 80
6. ✅ Vérifier : Tous les critères PWA passés
```

#### Test 10.2 : Manifest
```
1. DevTools → Application → Manifest
2. ✅ Vérifier : manifest.json chargé
3. ✅ Vérifier : Icônes présentes
4. ✅ Vérifier : display: "standalone"
5. ✅ Vérifier : Theme color défini
```

#### Test 10.3 : Cache Storage
```
1. DevTools → Application → Cache Storage
2. ✅ Vérifier : Cache "marketplace-v1" existe
3. ✅ Vérifier : Ressources essentielles cachées
4. Cliquer sur les entrées du cache
5. ✅ Vérifier : Pages et assets présents
```

---

## 🎨 Test de l'Interface de Démonstration

### Accéder à la Démo Interactive

```
URL : http://localhost:3011/demo
```

### Fonctionnalités à Tester

1. **Navigation entre Étapes**
   - ✅ Bouton "Étape Suivante"
   - ✅ Bouton "Étape Précédente"
   - ✅ Clic direct sur une étape dans la sidebar

2. **Progress Bar**
   - ✅ Met à jour le pourcentage
   - ✅ Animation fluide
   - ✅ Affiche "Étape X / 24"

3. **Timeline des Phases**
   - ✅ Phases colorées selon statut
   - ✅ Phase actuelle highlighted
   - ✅ Phases complétées en vert

4. **Visuels par Phase**
   - ✅ Icônes appropriées pour chaque phase
   - ✅ Descriptions claires
   - ✅ Actions définies

5. **Fin du Parcours**
   - ✅ Animation confetti à la dernière étape
   - ✅ Bouton "Recommencer le Parcours"
   - ✅ Statistiques finales affichées

---

## 📊 Test de la Présentation Visuelle

### Accéder à la Présentation

```
URL : http://localhost:3011/pwa-journey.html
```

### Éléments à Vérifier

1. **Header**
   - ✅ Titre et description clairs
   - ✅ Persona de Marie mentionnée

2. **Timeline Visuelle**
   - ✅ 24 étapes visibles
   - ✅ 12 phases groupées
   - ✅ Numérotation correcte

3. **Design & Animations**
   - ✅ Hover effects sur les cartes
   - ✅ Timeline centrale responsive
   - ✅ Couleurs cohérentes (purple/indigo)

4. **Fonctionnalités Clés**
   - ✅ 6 features PWA mises en avant
   - ✅ Hover effects interactifs

5. **Statistiques**
   - ✅ 6 cartes de stats
   - ✅ Chiffres clés affichés
   - ✅ Design moderne

6. **Conclusion**
   - ✅ Message final impactant
   - ✅ Résumé du parcours

---

## 🔍 Checklist Complète du Parcours

### ✅ Phase 1 : Découverte
- [ ] Page d'accueil chargée
- [ ] Bannière PWA apparaît après 5s
- [ ] Installation PWA fonctionnelle

### ✅ Phase 2 : Inscription
- [ ] Formulaire d'inscription fonctionne
- [ ] Email de vérification envoyé
- [ ] Compte activé avec succès

### ✅ Phase 3 : Installation
- [ ] PWA installée sur home screen
- [ ] Notifications activées
- [ ] Lancement standalone

### ✅ Phase 4 : Profil
- [ ] Profil accessible
- [ ] Modification profil OK
- [ ] Avatar uploadable
- [ ] Dark mode fonctionne

### ✅ Phase 5 : Social
- [ ] Invitation d'ami possible
- [ ] Email envoyé correctement
- [ ] Lien de parrainage valide

### ✅ Phase 6 : Notifications
- [ ] Abonnement fonctionnel
- [ ] Test notification OK
- [ ] Clic notification ouvre l'app

### ✅ Phase 7 : Offline
- [ ] Service Worker actif
- [ ] Cache fonctionnel
- [ ] Page offline affichée
- [ ] Synchronisation auto

### ✅ Phase 8 : Paramètres
- [ ] Settings accessible
- [ ] Privacy controls OK
- [ ] Préférences sauvegardées

### ✅ Phase 9 : Support
- [ ] Help page accessible
- [ ] Contact form fonctionne
- [ ] Email support envoyé

### ✅ Phase 10 : Performance
- [ ] Lighthouse score > 80
- [ ] Manifest valide
- [ ] Cache actif
- [ ] PWA criteria passed

---

## 🎯 Scénarios de Test Avancés

### Scénario A : Parcours Complet de Marie

```
Durée estimée : 30-45 minutes

1. Découverte (5 min)
   - Ouvrir l'app
   - Observer la bannière PWA
   - Installer l'app

2. Inscription (5 min)
   - Créer un compte
   - Vérifier l'email
   - Se connecter

3. Exploration (10 min)
   - Naviguer dans les pages
   - Consulter les cours
   - Voir les mentors

4. Personnalisation (5 min)
   - Compléter le profil
   - Upload avatar
   - Activer dark mode

5. Social (5 min)
   - Inviter 2 amis
   - Vérifier emails envoyés

6. Offline (5 min)
   - Passer en mode offline
   - Naviguer dans l'app
   - Revenir online

7. Notifications (5 min)
   - S'abonner
   - Tester une notification
   - Cliquer et ouvrir
```

### Scénario B : Test Rapide PWA

```
Durée estimée : 10 minutes

1. Installation PWA (2 min)
2. Test offline (3 min)
3. Notification test (2 min)
4. Lighthouse audit (3 min)
```

### Scénario C : Présentation Client

```
Durée estimée : 15 minutes

1. Ouvrir http://localhost:3011/pwa-journey.html
2. Présenter la timeline visuelle
3. Expliquer chaque phase
4. Montrer les statistiques
5. Démontrer les features clés
```

---

## 🐛 Troubleshooting

### Problème : Bannière PWA n'apparaît pas

```
Solutions :
1. Vérifier console pour erreurs
2. Tester sur Chrome (pas Firefox/Safari)
3. Vérifier que HTTPS est utilisé (ou localhost)
4. Clear localStorage : localStorage.removeItem('pwa-install-banner-seen')
```

### Problème : Notifications ne fonctionnent pas

```
Solutions :
1. Vérifier que notifications sont autorisées dans le navigateur
2. Tester uniquement sur HTTPS ou localhost
3. Vérifier console pour erreurs
4. Tester avec un autre navigateur
```

### Problème : Mode offline ne fonctionne pas

```
Solutions :
1. Vérifier que Service Worker est actif (DevTools → Application)
2. Recharger la page avec Ctrl+Shift+R
3. Vérifier cache storage
4. Désinstaller et réinstaller le SW
```

### Problème : Emails ne sont pas envoyés

```
Solutions :
1. Vérifier les variables d'environnement (.env.local)
2. Tester la connexion SMTP
3. Vérifier logs serveur
4. Utiliser test-invite-email.js pour debug
```

---

## 📈 Métriques de Succès

### Critères PWA
- ✅ Installation possible
- ✅ Fonctionne offline
- ✅ Notifications push actives
- ✅ Manifest valide
- ✅ Service Worker actif
- ✅ HTTPS (ou localhost)

### Critères UX
- ✅ Navigation fluide
- ✅ Temps de chargement < 3s
- ✅ Responsive mobile
- ✅ Animations smooth
- ✅ Feedback utilisateur clair

### Critères Fonctionnels
- ✅ Inscription/Login OK
- ✅ Profil éditable
- ✅ Invitations fonctionnelles
- ✅ Support accessible
- ✅ Settings sauvegardés

---

## 🎓 Ressources Additionnelles

### Fichiers de Documentation
- `PARCOURS_UTILISATEUR_PWA.md` - Scénario détaillé
- `PWA_README.md` - Guide technique PWA
- `INVITATION_SYSTEM_README.md` - Système d'invitation
- `TEST_GUIDE.md` - Guide de tests

### Fichiers de Test
- `test-invite-email.js` - Test emails d'invitation
- `test-profile-api.js` - Test API profil
- `test-console.js` - Tests console

### Pages de Démonstration
- `/demo` - Interface interactive
- `/pwa-journey.html` - Présentation visuelle

---

## ✨ Conclusion

Ce guide vous permet de tester **l'intégralité du parcours utilisateur** de la PWA Marketplace Student, de la découverte initiale à l'accomplissement final, exactement comme Marie Dubois l'a vécu dans notre scénario.

**Bon testing ! 🚀**

---

**Questions ou problèmes ?**
Consultez la section Troubleshooting ou vérifiez les logs serveur.
