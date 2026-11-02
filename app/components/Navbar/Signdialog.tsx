import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { LockClosedIcon, EnvelopeIcon, AcademicCapIcon, SparklesIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ForgotPasswordDialog from './ForgotPasswordDialog'

const SigninDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [focusedField, setFocusedField] = useState('')

    const closeModal = () => {
        setIsOpen(false)
        setMessage({ type: '', text: '' })
    }

    const openModal = () => {
        console.log('Opening SignIn Modal')
        setIsOpen(true)
        setFormData({ email: '', password: '', rememberMe: false })
        setMessage({ type: '', text: '' })
    }

    const openForgotPassword = () => {
        setIsOpen(false)
        setIsForgotPasswordOpen(true)
    }

    const closeForgotPassword = () => {
        setIsForgotPasswordOpen(false)
        setIsOpen(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            console.log('Submitting login:', formData)
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            })
            const data = await response.json()

            if (data.success) {
                // ✅ SAUVEGARDER LE TOKEN ET L'UTILISATEUR
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                setMessage({ 
                    type: 'success', 
                    text: '🎉 Welcome back! Login successful.' 
                })
                setFormData({ email: '', password: '', rememberMe: false })
                
                // Recharger la page pour mettre à jour la navbar
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.message || 'Login error occurred' 
                })
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage({ 
                type: 'error', 
                text: '❌ Server connection error' 
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center">
                <div className="block">
                    <button
                        type="button"
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-purple transition-colors hover:bg-purple/5"
                        onClick={openModal}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden pointer-events-none perspective-1000">
                        <div className="absolute top-20 left-10 animate-float opacity-30" style={{ animationDelay: '0s' }}>
                            <BookOpenIcon className="w-24 h-24 text-purple-600" style={{ transform: 'rotateY(20deg) rotateX(10deg)' }} />
                        </div>
                        <div className="absolute top-40 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
                            <AcademicCapIcon className="w-32 h-32 text-indigo-600" style={{ transform: 'rotateY(-20deg) rotateX(-10deg)' }} />
                        </div>
                        <div className="absolute bottom-32 left-32 animate-float opacity-30" style={{ animationDelay: '2s' }}>
                            <SparklesIcon className="w-20 h-20 text-purple-500" style={{ transform: 'rotateY(15deg)' }} />
                        </div>
                        <div className="absolute bottom-20 right-40 animate-float opacity-30" style={{ animationDelay: '0.5s' }}>
                            <BookOpenIcon className="w-28 h-28 text-blue-500" style={{ transform: 'rotateY(-25deg) rotateX(15deg)' }} />
                        </div>
                        <div className="absolute top-1/2 left-1/4 animate-float opacity-20" style={{ animationDelay: '1.5s' }}>
                            <SparklesIcon className="w-16 h-16 text-purple-400" style={{ transform: 'rotateY(-10deg)' }} />
                        </div>
                    </div>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-500"
                                enterFrom="opacity-0 scale-90 rotateX(20deg)"
                                enterTo="opacity-100 scale-100 rotateX(0deg)"
                                leave="ease-in duration-300"
                                leaveFrom="opacity-100 scale-100 rotateX(0deg)"
                                leaveTo="opacity-0 scale-90 rotateX(20deg)"
                            >
                                <Dialog.Panel 
                                    className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all relative"
                                    style={{
                                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(124, 58, 237, 0.5)',
                                        transformStyle: 'preserve-3d',
                                        transform: 'perspective(1000px)'
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                        <div className="absolute top-0 left-0 w-full h-1 animate-border-horizontal">
                                            <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-1 animate-border-horizontal-reverse">
                                            <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                                        </div>
                                        <div className="absolute top-0 left-0 w-1 h-full animate-border-vertical">
                                            <div className="w-full h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-1 h-full animate-border-vertical-reverse">
                                            <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="relative overflow-hidden" style={{
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                                        padding: '3rem 2rem',
                                        textAlign: 'center'
                                    }}>
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                            <div className="absolute -top-10 -left-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                                            <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                                            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                                        </div>

                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                            <div className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full animate-particle-1"></div>
                                            <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-particle-2"></div>
                                            <div className="absolute bottom-6 left-16 w-2.5 h-2.5 bg-white/30 rounded-full animate-particle-3"></div>
                                            <div className="absolute bottom-10 right-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-4"></div>
                                            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/35 rounded-full animate-particle-5"></div>
                                            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/45 rounded-full animate-particle-6"></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300" style={{
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                                animation: 'pulseGlow 2s ease-in-out infinite'
                                            }}>
                                                <LockClosedIcon className="w-12 h-12 text-purple-600" />
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                                                Welcome Back!
                                            </h2>
                                            <p className="text-purple-100 text-base">
                                                Sign in to continue your learning journey
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-8" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
                                        {message.text && (
                                            <div className={`mb-6 p-5 rounded-2xl transform transition-all duration-300 ${
                                                message.type === 'success' 
                                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-lg' 
                                                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 shadow-lg'
                                            }`} style={{
                                                animation: 'fadeInUp 0.5s ease-out'
                                            }}>
                                                <div className="flex items-center gap-3">
                                                    {message.type === 'success' && <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />}
                                                    <p className="text-sm font-semibold">{message.text}</p>
                                                </div>
                                            </div>
                                        )}

                                        <form className="space-y-6" onSubmit={handleSubmit}>
                                            <div className="group">
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    Email Address
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                                        focusedField === 'email' ? 'scale-110' : ''
                                                    }`}>
                                                        <EnvelopeIcon className={`h-5 w-5 transition-colors duration-300 ${
                                                            focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                                                        }`} />
                                                    </div>
                                                    <input
                                                        id="email-address"
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField('')}
                                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm hover:shadow-md"
                                                        placeholder="you@example.com"
                                                        style={{
                                                            background: focusedField === 'email' ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' : '#ffffff'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    Password
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                                                        focusedField === 'password' ? 'scale-110' : ''
                                                    }`}>
                                                        <LockClosedIcon className={`h-5 w-5 transition-colors duration-300 ${
                                                            focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'
                                                        }`} />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        autoComplete="current-password"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('password')}
                                                        onBlur={() => setFocusedField('')}
                                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm hover:shadow-md"
                                                        placeholder="••••••••"
                                                        style={{
                                                            background: focusedField === 'password' ? 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)' : '#ffffff'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        id="remember-me"
                                                        name="rememberMe"
                                                        type="checkbox"
                                                        checked={formData.rememberMe}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-4 focus:ring-purple-200 transition-all cursor-pointer"
                                                    />
                                                    <label htmlFor="remember-me" className="ml-3 text-sm text-gray-700 font-medium">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={openForgotPassword}
                                                    className="text-sm text-purple-600 font-bold hover:text-purple-700 hover:underline decoration-2 underline-offset-2 transition-colors"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="relative w-full py-5 px-6 text-white font-bold text-lg rounded-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                                                style={{
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                                                    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
                                                }}
                                            >
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></span>
                                                <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                                                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                                    animation: 'pulseGlow 2s ease-in-out infinite'
                                                }}></span>
                                                
                                                <span className="relative flex items-center justify-center gap-3">
                                                    {loading ? (
                                                        <>
                                                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span className="animate-pulse">Signing in...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LockClosedIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                                            <span>Sign In</span>
                                                            <SparklesIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                                        </>
                                                    )}
                                                </span>
                                            </button>
                                        </form>

                                        <div className="mt-8 text-center">
                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                                <span className="text-xs text-gray-500 font-medium">OR</span>
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Don&apos;t have an account?{' '}
                                                <button 
                                                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors hover:underline decoration-2 underline-offset-2"
                                                    onClick={() => {
                                                        closeModal()
                                                    }}
                                                >
                                                    Register
                                                </button>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-6 w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium rounded-xl hover:bg-gray-50"
                                            onClick={closeModal}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* ForgotPasswordDialog Component */}
            <ForgotPasswordDialog 
                isOpen={isForgotPasswordOpen} 
                closeModal={closeForgotPassword}
            />

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes rotate-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-rotate-slow {
                    animation: rotate-slow 20s linear infinite;
                }
                .animate-rotate-reverse {
                    animation: rotate-reverse 15s linear infinite;
                }
                @keyframes border-horizontal {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes border-horizontal-reverse {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes border-vertical {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes border-vertical-reverse {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
                .animate-border-horizontal {
                    animation: border-horizontal 3s ease-in-out infinite;
                }
                .animate-border-horizontal-reverse {
                    animation: border-horizontal-reverse 3s ease-in-out infinite;
                }
                .animate-border-vertical {
                    animation: border-vertical 3s ease-in-out infinite;
                }
                .animate-border-vertical-reverse {
                    animation: border-vertical-reverse 3s ease-in-out infinite;
                }
                @keyframes particle-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                    50% { transform: translate(10px, -15px); opacity: 0.8; }
                }
                @keyframes particle-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.5; }
                    50% { transform: translate(-12px, 18px); opacity: 0.9; }
                }
                @keyframes particle-3 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    50% { transform: translate(15px, 10px); opacity: 0.7; }
                }
                @keyframes particle-4 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                    50% { transform: translate(-8px, -20px); opacity: 0.8; }
                }
                @keyframes particle-5 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.35; }
                    50% { transform: translate(20px, -12px); opacity: 0.75; }
                }
                @keyframes particle-6 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.45; }
                    50% { transform: translate(-15px, 15px); opacity: 0.85; }
                }
                .animate-particle-1 {
                    animation: particle-1 4s ease-in-out infinite;
                }
                .animate-particle-2 {
                    animation: particle-2 3.5s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                .animate-particle-3 {
                    animation: particle-3 4.5s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-particle-4 {
                    animation: particle-4 3.8s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
                .animate-particle-5 {
                    animation: particle-5 4.2s ease-in-out infinite;
                    animation-delay: 0.8s;
                }
                .animate-particle-6 {
                    animation: particle-6 3.6s ease-in-out infinite;
                    animation-delay: 1.2s;
                }
            `}</style>
        </>
    )
}

export default SigninDialog;