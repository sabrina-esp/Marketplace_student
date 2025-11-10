import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { EnvelopeIcon, ArrowPathIcon, CheckCircleIcon, BookOpenIcon, AcademicCapIcon, SparklesIcon, KeyIcon } from '@heroicons/react/24/outline'

interface ForgotPasswordDialogProps {
    isOpen: boolean
    closeModal: () => void
}

const ForgotPasswordDialog = ({ isOpen, closeModal }: ForgotPasswordDialogProps) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [focusedField, setFocusedField] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await response.json()

            if (data.success) {
                setMessage({ 
                    type: 'success', 
                    text: '✅ Password reset link sent to your email!' 
                })
                setEmail('')
                setTimeout(() => closeModal(), 3000)
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.message || 'Error sending reset link' 
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

                    {/* Animated 3D Icons in background */}
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
                                    {/* Animated Border Lines */}
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
                                    
                                    {/* Header */}
                                    <div className="relative overflow-hidden" style={{
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                                        padding: '3rem 2rem',
                                        textAlign: 'center'
                                    }}>
                                        {/* Animated rotating semicircles */}
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                            <div className="absolute -top-10 -left-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                                            <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                                            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                                        </div>

                                        {/* Floating particles */}
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                            <div className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full animate-particle-1"></div>
                                            <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-particle-2"></div>
                                            <div className="absolute bottom-6 left-16 w-2.5 h-2.5 bg-white/30 rounded-full animate-particle-3"></div>
                                            <div className="absolute bottom-10 right-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-4"></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300" style={{
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                                animation: 'pulseGlow 2s ease-in-out infinite'
                                            }}>
                                                <KeyIcon className="w-12 h-12 text-purple-600" />
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                                                Reset Password
                                            </h2>
                                            <p className="text-purple-100 text-base">
                                                Enter your email to receive a reset link
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form content */}
                                    <div className="p-8" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
                                        {message.text && (
                                            <div className={`mb-6 p-5 rounded-2xl transform transition-all duration-300 ${
                                                message.type === 'success' 
                                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-lg' 
                                                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 shadow-lg'
                                            }`} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                                                <div className="flex items-center gap-3">
                                                    {message.type === 'success' && <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />}
                                                    <p className="text-sm font-semibold">{message.text}</p>
                                                </div>
                                            </div>
                                        )}

                                        <form className="space-y-6" onSubmit={handleSubmit}>
                                            {/* Email */}
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
                                                        type="email"
                                                        name="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
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

                                            {/* Submit Button */}
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
                                                            <span className="animate-pulse">Sending...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowPathIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                                            <span>Send Reset Link</span>
                                                            <SparklesIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                                        </>
                                                    )}
                                                </span>
                                            </button>
                                        </form>

                                        {/* Footer */}
                                        <div className="mt-8 text-center">
                                            <p className="text-sm text-gray-600">
                                                Remember your password?{' '}
                                                <button 
                                                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors hover:underline decoration-2 underline-offset-2"
                                                    onClick={closeModal}
                                                >
                                                    Back to Sign In
                                                </button>
                                            </p>
                                        </div>

                                        {/* Close button */}
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
            `}</style>
        </>
    )
}

export default ForgotPasswordDialog;