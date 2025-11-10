import { sendContactEmail } from '@/lib/services/emailService';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: 'Email invalide' },
        { status: 400 }
      );
    }

    // Envoyer l'email
    const result = await sendContactEmail(name, email, message);

    return Response.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès!',
        messageId: result.messageId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur:', error);
    return Response.json(
      { success: false, message: `Erreur: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    { 
      message: 'Utilisez POST pour envoyer un message',
      endpoint: '/api/auth/contact',
      method: 'POST',
      requiredFields: ['name', 'email', 'message']
    },
    { status: 200 }
  );
}