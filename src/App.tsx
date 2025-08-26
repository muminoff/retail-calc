import { useEffect } from 'react'
import { Calculator } from '@/components/Calculator'

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Set theme
      document.documentElement.classList.toggle('dark', tg.colorScheme === 'dark')
      
      // Hide buttons since we have a single page
      tg.BackButton.hide()
      tg.MainButton.hide()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Calculator />
      </div>
    </div>
  )
}

export default App