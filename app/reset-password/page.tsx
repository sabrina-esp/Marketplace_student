'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, BookOpenIcon, AcademicCapIcon, SparklesIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [token, setToken] = useState('')
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [focusedField, setFocusedField] = useState('')
    const [tokenValid, setTokenValid] = useState(true)

    useEffect(() => {
        setMounted(true)
        const tokenParam = searchParams.get('token')
        if (tokenParam) {
            setToken(tokenParam)
            setTokenValid(true)
        } else {
            setTokenValid(false)
            setMessage({ 
                type: 'error', 
                text: '⚠️ Invalid or missing reset token. Please request a new password reset link.' 
            })
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: '❌ Passwords do not match' })
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: '❌ Password must be at least 6 characters' })
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: formData.password })
            })
            const data = await response.json()

            if (data.success) {
                setMessage({ 
                    type: 'success', 
                    text: '✅ Password reset successful! Redirecting to login...' 
                })
                setTimeout(() => router.push('/'), 3000)
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.message || '❌ Error resetting password. The link may have expired.' 
                })
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage({ 
                type: 'error', 
                text: '❌ Server connection error. Please try again.' 
            })
        } finally {
            setLoading(false)
        }
    }

    const handleRequestNewLink = () => {
        router.push('/')
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            {/* Animated 3D Icons in background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ perspective: '1000px' }}>
                <div className="absolute top-20 left-10 opacity-20" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <BookOpenIcon className="w-32 h-32 text-white" />
                </div>
                <div className="absolute top-40 right-20 opacity-20" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                    <AcademicCapIcon className="w-40 h-40 text-white" />
                </div>
                <div className="absolute bottom-32 left-32 opacity-20" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '2s' }}>
                    <SparklesIcon className="w-24 h-24 text-white" />
                </div>
                <div className="absolute bottom-20 right-40 opacity-20" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}>
                    <KeyIcon className="w-36 h-36 text-white" />
                </div>
            </div>

            <div className="w-full max-w-md transform transition-all duration-500 relative z-10">
                <div 
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
                    style={{
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(124, 58, 237, 0.5)',
                    }}
                >
                    {/* Header */}
                    <div className="relative overflow-hidden" style={{
                        background: tokenValid 
                            ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #f87171 100%)',
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-2xl">
                                {tokenValid ? (
                                    <KeyIcon className="w-12 h-12 text-purple-600" />
                                ) : (
                                    <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
                                )}
                            </div>
                            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                                {tokenValid ? 'Create New Password' : 'Invalid Reset Link'}
                            </h2>
                            <p className="text-white text-base opacity-90">
                                {tokenValid ? 'Enter your new password below' : 'The reset link is invalid or has expired'}
                            </p>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="p-8" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
                        {message.text && (
                            <div className={`mb-6 p-5 rounded-2xl ${
                                message.type === 'success' 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200' 
                                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200'
                            }`}>
                                <div className="flex items-center gap-3">
                                    {message.type === 'success' ? (
                                        <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
                                    ) : (
                                        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                                    )}
                                    <p className="text-sm font-semibold">{message.text}</p>
                                </div>
                            </div>
                        )}

                        {!tokenValid ? (
                            <div className="text-center space-y-6">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    The password reset link you clicked is invalid or has expired. 
                                    Password reset links are only valid for 1 hour for security reasons.
                                </p>
                                
                                <button
                                    onClick={handleRequestNewLink}
                                    className="w-full py-5 px-6 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                                        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <KeyIcon className="w-6 h-6" />
                                        <span>Request New Reset Link</span>
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        New Password
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className={`h-5 w-5 ${focusedField === 'password' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        Confirm Password
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className={`h-5 w-5 ${focusedField === 'confirmPassword' ? 'text-purple-600' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 px-6 text-white font-bold text-lg rounded-2xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                                        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Resetting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <KeyIcon className="w-6 h-6" />
                                                <span>Reset Password</span>
                                                <SparklesIcon className="w-6 h-6" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}