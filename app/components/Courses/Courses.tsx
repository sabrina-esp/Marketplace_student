"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { GlobeAltIcon, DevicePhoneMobileIcon, CircleStackIcon, CloudIcon, XMarkIcon, ClockIcon, AcademicCapIcon, UserGroupIcon, StarIcon, BookOpenIcon, TrophyIcon, SparklesIcon, FireIcon, RocketLaunchIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, PlayIcon } from '@heroicons/react/24/solid';

interface Name {
    course: string;
    imageSrc: string;
    profession: string;
    price: string;
    category: 'mobiledevelopment' | 'webdevelopment' | 'datascience' | 'cloudcomputing';
    description: string;
    duration: string;
    level: string;
    modules: string[];
    skills: string[];
    instructor: string;
    students: string;
    rating: string;
    lessons: string;
    projects: string;
    certificate: boolean;
    highlights: string[];
}

const names: Name[] = [
    {
        course: 'HTML, CSS, JS',
        imageSrc: '/assets/courses/coursesOne.svg',
        profession: 'HTML, CSS, Javascript Development',
        price: '40',
        category: 'webdevelopment',
        description: 'Maîtrisez les fondamentaux du développement web moderne. Créez des sites web interactifs et responsive avec les trois piliers du web.',
        duration: '8 semaines',
        level: 'Débutant',
        modules: ['Introduction au HTML5', 'CSS3 et Flexbox', 'JavaScript ES6+', 'Projets pratiques'],
        skills: ['Structure HTML', 'Styling CSS', 'DOM Manipulation', 'Responsive Design'],
        instructor: 'Sarah Martin',
        students: '2,450',
        rating: '4.8',
        lessons: '45',
        projects: '8',
        certificate: true,
        highlights: ['Accès à vie', 'Support 24/7', 'Mises à jour gratuites', 'Communauté active']
    },
    {
        course: 'Node.js',
        imageSrc: '/assets/courses/coursesTwo.svg',
        profession: 'Backend avec Node.js et Express.js',
        price: '21',
        category: 'webdevelopment',
        description: 'Développez des applications backend performantes avec Node.js et Express. Apprenez à créer des APIs REST et à gérer des bases de données.',
        duration: '10 semaines',
        level: 'Intermédiaire',
        modules: ['Node.js Basics', 'Express.js Framework', 'REST APIs', 'Authentication'],
        skills: ['Server-side JS', 'API Development', 'Database Integration', 'Security'],
        instructor: 'Marc Dubois',
        students: '1,890',
        rating: '4.7',
        lessons: '52',
        projects: '6',
        certificate: true,
        highlights: ['Projets réels', 'Code source inclus', 'Exercices pratiques', 'Quiz interactifs']
    },
    {
        course: 'Database',
        imageSrc: '/assets/courses/coursesThree.svg',
        profession: 'Learn Mongodb avec Mongoose',
        price: '21',
        category: 'webdevelopment',
        description: 'Explorez MongoDB, la base de données NoSQL leader. Apprenez à modéliser vos données avec Mongoose pour Node.js.',
        duration: '6 semaines',
        level: 'Intermédiaire',
        modules: ['MongoDB Fundamentals', 'Mongoose ODM', 'Data Modeling', 'Aggregation'],
        skills: ['NoSQL Concepts', 'Schema Design', 'Queries', 'Performance'],
        instructor: 'Ahmed Benali',
        students: '1,650',
        rating: '4.6',
        lessons: '38',
        projects: '5',
        certificate: true,
        highlights: ['Base de données réelle', 'Cas pratiques', 'Optimisation', 'Best practices']
    },
    {
        course: 'React.js',
        imageSrc: '/assets/courses/coursesFour.svg',
        profession: 'Learn React avec Redux toolkit',
        price: '99',
        category: 'webdevelopment',
        description: 'Créez des interfaces utilisateur modernes et performantes avec React et Redux. Maîtrisez les hooks et la gestion d\'état.',
        duration: '12 semaines',
        level: 'Avancé',
        modules: ['React Hooks', 'Redux Toolkit', 'React Router', 'Advanced Patterns'],
        skills: ['Component Design', 'State Management', 'Performance', 'Testing'],
        instructor: 'Sophie Laurent',
        students: '3,200',
        rating: '4.9',
        lessons: '68',
        projects: '10',
        certificate: true,
        highlights: ['Projets portfolio', 'Code reviews', 'Mentorat inclus', 'Job ready']
    },
    {
        course: 'React Native',
        imageSrc: '/assets/courses/coursesOne.svg',
        profession: 'Learn React Native avec Node.js',
        price: '89',
        category: 'mobiledevelopment',
        description: 'Développez des applications mobiles natives pour iOS et Android avec un seul code. Intégrez avec des backends Node.js.',
        duration: '14 semaines',
        level: 'Avancé',
        modules: ['React Native Basics', 'Navigation', 'Native Modules', 'Backend Integration'],
        skills: ['Mobile UI', 'Cross-platform', 'API Integration', 'Publishing'],
        instructor: 'Thomas Bernard',
        students: '2,100',
        rating: '4.7',
        lessons: '72',
        projects: '8',
        certificate: true,
        highlights: ['Apps complètes', 'Publication stores', 'Backend intégré', 'Animations avancées']
    },
    {
        course: 'Swift',
        imageSrc: '/assets/courses/coursesThree.svg',
        profession: 'Learn Swift depuis zéro',
        price: '89',
        category: 'mobiledevelopment',
        description: 'Maîtrisez Swift et développez des applications iOS natives. Découvrez SwiftUI et les dernières fonctionnalités d\'Apple.',
        duration: '12 semaines',
        level: 'Débutant',
        modules: ['Swift Language', 'SwiftUI', 'iOS Development', 'App Store Publishing'],
        skills: ['Swift Syntax', 'UI Design', 'iOS APIs', 'Testing'],
        instructor: 'Claire Moreau',
        students: '1,780',
        rating: '4.8',
        lessons: '60',
        projects: '7',
        certificate: true,
        highlights: ['SwiftUI moderne', 'App Store ready', 'Design patterns', 'Xcode mastery']
    },
    {
        course: 'Flutter',
        imageSrc: '/assets/courses/coursesFour.svg',
        profession: 'Flutter App Development',
        price: '69',
        category: 'mobiledevelopment',
        description: 'Créez des applications mobiles magnifiques avec Flutter et Dart. Une seule base de code pour iOS et Android.',
        duration: '10 semaines',
        level: 'Intermédiaire',
        modules: ['Dart Basics', 'Flutter Widgets', 'State Management', 'Firebase Integration'],
        skills: ['Flutter Framework', 'UI/UX', 'Animations', 'Deployment'],
        instructor: 'Lucas Petit',
        students: '2,340',
        rating: '4.7',
        lessons: '55',
        projects: '6',
        certificate: true,
        highlights: ['UI magnifique', 'Firebase backend', 'Animations fluides', 'Cross-platform']
    },
    {
        course: 'Onsen UI',
        imageSrc: '/assets/courses/coursesTwo.svg',
        profession: 'Learn Onsen UI avec HTML, CSS',
        price: '69',
        category: 'mobiledevelopment',
        description: 'Développez des applications mobiles hybrides avec Onsen UI. Framework léger et performant pour le développement mobile.',
        duration: '6 semaines',
        level: 'Débutant',
        modules: ['Onsen UI Basics', 'Components', 'Theming', 'Cordova Integration'],
        skills: ['Mobile UI', 'Hybrid Apps', 'Responsive', 'Performance'],
        instructor: 'Emma Richard',
        students: '980',
        rating: '4.5',
        lessons: '35',
        projects: '4',
        certificate: true,
        highlights: ['Rapide à apprendre', 'Léger', 'Performance', 'Multi-plateformes']
    },
    {
        course: 'TensorFlow',
        imageSrc: '/assets/courses/coursesTwo.svg',
        profession: 'Learn TensorFlow avec SQL',
        price: '99',
        category: 'datascience',
        description: 'Plongez dans le machine learning avec TensorFlow. Créez des modèles d\'IA puissants et intégrez-les dans vos applications.',
        duration: '16 semaines',
        level: 'Avancé',
        modules: ['ML Fundamentals', 'Neural Networks', 'Deep Learning', 'Model Deployment'],
        skills: ['Machine Learning', 'Deep Learning', 'Model Training', 'AI Integration'],
        instructor: 'Dr. Pierre Leroy',
        students: '2,890',
        rating: '4.9',
        lessons: '82',
        projects: '12',
        certificate: true,
        highlights: ['IA avancée', 'Réseaux neuronaux', 'GPU training', 'Production ready']
    },
    {
        course: 'AWS',
        imageSrc: '/assets/courses/coursesFour.svg',
        profession: 'AWS Deep Learning AMI',
        price: '99',
        category: 'datascience',
        description: 'Exploitez la puissance d\'AWS pour le deep learning. Déployez des modèles ML à grande échelle sur le cloud.',
        duration: '10 semaines',
        level: 'Avancé',
        modules: ['AWS Basics', 'EC2 & S3', 'SageMaker', 'ML Deployment'],
        skills: ['Cloud Computing', 'AWS Services', 'Model Deployment', 'Scalability'],
        instructor: 'Marie Durand',
        students: '1,560',
        rating: '4.6',
        lessons: '48',
        projects: '7',
        certificate: true,
        highlights: ['Cloud AWS', 'SageMaker', 'Scalable ML', 'Production deployment']
    },
    {
        course: 'Bokeh',
        imageSrc: '/assets/courses/coursesOne.svg',
        profession: 'Learn Bokeh avec Python',
        price: '99',
        category: 'datascience',
        description: 'Créez des visualisations de données interactives et élégantes avec Bokeh. Transformez vos données en insights visuels.',
        duration: '8 semaines',
        level: 'Intermédiaire',
        modules: ['Python Basics', 'Bokeh Fundamentals', 'Interactive Plots', 'Dashboards'],
        skills: ['Data Visualization', 'Python', 'Interactive Charts', 'Analytics'],
        instructor: 'Jean Michel',
        students: '1,230',
        rating: '4.5',
        lessons: '42',
        projects: '5',
        certificate: true,
        highlights: ['Visualisations pro', 'Dashboards interactifs', 'Python mastery', 'Data insights']
    },
    {
        course: 'Scikit',
        imageSrc: '/assets/courses/coursesThree.svg',
        profession: 'Scikit avec Python Development',
        price: '89',
        category: 'datascience',
        description: 'Maîtrisez Scikit-learn pour le machine learning. Algorithmes de classification, régression et clustering à votre portée.',
        duration: '12 semaines',
        level: 'Intermédiaire',
        modules: ['Python for ML', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
        skills: ['Machine Learning', 'Data Preprocessing', 'Model Selection', 'Evaluation'],
        instructor: 'Nadia Farah',
        students: '2,670',
        rating: '4.8',
        lessons: '58',
        projects: '9',
        certificate: true,
        highlights: ['ML pratique', 'Algorithmes variés', 'Data preprocessing', 'Model tuning']
    },
    {
        course: 'IaaS',
        imageSrc: '/assets/courses/coursesThree.svg',
        profession: 'Infrastructure-as-a-Service',
        price: '21',
        category: 'cloudcomputing',
        description: 'Comprenez l\'infrastructure cloud. Gérez des serveurs virtuels, du stockage et des réseaux dans le cloud.',
        duration: '6 semaines',
        level: 'Débutant',
        modules: ['Cloud Fundamentals', 'Virtual Machines', 'Storage', 'Networking'],
        skills: ['Cloud Infrastructure', 'VM Management', 'Storage Solutions', 'Security'],
        instructor: 'David Cohen',
        students: '1,450',
        rating: '4.4',
        lessons: '36',
        projects: '4',
        certificate: true,
        highlights: ['Infrastructure cloud', 'VMs & Storage', 'Networking', 'Security basics']
    },
    {
        course: 'PaaS',
        imageSrc: '/assets/courses/coursesFour.svg',
        profession: 'Platform-as-a-Service',
        price: '29',
        category: 'cloudcomputing',
        description: 'Développez et déployez des applications sans gérer l\'infrastructure. Concentrez-vous sur votre code.',
        duration: '8 semaines',
        level: 'Intermédiaire',
        modules: ['PaaS Concepts', 'App Deployment', 'CI/CD', 'Monitoring'],
        skills: ['Platform Management', 'Deployment', 'Automation', 'DevOps'],
        instructor: 'Julie Simon',
        students: '1,820',
        rating: '4.6',
        lessons: '44',
        projects: '6',
        certificate: true,
        highlights: ['Déploiement facile', 'CI/CD pipeline', 'DevOps practices', 'Monitoring']
    },
    {
        course: 'SaaS',
        imageSrc: '/assets/courses/coursesOne.svg',
        profession: 'Software-as-a-Service',
        price: '99',
        category: 'cloudcomputing',
        description: 'Découvrez l\'économie SaaS. Créez et monétisez des applications cloud accessibles partout.',
        duration: '10 semaines',
        level: 'Avancé',
        modules: ['SaaS Architecture', 'Multi-tenancy', 'Subscription Models', 'Scaling'],
        skills: ['SaaS Design', 'Business Model', 'Scalability', 'Security'],
        instructor: 'Alexandre Roy',
        students: '2,010',
        rating: '4.7',
        lessons: '52',
        projects: '8',
        certificate: true,
        highlights: ['Architecture SaaS', 'Multi-tenant', 'Business model', 'Scalabilité']
    },
    {
        course: 'Cloud Security',
        imageSrc: '/assets/courses/coursesTwo.svg',
        profession: 'Sécurité Cloud Computing',
        price: '58',
        category: 'cloudcomputing',
        description: 'Sécurisez vos applications cloud. Apprenez les meilleures pratiques de sécurité pour le cloud computing.',
        duration: '8 semaines',
        level: 'Avancé',
        modules: ['Security Fundamentals', 'Encryption', 'IAM', 'Compliance'],
        skills: ['Cloud Security', 'Risk Management', 'Compliance', 'Best Practices'],
        instructor: 'Fatima Zahra',
        students: '1,340',
        rating: '4.8',
        lessons: '46',
        projects: '5',
        certificate: true,
        highlights: ['Sécurité avancée', 'Encryption', 'Compliance', 'Risk management']
    }
];

const NamesList = () => {
    const [selectedButton, setSelectedButton] = useState<'mobiledevelopment' | 'webdevelopment' | 'datascience' | 'cloudcomputing'>('webdevelopment');
    const [selectedCourse, setSelectedCourse] = useState<Name | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) closeModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isModalOpen]);

    const mobileDevelopment = names.filter((name) => name.category === 'mobiledevelopment');
    const webDevelopment = names.filter((name) => name.category === 'webdevelopment');
    const dataScience = names.filter((name) => name.category === 'datascience');
    const cloudComputing = names.filter((name) => name.category === 'cloudcomputing');

    let selectedNames: Name[] = [];

    if (selectedButton === 'mobiledevelopment') {
        selectedNames = mobileDevelopment;
    } else if (selectedButton === 'webdevelopment') {
        selectedNames = webDevelopment;
    } else if (selectedButton === 'datascience') {
        selectedNames = dataScience;
    } else if (selectedButton === 'cloudcomputing') {
        selectedNames = cloudComputing;
    }

    const openModal = (course: Name) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedCourse(null), 300);
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'webdevelopment':
                return 'from-violet-700 via-purple-700 to-fuchsia-700';
            case 'mobiledevelopment':
                return 'from-violet-600 via-purple-700 to-fuchsia-600';
            case 'datascience':
                return 'from-emerald-600 via-green-500 to-teal-500';
            case 'cloudcomputing':
                return 'from-orange-600 via-orange-500 to-amber-500';
            default:
                return 'from-gray-600 to-gray-400';
        }
    };

    const getCategoryBgColor = (category: string) => {
        switch (category) {
            case 'webdevelopment':
                return 'bg-violet-700';
            case 'mobiledevelopment':
                return 'bg-violet-600';
            case 'datascience':
                return 'bg-emerald-600';
            case 'cloudcomputing':
                return 'bg-orange-600';
            default:
                return 'bg-gray-600';
        }
    };

    const nameElements = selectedNames.map((name, index) => (
        <div 
            key={index}
            onClick={() => openModal(name)}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                    src={name.imageSrc}
                    alt={name.course}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div 
                    className="absolute top-3 right-3 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg animate-pulse-slow"
                    style={{
                        background: name.category === 'mobiledevelopment'
                            ? 'linear-gradient(to right, #7c3aed, #a855f7, #c026d3)'
                            : name.category === 'webdevelopment'
                            ? 'linear-gradient(to right, #7c3aed, #a855f7, #c026d3)'
                            : name.category === 'datascience'
                            ? 'linear-gradient(to right, #059669, #10b981, #14b8a6)'
                            : 'linear-gradient(to right, #ea580c, #f97316, #f59e0b)'
                    }}
                >
                    ${name.price}
                </div>
            </div>
            
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {name.course}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {name.profession}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                        <BookOpenIcon className="w-4 h-4" />
                        {name.lessons} leçons
                    </span>
                    <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {name.students}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                        <StarIcon className="w-4 h-4 fill-yellow-400" />
                        {name.rating}
                    </span>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="bg-white min-h-screen">
            <div id='courses-section' className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
                <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                            Cours Populaires
                        </h2>
                        <p className="text-gray-600">Choisissez parmi nos formations les plus appréciées</p>
                    </div>
                    <button className="mt-4 sm:mt-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:shadow-lg transition-all hover:scale-105">
                        Voir tout
                    </button>
                </div>

                <div className='flex gap-3 bg-gray-50 rounded-xl p-2 mb-8 overflow-x-auto'>
                    <button 
                        onClick={() => setSelectedButton('webdevelopment')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                            selectedButton === 'webdevelopment' 
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <GlobeAltIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Web Dev</span>
                    </button>
                    <button 
                        onClick={() => setSelectedButton('mobiledevelopment')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                            selectedButton === 'mobiledevelopment' 
                                ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg scale-105' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <DevicePhoneMobileIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Mobile Dev</span>
                    </button>
                    <button 
                        onClick={() => setSelectedButton('datascience')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                            selectedButton === 'datascience' 
                                ? 'bg-white text-emerald-600 shadow-md' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <CircleStackIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Data Science</span>
                    </button>
                    <button 
                        onClick={() => setSelectedButton('cloudcomputing')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                            selectedButton === 'cloudcomputing' 
                                ? 'bg-white text-orange-600 shadow-md' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <CloudIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Cloud</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nameElements}
                </div>
            </div>

            {isModalOpen && selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeModal}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-xl"></div>
                    
                    <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
                        
                        <div 
                            className="relative text-white overflow-hidden min-h-[320px]"
                            style={{
                                background: selectedCourse.category === 'mobiledevelopment' 
                                    ? 'linear-gradient(to bottom right, #7c3aed, #a855f7, #c026d3)'
                                    : selectedCourse.category === 'webdevelopment'
                                    ? 'linear-gradient(to bottom right, #7c3aed, #a855f7, #c026d3)'
                                    : selectedCourse.category === 'datascience'
                                    ? 'linear-gradient(to bottom right, #059669, #10b981, #14b8a6)'
                                    : 'linear-gradient(to bottom right, #ea580c, #f97316, #f59e0b)'
                            }}
                        >
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl -mr-64 -mt-64 animate-float"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -ml-48 -mb-48 animate-float-delayed"></div>
                                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
                                
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-particle-1"></div>
                                    <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white/40 rounded-full animate-particle-2"></div>
                                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/50 rounded-full animate-particle-3"></div>
                                </div>
                            </div>
                            
                            <div className="relative p-8 sm:p-12">
                                <button 
                                    onClick={closeModal}
                                    className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all hover:rotate-180 duration-500 hover:scale-110 shadow-lg group z-10"
                                >
                                    <XMarkIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 shadow-lg border border-white/30 hover:scale-105 transition-transform animate-bounce-slow">
                                        <FireIcon className="w-5 h-5 animate-wiggle" />
                                        <span className="font-bold text-sm tracking-wide">COURS POPULAIRE</span>
                                    </div>
                                    
                                    <h2 className="text-5xl sm:text-6xl font-black mb-4 drop-shadow-2xl tracking-tight leading-tight animate-slide-in-right">
                                        {selectedCourse.course}
                                    </h2>
                                    <p className="text-2xl opacity-95 font-semibold mb-6 tracking-wide animate-slide-in-left">
                                        {selectedCourse.profession}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/30 hover:scale-105 transition-all animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                                        <UserGroupIcon className="w-5 h-5" />
                                        <span className="font-bold">{selectedCourse.students} étudiants</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/30 hover:scale-105 transition-all animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                                        <StarIcon className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-spin-slow" />
                                        <span className="font-bold">{selectedCourse.rating}/5.0</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/30 hover:scale-105 transition-all animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                                        <BookOpenIcon className="w-5 h-5" />
                                        <span className="font-bold">{selectedCourse.lessons} leçons</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/30 hover:scale-105 transition-all animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                                        <RocketLaunchIcon className="w-5 h-5" />
                                        <span className="font-bold">{selectedCourse.projects} projets</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(92vh-280px)] px-8 sm:px-12 py-10">
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                                <div className="group relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-6 text-center border-2 border-blue-300 hover:border-blue-500 transition-all hover:scale-105 hover:shadow-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/0 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <ClockIcon className="w-10 h-10 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform group-hover:rotate-12" />
                                        <p className="text-xs text-blue-700 mb-2 font-bold uppercase tracking-wider">Durée</p>
                                        <p className="font-black text-gray-900 text-lg">{selectedCourse.duration}</p>
                                    </div>
                                </div>
                                <div className="group relative bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-2xl p-6 text-center border-2 border-purple-300 hover:border-purple-500 transition-all hover:scale-105 hover:shadow-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/0 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <AcademicCapIcon className="w-10 h-10 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform group-hover:-rotate-12" />
                                        <p className="text-xs text-purple-700 mb-2 font-bold uppercase tracking-wider">Niveau</p>
                                        <p className="font-black text-gray-900 text-lg">{selectedCourse.level}</p>
                                    </div>
                                </div>
                                <div className="group relative bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 rounded-2xl p-6 text-center border-2 border-emerald-300 hover:border-emerald-500 transition-all hover:scale-105 hover:shadow-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <TrophyIcon className="w-10 h-10 text-emerald-600 mx-auto mb-3 group-hover:scale-110 transition-transform group-hover:rotate-12 animate-bounce-slow" />
                                        <p className="text-xs text-emerald-700 mb-2 font-bold uppercase tracking-wider">Certificat</p>
                                        <p className="font-black text-gray-900 text-lg">Inclus ✓</p>
                                    </div>
                                </div>
                                <div className="group relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 rounded-2xl p-6 text-center border-2 border-amber-300 hover:border-amber-500 transition-all hover:scale-105 hover:shadow-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/0 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <ChartBarIcon className="w-10 h-10 text-amber-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                        <p className="text-xs text-amber-700 mb-2 font-bold uppercase tracking-wider">Prix</p>
                                        <p className="font-black text-gray-900 text-2xl">${selectedCourse.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl shadow-xl animate-pulse-slow`}>
                                        <SparklesIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">À propos du cours</h3>
                                </div>
                                <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-lg group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-fuchsia-100/50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity animate-float"></div>
                                    <p className="text-gray-700 leading-relaxed text-lg relative z-10 font-medium">
                                        {selectedCourse.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl shadow-xl animate-pulse-slow`}>
                                        <LightBulbIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Avantages inclus</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedCourse.highlights.map((highlight, idx) => (
                                        <div key={idx} className="group relative flex items-center gap-4 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-lg hover:scale-[1.02] overflow-hidden animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <CheckCircleIcon className="w-8 h-8 text-emerald-600 flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform group-hover:rotate-12" />
                                            <span className="text-gray-800 font-bold relative z-10 text-base">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl shadow-xl animate-pulse-slow`}>
                                        <BookOpenIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Programme du cours</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {selectedCourse.modules.map((module, idx) => (
                                        <div key={idx} className="group relative bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl p-6 transition-all hover:shadow-2xl hover:scale-[1.02] overflow-hidden animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                            <div className="flex items-start gap-5 relative z-10">
                                                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-110 transition-transform group-hover:rotate-12`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors text-lg">{module}</h4>
                                                    <p className="text-sm text-gray-500 font-semibold">Module {idx + 1} • Interactif</p>
                                                </div>
                                                <PlayIcon className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 group-hover:scale-125" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl shadow-xl animate-pulse-slow`}>
                                        <TrophyIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Compétences maîtrisées</h3>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {selectedCourse.skills.map((skill, idx) => (
                                        <div 
                                            key={idx}
                                            className={`group relative bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all cursor-default text-lg overflow-hidden animate-fade-in-up`}
                                            style={{animationDelay: `${idx * 0.1}s`}}
                                        >
                                            <div className="absolute inset-0 bg-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
                                            <span className="relative z-10">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl shadow-xl animate-pulse-slow`}>
                                        <AcademicCapIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Votre instructeur</h3>
                                </div>
                                <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 shadow-xl hover:shadow-2xl transition-all group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-fuchsia-100/30 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity animate-float"></div>
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-24 h-24 bg-gradient-to-br ${getCategoryGradient(selectedCourse.category)} rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl group-hover:scale-110 transition-transform`}>
                                            {selectedCourse.instructor.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-3xl font-black text-gray-900 mb-2">{selectedCourse.instructor}</p>
                                            <p className="text-gray-600 text-lg font-bold mb-3">Expert certifié en {selectedCourse.course}</p>
                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                                                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                                                    <span className="font-bold text-blue-900">{selectedCourse.students} étudiants</span>
                                                </span>
                                                <span className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                                                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-yellow-900">{selectedCourse.rating} évaluation</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div 
                                className="relative rounded-3xl p-10 text-white text-center shadow-2xl overflow-hidden"
                                style={{
                                    background: selectedCourse.category === 'mobiledevelopment' 
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                                        : selectedCourse.category === 'webdevelopment'
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                                        : selectedCourse.category === 'datascience'
                                        ? 'linear-gradient(135deg, #0BA360 0%, #3CBA92 50%, #30DD8A 100%)'
                                        : 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 50%, #FE6B8B 100%)'
                                }}
                            >
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-48 -mt-48 animate-float"></div>
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -ml-48 -mb-48 animate-float-delayed"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 border border-white/30 animate-bounce-slow">
                                        <SparklesIcon className="w-5 h-5 animate-spin-slow" />
                                        <span className="font-bold text-sm">OFFRE LIMITÉE</span>
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 drop-shadow-lg">Prêt à transformer votre carrière ?</h3>
                                    <p className="text-xl opacity-95 mb-8 font-semibold">Rejoignez {selectedCourse.students} étudiants qui ont déjà fait le grand saut</p>
                                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                        <button className="group relative bg-white text-gray-900 font-black py-5 px-12 rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all text-xl overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="relative z-10">S'inscrire maintenant - ${selectedCourse.price}</span>
                                        </button>
                                        <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/50 text-white font-black py-5 px-10 rounded-2xl transition-all hover:scale-105 shadow-lg">
                                            Ajouter aux favoris ❤️
                                        </button>
                                    </div>
                                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm opacity-90">
                                        <span className="flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span className="font-bold">Garantie 30 jours</span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span className="font-bold">Accès à vie</span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span className="font-bold">Certificat officiel</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-30px, 30px) scale(0.9); }
                    66% { transform: translate(20px, -20px) scale(1.1); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }

                @keyframes slide-in-right {
                    from { transform: translateX(-30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes slide-in-left {
                    from { transform: translateX(30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes fade-in-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes particle-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0; }
                    50% { transform: translate(100px, -100px); opacity: 1; }
                }

                @keyframes particle-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0; }
                    50% { transform: translate(-80px, 80px); opacity: 1; }
                }

                @keyframes particle-3 {
                    0%, 100% { transform: translate(0, 0); opacity: 0; }
                    50% { transform: translate(120px, 60px); opacity: 1; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float-delayed 10s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .animate-wiggle {
                    animation: wiggle 1s ease-in-out infinite;
                }

                .animate-slide-in-right {
                    animation: slide-in-right 0.6s ease-out;
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                    animation-fill-mode: both;
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .animate-particle-1 {
                    animation: particle-1 6s ease-in-out infinite;
                }

                .animate-particle-2 {
                    animation: particle-2 8s ease-in-out infinite;
                }

                .animate-particle-3 {
                    animation: particle-3 7s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default NamesList;