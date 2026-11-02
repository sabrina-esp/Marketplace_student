'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon, 
  UserCircleIcon, 
  BellIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Step {
  id: number;
  phase: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps: Step[] = [
    // Phase 1: Découverte
    {
      id: 1,
      phase: "🌟 Découverte",
      title: "Première Visite",
      description: "Marie découvre la plateforme Marketplace Student via une recherche Google",
      action: "Naviguer sur la page d'accueil",
      completed: false
    },
    {
      id: 2,
      phase: "🌟 Découverte",
      title: "Bannière PWA",
      description: "Après 5 secondes, une bannière violette apparaît proposant d'installer l'app",
      action: "Voir la bannière d'installation",
      completed: false
    },

    // Phase 2: Inscription
    {
      id: 3,
      phase: "🔐 Inscription",
      title: "Création de Compte",
      description: "Marie s'inscrit avec son nom, email et mot de passe",
      action: "Remplir le formulaire d'inscription",
      completed: false
    },
    {
      id: 4,
      phase: "🔐 Inscription",
      title: "Vérification Email",
      description: "Marie reçoit un email avec un code de vérification et valide son compte",
      action: "Vérifier l'email avec le code",
      completed: false
    },

    // Phase 3: Installation PWA
    {
      id: 5,
      phase: "📲 Installation",
      title: "Installation PWA",
      description: "Marie clique sur 'Install App' et l'icône apparaît sur son écran d'accueil",
      action: "Installer l'application",
      completed: false
    },
    {
      id: 6,
      phase: "📲 Installation",
      title: "Notifications",
      description: "Marie autorise les notifications push pour recevoir des updates",
      action: "Activer les notifications",
      completed: false
    },

    // Phase 4: Utilisation
    {
      id: 7,
      phase: "📚 Cours",
      title: "Explorer le Catalogue",
      description: "Marie parcourt les cours disponibles et choisit 'Instagram Marketing'",
      action: "Naviguer dans les cours",
      completed: false
    },
    {
      id: 8,
      phase: "📚 Cours",
      title: "Inscription au Cours",
      description: "Marie s'inscrit au cours et commence le premier module",
      action: "S'inscrire au cours",
      completed: false
    },

    // Phase 5: Social
    {
      id: 9,
      phase: "👥 Social",
      title: "Inviter un Ami",
      description: "Marie invite Sophie via email depuis son profil",
      action: "Envoyer une invitation",
      completed: false
    },
    {
      id: 10,
      phase: "👥 Social",
      title: "Ami Rejoint",
      description: "Sophie reçoit l'email et crée son compte via le lien de parrainage",
      action: "Ami inscrit via invitation",
      completed: false
    },

    // Phase 6: Personnalisation
    {
      id: 11,
      phase: "🎨 Personnalisation",
      title: "Profil Complet",
      description: "Marie ajoute une photo, une bio et ses informations personnelles",
      action: "Compléter le profil",
      completed: false
    },
    {
      id: 12,
      phase: "🎨 Personnalisation",
      title: "Mode Sombre",
      description: "Marie active le dark mode pour une meilleure lisibilité",
      action: "Activer le dark mode",
      completed: false
    },

    // Phase 7: Offline
    {
      id: 13,
      phase: "📴 Offline",
      title: "Utilisation Hors Ligne",
      description: "Dans le métro, Marie accède à son cours sans connexion internet",
      action: "Tester le mode offline",
      completed: false
    },
    {
      id: 14,
      phase: "📴 Offline",
      title: "Synchronisation",
      description: "De retour en ligne, les données se synchronisent automatiquement",
      action: "Synchroniser les données",
      completed: false
    },

    // Phase 8: Notifications
    {
      id: 15,
      phase: "🔔 Engagement",
      title: "Notifications Push",
      description: "Marie reçoit des notifications pour les nouveaux cours et messages",
      action: "Recevoir une notification",
      completed: false
    },
    {
      id: 16,
      phase: "🔔 Engagement",
      title: "Interaction",
      description: "Marie ouvre l'app directement depuis la notification",
      action: "Ouvrir via notification",
      completed: false
    },

    // Phase 9: Progression
    {
      id: 17,
      phase: "🎓 Progression",
      title: "Suivi d'Avancement",
      description: "Marie consulte son dashboard avec 80% de progression",
      action: "Voir la progression",
      completed: false
    },
    {
      id: 18,
      phase: "🎓 Progression",
      title: "Achievements",
      description: "Marie débloque des badges et achievements",
      action: "Débloquer un achievement",
      completed: false
    },

    // Phase 10: Support
    {
      id: 19,
      phase: "🆘 Support",
      title: "Demande d'Aide",
      description: "Marie contacte le support pour une question",
      action: "Envoyer un message support",
      completed: false
    },
    {
      id: 20,
      phase: "🆘 Support",
      title: "Réponse Rapide",
      description: "Le support répond en moins de 24h avec une solution",
      action: "Recevoir une réponse",
      completed: false
    },

    // Phase 11: Routine
    {
      id: 21,
      phase: "🔄 Routine",
      title: "Usage Quotidien",
      description: "Marie utilise l'app chaque jour pendant 1h en moyenne",
      action: "Session quotidienne",
      completed: false
    },

    // Phase 12: Accomplissement
    {
      id: 22,
      phase: "🏆 Accomplissement",
      title: "Cours Terminé",
      description: "Marie complète son cours avec succès après 30 jours",
      action: "Terminer le cours",
      completed: false
    },
    {
      id: 23,
      phase: "🏆 Accomplissement",
      title: "Certificat",
      description: "Marie télécharge son certificat et le partage sur LinkedIn",
      action: "Obtenir le certificat",
      completed: false
    },
    {
      id: 24,
      phase: "🏆 Accomplissement",
      title: "Review",
      description: "Marie laisse une review 5 étoiles et recommande la plateforme",
      action: "Laisser une review",
      completed: false
    }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep === steps.length - 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowConfetti(false);
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Grouper les étapes par phase
  const phases = Array.from(new Set(steps.map(s => s.phase)));
  const currentPhase = currentStepData.phase;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🎯 Parcours Utilisateur PWA
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Démonstration complète : Marketplace Student
          </p>
          <p className="text-lg text-purple-600 font-semibold">
            👤 Persona : Marie Dubois - Étudiante en Marketing Digital
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Étape {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {Math.round(progress)}% Complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {phases.map((phase, index) => {
              const phaseSteps = steps.filter(s => s.phase === phase);
              const isCurrentPhase = phase === currentPhase;
              const isPastPhase = steps.findIndex(s => s.phase === phase) < currentStep;
              
              return (
                <div 
                  key={phase}
                  className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg text-center text-sm font-semibold transition-all ${
                    isCurrentPhase 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105 shadow-lg' 
                      : isPastPhase
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {phase}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Current Step */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                {currentStep + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-purple-600 mb-1">
                  {currentStepData.phase}
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentStepData.title}
                </h2>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-700 mb-4">
                {currentStepData.description}
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <SparklesIcon className="w-5 h-5" />
                <span>Action : {currentStepData.action}</span>
              </div>
            </div>

            {/* Visual Representation based on phase */}
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-8 mb-6">
              {currentPhase.includes('Découverte') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Marie découvre une plateforme moderne et engageante
                  </p>
                </div>
              )}
              
              {currentPhase.includes('Inscription') && (
                <div className="text-center">
                  <UserCircleIcon className="w-24 h-24 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    Création de compte sécurisée et vérification email
                  </p>
                </div>
              )}

              {currentPhase.includes('Installation') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Installation PWA en 2 clics - Expérience app native
                  </p>
                </div>
              )}

              {currentPhase.includes('Cours') && (
                <div className="text-center">
                  <AcademicCapIcon className="w-24 h-24 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    Accès aux cours et apprentissage interactif
                  </p>
                </div>
              )}

              {currentPhase.includes('Social') && (
                <div className="text-center">
                  <UserGroupIcon className="w-24 h-24 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    Invitations d&apos;amis et croissance virale
                  </p>
                </div>
              )}

              {currentPhase.includes('Personnalisation') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Profil personnalisé et préférences sauvegardées
                  </p>
                </div>
              )}

              {currentPhase.includes('Offline') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">📴</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Accès hors ligne - Apprentissage partout, tout le temps
                  </p>
                </div>
              )}

              {currentPhase.includes('Engagement') && (
                <div className="text-center">
                  <BellIcon className="w-24 h-24 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    Notifications push intelligentes et engageantes
                  </p>
                </div>
              )}

              {currentPhase.includes('Progression') && (
                <div className="text-center">
                  <ChartBarIcon className="w-24 h-24 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    Suivi de progression et achievements
                  </p>
                </div>
              )}

              {currentPhase.includes('Support') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🆘</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Support réactif et aide personnalisée
                  </p>
                </div>
              )}

              {currentPhase.includes('Routine') && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🔄</div>
                  <p className="text-lg font-semibold text-gray-700">
                    Habitude quotidienne établie - Engagement maximal
                  </p>
                </div>
              )}

              {currentPhase.includes('Accomplissement') && (
                <div className="text-center">
                  <TrophyIcon className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg font-semibold text-gray-700">
                    Succès ! Cours terminé - Certificat obtenu
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
                }`}
              >
                ← Étape Précédente
              </button>
              
              <button
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  currentStep === steps.length - 1
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg active:scale-95'
                }`}
              >
                {currentStep === steps.length - 1 ? '✅ Parcours Terminé !' : 'Étape Suivante →'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - All Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📋 Toutes les Étapes du Parcours
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : index < currentStep
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === currentStep
                      ? 'bg-white text-purple-600'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs opacity-80 mb-1">{step.phase}</div>
                    <div className="font-semibold">{step.title}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {currentStep === steps.length - 1 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl active:scale-95 transition-all"
            >
              🔄 Recommencer le Parcours
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-purple-50 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-2">
            <strong>📊 Durée totale du parcours :</strong> 30 jours
          </p>
          <p className="text-gray-700 mb-2">
            <strong>🎯 Taux de complétion :</strong> 92%
          </p>
          <p className="text-gray-700">
            <strong>⭐ Satisfaction utilisateur :</strong> 5/5 étoiles
          </p>
        </div>
      </div>
    </div>
  );
}
