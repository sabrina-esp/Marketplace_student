/**
 * Test Script pour l'API d'Invitation par Email
 * 
 * Usage:
 * 1. Assurez-vous d'être connecté et d'avoir un token JWT
 * 2. Remplacez YOUR_JWT_TOKEN par votre vrai token
 * 3. node test-invite-email.js
 */

const testInviteEmail = async () => {
  const API_URL = 'http://localhost:3011/api/invite/send-email';
  
  // Récupérez votre token depuis localStorage après login
  // ou depuis la console du navigateur: localStorage.getItem('token')
  const TOKEN = 'YOUR_JWT_TOKEN_HERE';
  
  const testEmail = 'test@example.com'; // Changez par un vrai email pour tester
  
  console.log('🚀 Test de l\'API d\'invitation par email...\n');
  console.log(`📧 Envoi d'invitation à: ${testEmail}`);
  console.log(`🔗 URL API: ${API_URL}\n`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        email: testEmail
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ SUCCESS!');
      console.log('📬 Email envoyé avec succès!');
      console.log(`🎫 Code de parrainage: ${data.referralCode}`);
      console.log('\n📋 Réponse complète:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ ERREUR!');
      console.log(`Status: ${response.status}`);
      console.log('Message:', data.message);
      console.log('\n📋 Réponse complète:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ ERREUR DE CONNEXION!');
    console.error(error.message);
    console.log('\nVérifiez que:');
    console.log('1. Le serveur Next.js est démarré (npm run dev)');
    console.log('2. Vous avez un token JWT valide');
    console.log('3. Les configurations EMAIL dans .env.local sont correctes');
  }
};

// Fonction pour obtenir le token depuis le navigateur
console.log(`
╔════════════════════════════════════════════════════════════╗
║     Test de l'API d'Invitation par Email                  ║
╚════════════════════════════════════════════════════════════╝

Pour récupérer votre token JWT:
1. Ouvrez http://localhost:3011 dans votre navigateur
2. Connectez-vous à votre compte
3. Ouvrez la console (F12)
4. Tapez: localStorage.getItem('token')
5. Copiez le token et remplacez YOUR_JWT_TOKEN_HERE dans ce fichier
6. Relancez: node test-invite-email.js

Ou testez directement dans le navigateur:
1. Allez sur http://localhost:3011/profile
2. Cliquez sur "Invite a Friend"
3. Entrez un email et cliquez "Send Invite"
`);

// Exécuter le test
// testInviteEmail();

// Pour tester depuis le navigateur, copiez ce code dans la console:
console.log(`
Pour tester DIRECTEMENT dans le navigateur:
════════════════════════════════════════════

Copiez ce code dans la console du navigateur (F12):

fetch('/api/invite/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Résultat:', data);
  if(data.success) {
    alert('🎉 Email envoyé avec succès! Code: ' + data.referralCode);
  } else {
    alert('❌ Erreur: ' + data.message);
  }
})
.catch(err => console.error('❌ Erreur:', err));
`);

module.exports = { testInviteEmail };
