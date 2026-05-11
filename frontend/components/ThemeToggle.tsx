'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-24 rounded-[var(--cb-radius)] bg-[var(--cb-border)] animate-pulse" aria-hidden />
  }

  const currentTheme = resolvedTheme || theme || 'light'

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a
        href="https://github.com/subhm2004/CoreBalance-Advanced-Multi-Core-Simulator.git"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary py-2 px-3 text-sm gap-2"
        aria-label="View on GitHub"
      >
        <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.184.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.268.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.195 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">GitHub</span>
      </a>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleTheme()
        }}
        onMouseDown={(e) => {
          e.preventDefault()
        }}
        type="button"
        className="btn-secondary py-2 px-3 text-sm"
        aria-label="Toggle theme"
      >
        {currentTheme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </div>
  )
}
