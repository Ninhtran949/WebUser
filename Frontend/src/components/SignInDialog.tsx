import React, { useState } from 'react'
import {
  XIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
interface SignInDialogProps {
  isOpen: boolean
  onClose: () => void
}
const SignInDialog = ({ isOpen, onClose }: SignInDialogProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    address: '',
    strUriAvatar: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, signup } = useAuth()
  const { t } = useLanguage()
  if (!isOpen) return null
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (isSignup) {
        await signup(formData)
      } else {
        await login(formData.phoneNumber, formData.password)
      }
      onClose()
    } catch (err) {
      setError(t(isSignup ? 'error.signupFailed' : 'error.invalidCredentials'))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl transform transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={t('auth.close')}
        >
          <XIcon size={20} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            {t(isSignup ? 'auth.createAccount' : 'auth.signIn')}
          </h2>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <div className="relative">
                  <UserIcon
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    required={isSignup}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <MapPinIcon
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={t('auth.addressPlaceholder')}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    required={isSignup}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </>
            )}
            <div className="relative">
              <PhoneIcon
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="tel"
                placeholder={t('auth.phonePlaceholder')}
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label={t(
                  showPassword ? 'auth.hidePassword' : 'auth.showPassword',
                )}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 transition-colors"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                    {t('auth.rememberMe')}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-800 hover:text-blue-900 hover:underline transition-colors"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white rounded-lg py-3 font-medium hover:bg-blue-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {t(isSignup ? 'auth.creatingAccount' : 'auth.signingIn')}
                </div>
              ) : (
                t(isSignup ? 'auth.createAccount' : 'auth.signIn')
              )}
            </button>
          </form>
          <button
            type="button"
            className="mt-6 text-blue-800 hover:text-blue-900 hover:underline text-sm font-medium transition-colors w-full text-center"
            onClick={() => setIsSignup(!isSignup)}
          >
            {t(isSignup ? 'auth.alreadyHaveAccount' : 'auth.needAccount')}
          </button>
          <p className="mt-6 text-sm text-gray-500 text-center">
            {t('auth.termsText')}{' '}
            <a
              href="#"
              className="text-blue-800 hover:text-blue-900 hover:underline"
            >
              {t('auth.termsOfUse')}
            </a>{' '}
            {t('auth.andText')}{' '}
            <a
              href="#"
              className="text-blue-800 hover:text-blue-900 hover:underline"
            >
              {t('auth.privacyPolicy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
export default SignInDialog
