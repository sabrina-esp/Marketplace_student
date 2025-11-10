// 🧪 SCRIPT DE TEST INTERACTIF - Page de Profil
// Copiez ce script dans la console du navigateur (F12) pour tester les APIs

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🧪 TEST AUTOMATIQUE DE LA PAGE DE PROFIL              ║
║                                                          ║
║   Instructions :                                         ║
║   1. Ouvrez la console (F12)                            ║
║   2. Collez ce script complet                           ║
║   3. Suivez les instructions ci-dessous                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

// Vérifier si l'utilisateur est connecté
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('\n📋 STATUT D\'AUTHENTIFICATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (!token) {
    console.log('❌ Pas de token trouvé');
    console.log('💡 Vous devez vous connecter d\'abord');
    console.log('\nPour vous connecter :');
    console.log('1. Allez sur http://localhost:3011');
    console.log('2. Cliquez sur "Sign In"');
    console.log('3. Connectez-vous avec vos identifiants');
    console.log('4. Revenez sur /profile');
    return false;
  }
  
  console.log('✅ Token trouvé:', token.substring(0, 20) + '...');
  
  if (user) {
    const userData = JSON.parse(user);
    console.log('✅ Utilisateur:', userData.email);
    console.log('📧 Email:', userData.email);
    console.log('👤 Nom:', userData.name);
  }
  
  return true;
}

// Tester l'API /api/auth/me
async function testGetProfile() {
  console.log('\n🔍 TEST 1 : Récupération du profil');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Profil récupéré avec succès');
      console.table({
        'ID': data.user.id,
        'Email': data.user.email,
        'Nom': data.user.name || 'Non renseigné',
        'Téléphone': data.user.phone || 'Non renseigné',
        'Bio': data.user.bio ? data.user.bio.substring(0, 50) + '...' : 'Non renseigné',
        'Avatar': data.user.avatar ? 'Oui (' + data.user.avatar.length + ' chars)' : 'Non',
        'Email vérifié': data.user.isEmailVerified ? 'Oui' : 'Non'
      });
      return data.user;
    } else {
      console.log('❌ Erreur:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur de requête:', error);
    return null;
  }
}

// Tester la mise à jour du profil
async function testUpdateProfile() {
  console.log('\n✏️  TEST 2 : Mise à jour du profil');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const token = localStorage.getItem('token');
  
  const updates = {
    name: 'Test User ' + Date.now(),
    phone: '+33 6 12 34 56 78',
    bio: 'Profil mis à jour automatiquement par le script de test le ' + new Date().toLocaleString()
  };
  
  console.log('📝 Données à mettre à jour:', updates);
  
  try {
    const response = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Profil mis à jour avec succès');
      console.log('📊 Nouvelles données:');
      console.table({
        'Nom': data.user.name,
        'Téléphone': data.user.phone,
        'Bio': data.user.bio
      });
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return true;
    } else {
      console.log('❌ Erreur:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de requête:', error);
    return false;
  }
}

// Tester l'upload d'un avatar (exemple avec une image par défaut)
async function testAvatarUpload() {
  console.log('\n📷 TEST 3 : Upload d\'avatar');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 Pour tester l\'upload d\'avatar :');
  console.log('1. Cliquez sur l\'icône caméra sur votre avatar');
  console.log('2. Sélectionnez une image de votre ordinateur');
  console.log('3. L\'image devrait s\'afficher immédiatement');
  console.log('\nℹ️  Le test automatique nécessite une vraie image.');
  console.log('   Utilisez l\'interface pour tester cette fonctionnalité.');
}

// Tester la suppression de l'avatar
async function testDeleteAvatar() {
  console.log('\n🗑️  TEST 4 : Suppression d\'avatar');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const token = localStorage.getItem('token');
  
  if (!confirm('Voulez-vous vraiment supprimer votre avatar ?')) {
    console.log('⏭️  Test annulé par l\'utilisateur');
    return;
  }
  
  try {
    const response = await fetch('/api/profile/upload-avatar', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Avatar supprimé avec succès');
      return true;
    } else {
      console.log('❌ Erreur:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de requête:', error);
    return false;
  }
}

// Fonction de test complet
async function runAllTests() {
  console.clear();
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          🚀 LANCEMENT DES TESTS AUTOMATIQUES            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
  
  // Test 0 : Vérifier l'authentification
  if (!checkAuth()) {
    console.log('\n⚠️  Tests arrêtés : Authentification requise');
    return;
  }
  
  // Test 1 : Get Profile
  await testGetProfile();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2 : Update Profile
  await testUpdateProfile();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 3 : Avatar Upload (manuel)
  testAvatarUpload();
  
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              ✅ TESTS TERMINÉS AVEC SUCCÈS              ║
║                                                          ║
║  Consultez les résultats ci-dessus.                     ║
║  Rafraîchissez la page pour voir les changements.       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
  
  // Demander si on veut rafraîchir
  if (confirm('Voulez-vous rafraîchir la page pour voir les changements ?')) {
    location.reload();
  }
}

// Fonctions de test manuel
async function manualTestChangePassword() {
  console.log('\n🔒 TEST MANUEL : Changement de mot de passe');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const currentPassword = prompt('Entrez votre mot de passe actuel :');
  if (!currentPassword) {
    console.log('⏭️  Test annulé');
    return;
  }
  
  const newPassword = prompt('Entrez votre nouveau mot de passe (min 6 caractères) :');
  if (!newPassword || newPassword.length < 6) {
    console.log('❌ Mot de passe invalide (min 6 caractères)');
    return;
  }
  
  const confirmPassword = prompt('Confirmez votre nouveau mot de passe :');
  if (newPassword !== confirmPassword) {
    console.log('❌ Les mots de passe ne correspondent pas');
    return;
  }
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/api/profile/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Mot de passe changé avec succès');
      console.log('💡 Vous devrez vous reconnecter avec le nouveau mot de passe');
    } else {
      console.log('❌ Erreur:', data.message);
    }
  } catch (error) {
    console.error('❌ Erreur de requête:', error);
  }
}

// Menu interactif
console.log(`
📋 COMMANDES DISPONIBLES :
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. runAllTests()           - Lancer tous les tests automatiques
2. checkAuth()             - Vérifier l'authentification
3. testGetProfile()        - Tester la récupération du profil
4. testUpdateProfile()     - Tester la mise à jour du profil
5. testAvatarUpload()      - Instructions pour tester l'upload
6. testDeleteAvatar()      - Tester la suppression d'avatar
7. manualTestChangePassword() - Tester le changement de mot de passe

💡 RECOMMANDATION : Commencez par runAllTests()
`);

// Auto-run si demandé
if (confirm('Voulez-vous lancer les tests automatiques maintenant ?')) {
  runAllTests();
}
