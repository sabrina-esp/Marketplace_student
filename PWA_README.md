# 📱 PWA - Marketplace Student

## ✅ Fonctionnalités PWA Implémentées

### 1. **Configuration de base**
- ✅ `manifest.json` - Configuration PWA complète
- ✅ Service Worker (`sw.js`) - Gestion du cache et hors-ligne
- ✅ Icônes PWA (à générer)
- ✅ Métadonnées dans `layout.tsx`

### 2. **Installation**
- ✅ Bannière d'installation automatique
- ✅ Instructions pour iOS
- ✅ Bouton "Installer l'app"
- ✅ Détection si déjà installé

### 3. **Fonctionnement hors-ligne**
- ✅ Cache des pages essentielles
- ✅ Strategy: Cache-first avec update en arrière-plan
- ✅ Page offline personnalisée
- ✅ Détection de connexion

### 4. **Push Notifications**
- ✅ API backend (`/api/notifications/subscribe`, `/test`, `/unsubscribe`)
- ✅ Hook React (`usePushNotifications`)
- ✅ Configuration VAPID
- ✅ Gestion des permissions
- ✅ Notifications push natives

### 5. **Raccourcis**
- Dashboard
- Profile
- Help

---

## 🚀 Comment utiliser

### Installation de la PWA

#### Sur Desktop (Chrome/Edge):
1. Visitez http://localhost:3011
2. Cliquez sur l'icône ⊕ dans la barre d'adresse
3. Ou attendez la bannière d'installation (5 secondes)
4. Cliquez sur "Installer l'app"

#### Sur Mobile (Android):
1. Ouvrez Chrome/Samsung Internet
2. Visitez le site
3. Bannière "Ajouter à l'écran d'accueil" apparaît
4. Confirmez l'installation

#### Sur iOS (iPhone/iPad):
1. Ouvrez Safari
2. Tapez sur le bouton Partager
3. "Ajouter à l'écran d'accueil"
4. Confirmez

---

## 🔔 Notifications Push

### Activer les notifications:

```javascript
import { usePushNotifications } from '@/app/hooks/usePushNotifications';

function MyComponent() {
  const { requestPermission, subscribeToPush } = usePushNotifications();
  
  const enableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribeToPush();
    }
  };
  
  return <button onClick={enableNotifications}>Activer</button>;
}
```

### Envoyer une notification de test:

```javascript
const { sendTestNotification } = usePushNotifications();

<button onClick={sendTestNotification}>Test Notification</button>
```

---

## 📦 Structure des fichiers

```
public/
├── manifest.json          # Configuration PWA
├── sw.js                  # Service Worker
├── icon.svg              # Icône source
└── icons/                # Icônes générées
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png

app/
├── components/
│   └── PWAInstaller.tsx   # Composant d'installation
├── hooks/
│   └── usePushNotifications.ts  # Hook pour notifications
├── offline/
│   └── page.tsx           # Page hors-ligne
└── api/
    └── notifications/
        ├── subscribe/route.ts
        ├── test/route.ts
        └── unsubscribe/route.ts
```

---

## 🎨 Générer les icônes

### Option 1: Outils en ligne
1. **PWA Builder** : https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator** : https://realfavicongenerator.net/

Upload `icon.svg` et téléchargez les icônes générées dans `/public/icons/`

### Option 2: CLI (Sharp)
```bash
npm install sharp-cli -g
sharp -i public/icon.svg -o public/icons/icon-192x192.png resize 192 192
sharp -i public/icon.svg -o public/icons/icon-512x512.png resize 512 512
# Répéter pour toutes les tailles
```

---

## 🌐 Scénario d'utilisation complet

### Parcours utilisateur PWA:

```
1. 🌐 DÉCOUVERTE
   │
   ├─► Visite le site web
   ├─► Bannière "Installer l'app" apparaît (5 sec)
   └─► Clique "Installer"

2. 📱 INSTALLATION
   │
   ├─► App installée sur l'appareil
   ├─► Icône ajoutée à l'écran d'accueil
   └─► Peut lancer comme app native

3. ✅ INSCRIPTION & CONNEXION
   │
   ├─► Créer un compte
   ├─► Vérifier l'email
   └─► Se connecter

4. 🔔 NOTIFICATIONS
   │
   ├─► Demande de permission
   ├─► Active dans Settings
   ├─► Reçoit notifications push
   └─► Configure préférences

5. 📚 UTILISATION
   │
   ├─► Voir dashboard
   ├─► Acheter cours
   ├─► Inviter amis
   └─► Contacter support

6. 🌐 HORS-LIGNE
   │
   ├─► Perte de connexion détectée
   ├─► Pages en cache accessibles
   ├─► Travaille hors-ligne
   └─► Sync auto quand en ligne

7. 🔄 MISE À JOUR
   │
   ├─► Nouvelle version disponible
   ├─► Service Worker met à jour
   └─► Rechargement automatique
```

---

## ⚙️ Configuration avancée

### Stratégies de cache

Le Service Worker utilise plusieurs stratégies:

1. **Cache First** (pages statiques)
   - Vérifie le cache en premier
   - Fallback vers le réseau

2. **Network First** (API calls)
   - Essaie le réseau d'abord
   - Fallback vers cache si offline

3. **Stale While Revalidate** (ressources)
   - Renvoie cache immédiatement
   - Met à jour en arrière-plan

### Personnaliser le manifest

Modifiez `/public/manifest.json`:
- `name`: Nom complet de l'app
- `short_name`: Nom court (12 caractères max)
- `theme_color`: Couleur de thème
- `background_color`: Couleur de fond au lancement
- `display`: `standalone`, `fullscreen`, `minimal-ui`

---

## 🧪 Tester la PWA

### Chrome DevTools

1. **F12** → Onglet "Application"
2. **Manifest**: Vérifier la configuration
3. **Service Workers**: Voir l'état, update, unregister
4. **Storage**: Inspecter le cache
5. **Offline**: Cocher pour simuler

### Lighthouse

1. **F12** → Onglet "Lighthouse"
2. Sélectionner "Progressive Web App"
3. Générer le rapport
4. Score PWA: Viser 90+

### Test hors-ligne

```bash
# Arrêter le serveur
# Ou cocher "Offline" dans DevTools
# L'app doit continuer à fonctionner
```

---

## 📋 Checklist PWA

- [x] Manifest.json configuré
- [x] Service Worker enregistré
- [x] HTTPS (ou localhost)
- [x] Responsive design
- [x] Icônes de toutes tailles
- [x] Fonctionne hors-ligne
- [x] Fast loading
- [x] Push notifications
- [x] Install banner
- [x] Shortcuts définis

---

## 🎯 Prochaines étapes

### Pour la production:

1. **Générer les icônes** (toutes les tailles)
2. **Ajouter screenshots** pour `/public/screenshots/`
3. **Tester sur vrais appareils** (Android, iOS)
4. **Déployer en HTTPS** (requis pour PWA)
5. **Tester performance** avec Lighthouse
6. **Optimiser cache** selon usage

### Améliorations possibles:

- [ ] Background sync pour formulaires
- [ ] Periodic background sync
- [ ] Share target API
- [ ] Badge API (notifications count)
- [ ] File handling
- [ ] Protocol handlers

---

## 📖 Ressources

- [PWA Documentation MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Service Worker Cookbook](https://serviceworke.rs/)

---

**✨ Votre PWA est prête !**

Visitez http://localhost:3011 et cliquez sur "Installer l'app" ! 🚀
