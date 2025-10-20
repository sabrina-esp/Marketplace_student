// 'use client';

// import Link from 'next/link';
// import { BarChart3, TrendingUp, Users, Award, Sparkles, ArrowRight, Star } from 'lucide-react';

// const DashboardCard = () => {
//   return (
//     <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
//       {/* Éléments décoratifs de fond */}
//       <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//       <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//       <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         {/* Badge supérieur */}
//         <div className="flex justify-center mb-8">
//           <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100">
//             <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
//             <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Nouveau Dashboard Analytique
//             </span>
//             <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//           </div>
//         </div>

//         {/* Carte principale */}
//         <div className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/50 overflow-hidden group hover:shadow-purple-200/50 transition-all duration-500">
//           {/* Effet de brillance au survol */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
//           {/* Cercles décoratifs */}
//           <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
//           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

//           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Partie gauche - Contenu */}
//             <div className="space-y-6">
//               {/* Titre principal */}
//               <div>
//                 <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
//                   Suivez vos
//                   <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
//                     performances
//                   </span>
//                   <span className="block text-4xl md:text-5xl mt-2">en temps réel ✨</span>
//                 </h2>
//                 <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
//                   Accédez à votre tableau de bord personnalisé pour visualiser vos statistiques, 
//                   suivre votre progression et gérer vos cours.
//                 </p>
//               </div>

//               {/* Statistiques en grille */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Stat 1 */}
//                 <div className="group/card relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover/card:opacity-10 blur-xl transition-opacity duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200/50 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
//                         <TrendingUp className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
//                     </div>
//                     <div className="text-3xl font-black text-gray-900 mb-1">8.2k+</div>
//                     <div className="text-sm font-bold text-purple-600">Étudiants actifs</div>
//                     <div className="text-xs text-gray-500 mt-1">+12% ce mois</div>
//                   </div>
//                 </div>

//                 {/* Stat 2 */}
//                 <div className="group/card relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover/card:opacity-10 blur-xl transition-opacity duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
//                         <Users className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
//                     </div>
//                     <div className="text-3xl font-black text-gray-900 mb-1">47</div>
//                     <div className="text-sm font-bold text-blue-600">Cours disponibles</div>
//                     <div className="text-xs text-gray-500 mt-1">+8 nouveaux</div>
//                   </div>
//                 </div>

//                 {/* Stat 3 */}
//                 <div className="group/card relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl opacity-0 group-hover/card:opacity-10 blur-xl transition-opacity duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200/50 hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
//                         <Award className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
//                     </div>
//                     <div className="text-3xl font-black text-gray-900 mb-1">4.9</div>
//                     <div className="text-sm font-bold text-pink-600">Note moyenne</div>
//                     <div className="text-xs text-gray-500 mt-1">⭐⭐⭐⭐⭐</div>
//                   </div>
//                 </div>

//                 {/* Stat 4 */}
//                 <div className="group/card relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl opacity-0 group-hover/card:opacity-10 blur-xl transition-opacity duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200/50 hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
//                         <BarChart3 className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
//                     </div>
//                     <div className="text-3xl font-black text-gray-900 mb-1">92%</div>
//                     <div className="text-sm font-bold text-yellow-600">Taux de réussite</div>
//                     <div className="text-xs text-gray-500 mt-1">Excellent! 🎉</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Bouton CTA */}
//               <Link href="/dashboard">
//                 <button className="group/btn relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
//                   {/* Effet de brillance */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  
//                   <span className="relative flex items-center justify-center gap-3">
//                     <BarChart3 className="w-6 h-6" />
//                     Accéder au Dashboard
//                     <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
//                   </span>
//                 </button>
//               </Link>

//               {/* Badge de confiance */}
//               <div className="flex items-center gap-4 pt-4">
//                 <div className="flex -space-x-2">
//                   <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white font-bold">A</div>
//                   <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-white font-bold">B</div>
//                   <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">C</div>
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center text-white font-bold text-sm">+5k</div>
//                 </div>
//                 <div className="text-sm">
//                   <div className="font-bold text-gray-900">Rejoignez 8000+ étudiants</div>
//                   <div className="text-gray-500">qui utilisent déjà le dashboard</div>
//                 </div>
//               </div>
//             </div>

//             {/* Partie droite - Mockup Dashboard */}
//             <div className="relative">
//               {/* Ombre portée */}
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl transform rotate-6 scale-105 opacity-20 blur-2xl"></div>
              
//               {/* Card principale */}
//               <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 transform hover:scale-105 transition-transform duration-500">
//                 {/* Header du mockup */}
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                   </div>
//                   <div className="text-xs font-bold text-gray-400">Dashboard Preview</div>
//                 </div>

//                 {/* Contenu du mockup */}
//                 <div className="space-y-4">
//                   {/* Barre de titre */}
//                   <div className="flex items-center gap-3">
//                     <div className="h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-2/3 animate-pulse"></div>
//                     <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-1/3 animate-pulse"></div>
//                   </div>

//                   {/* Grand graphique */}
//                   <div className="relative h-40 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl overflow-hidden">
//                     {/* Simulation de graphique en barres */}
//                     <div className="absolute bottom-0 left-4 w-8 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg" style={{height: '60%'}}></div>
//                     <div className="absolute bottom-0 left-16 w-8 bg-gradient-to-t from-pink-500 to-pink-300 rounded-t-lg" style={{height: '80%'}}></div>
//                     <div className="absolute bottom-0 left-28 w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg" style={{height: '50%'}}></div>
//                     <div className="absolute bottom-0 left-40 w-8 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg" style={{height: '90%'}}></div>
//                     <div className="absolute bottom-0 left-52 w-8 bg-gradient-to-t from-pink-500 to-pink-300 rounded-t-lg" style={{height: '70%'}}></div>
//                     <div className="absolute bottom-0 right-4 w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg" style={{height: '85%'}}></div>
//                   </div>

//                   {/* Petites cartes stats */}
//                   <div className="grid grid-cols-3 gap-3">
//                     <div className="h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-3 flex flex-col justify-between">
//                       <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
//                       <div className="space-y-1">
//                         <div className="h-2 bg-purple-300 rounded w-3/4"></div>
//                         <div className="h-2 bg-purple-200 rounded w-1/2"></div>
//                       </div>
//                     </div>
//                     <div className="h-24 bg-gradient-to-br from-pink-100 to-blue-100 rounded-xl p-3 flex flex-col justify-between">
//                       <div className="w-8 h-8 bg-pink-500 rounded-lg"></div>
//                       <div className="space-y-1">
//                         <div className="h-2 bg-pink-300 rounded w-3/4"></div>
//                         <div className="h-2 bg-pink-200 rounded w-1/2"></div>
//                       </div>
//                     </div>
//                     <div className="h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-3 flex flex-col justify-between">
//                       <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
//                       <div className="space-y-1">
//                         <div className="h-2 bg-blue-300 rounded w-3/4"></div>
//                         <div className="h-2 bg-blue-200 rounded w-1/2"></div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Lignes de texte */}
//                   <div className="space-y-2">
//                     <div className="h-3 bg-gradient-to-r from-purple-200 to-transparent rounded w-full"></div>
//                     <div className="h-3 bg-gradient-to-r from-pink-200 to-transparent rounded w-5/6"></div>
//                     <div className="h-3 bg-gradient-to-r from-blue-200 to-transparent rounded w-4/6"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Badge "New" flottant */}
//               <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg font-black text-sm rotate-12 animate-bounce">
//                 NEW ✨
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer avec features */}
//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all">
//             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-900 mb-1">Analyses en temps réel</h3>
//               <p className="text-sm text-gray-600">Suivez vos performances instantanément</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all">
//             <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
//               <Award className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-900 mb-1">Suivi de progression</h3>
//               <p className="text-sm text-gray-600">Visualisez votre évolution</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
//               <BarChart3 className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-900 mb-1">Rapports détaillés</h3>
//               <p className="text-sm text-gray-600">Exportez vos statistiques</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
        
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }

//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default DashboardCard;