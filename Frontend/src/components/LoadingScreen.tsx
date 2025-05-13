import React, { useEffect, useState, memo } from 'react'
import { BookOpenIcon } from 'lucide-react'

interface LoadingScreenProps {
  isLoading: boolean
}

const LoadingScreen = memo(({ isLoading }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    // Removed unused progressInterval
    let hideTimeout: NodeJS.Timeout

    if (isLoading) {
      // Show immediately when loading starts
      setShowLoading(true)
      setProgress(0)

      // Use RAF for smoother progress animation
      const startTime = Date.now()
      const duration = 2000 // 2 seconds to reach 90%

      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / duration) * 90, 90)
        setProgress(newProgress)

        if (newProgress < 90) {
          requestAnimationFrame(updateProgress)
        }
      }

      requestAnimationFrame(updateProgress)

    } else if (showLoading) {
      // Quick fill to 100% when loading completes
      setProgress(100)
      hideTimeout = setTimeout(() => {
        setShowLoading(false)
      }, 200) // Reduced from 500ms to 200ms
    }

    return () => {
      // Removed unused clearInterval call
      clearTimeout(hideTimeout)
    }
  }, [isLoading])

  if (!showLoading) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-[2px] transition-opacity duration-200 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <div className="relative mb-6">
        <BookOpenIcon 
          size={40} 
          className="text-blue-800 animate-spin-slow"
          style={{ animationDuration: '1.5s' }} 
        />
      </div>

      <div className="text-lg font-medium text-gray-800 mb-3">
        <span className="inline-block">Loading</span>
        <span className="inline-flex w-5 mx-1">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </div>

      <div className="w-56 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-800 transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            transition: 'width 200ms ease-out'
          }}
        />
      </div>
    </div>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
