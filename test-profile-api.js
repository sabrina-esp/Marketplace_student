// Test API Profile - Exemple d'utilisation
// Ce fichier montre comment utiliser les APIs de profil

// 1. Se connecter et obtenir un token
async function login() {
  const response = await fetch('http://localhost:3011/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'test123',
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Connexion réussie');
    console.log('Token:', data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.token;
  } else {
    console.error('❌ Erreur de connexion:', data.message);
    return null;
  }
}

// 2. Récupérer les informations du profil
async function getProfile(token) {
  const response = await fetch('http://localhost:3011/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Profil récupéré');
    console.log('User:', data.user);
    return data.user;
  } else {
    console.error('❌ Erreur:', data.message);
    return null;
  }
}

// 3. Mettre à jour le profil
async function updateProfile(token, updates) {
  const response = await fetch('http://localhost:3011/api/profile/update', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Profil mis à jour');
    console.log('User:', data.user);
    return data.user;
  } else {
    console.error('❌ Erreur:', data.message);
    return null;
  }
}

// 4. Changer le mot de passe
async function changePassword(token, currentPassword, newPassword) {
  const response = await fetch('http://localhost:3011/api/profile/change-password', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Mot de passe changé');
    return true;
  } else {
    console.error('❌ Erreur:', data.message);
    return false;
  }
}

// 5. Upload un avatar (exemple avec une image)
async function uploadAvatar(token, imageFile) {
  // Convertir l'image en base64
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      const response = await fetch('http://localhost:3011/api/profile/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: base64String,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Avatar uploadé');
        resolve(data.avatar);
      } else {
        console.error('❌ Erreur:', data.message);
        resolve(null);
      }
    };
    reader.readAsDataURL(imageFile);
  });
}

// 6. Supprimer l'avatar
async function deleteAvatar(token) {
  const response = await fetch('http://localhost:3011/api/profile/upload-avatar', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Avatar supprimé');
    return true;
  } else {
    console.error('❌ Erreur:', data.message);
    return false;
  }
}

// 7. Test complet (à exécuter dans la console du navigateur)
async function fullTest() {
  console.log('🧪 Démarrage des tests...\n');
  
  // Test 1: Login
  console.log('Test 1: Connexion');
  const token = await login();
  if (!token) return;
  
  console.log('\n---\n');
  
  // Test 2: Get Profile
  console.log('Test 2: Récupération du profil');
  const profile = await getProfile(token);
  if (!profile) return;
  
  console.log('\n---\n');
  
  // Test 3: Update Profile
  console.log('Test 3: Mise à jour du profil');
  await updateProfile(token, {
    name: 'Test User Updated',
    phone: '+33 6 12 34 56 78',
    bio: 'Je suis un développeur passionné par Next.js et MongoDB',
  });
  
  console.log('\n---\n');
  
  // Test 4: Get Profile Again
  console.log('Test 4: Vérification des modifications');
  await getProfile(token);
  
  console.log('\n---\n');
  
  console.log('✅ Tous les tests sont terminés !');
}

// INSTRUCTIONS D'UTILISATION
console.log(`
╔════════════════════════════════════════════════════════╗
║         API Profile - Guide d'utilisation             ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  1. Ouvrez la console du navigateur (F12)             ║
║  2. Copiez ce fichier complet dans la console         ║
║  3. Exécutez: fullTest()                              ║
║                                                        ║
║  OU utilisez les fonctions individuellement:          ║
║                                                        ║
║  - login()                                             ║
║  - getProfile(token)                                   ║
║  - updateProfile(token, {...})                         ║
║  - changePassword(token, 'old', 'new')                ║
║  - deleteAvatar(token)                                 ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
`);

// Export pour usage dans Node.js (optionnel)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    login,
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
  };
}
