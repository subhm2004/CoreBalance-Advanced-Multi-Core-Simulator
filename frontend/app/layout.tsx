import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CoreBalance: Advanced Multi-Core CPU Scheduler',
  description: 'Advanced multi-core CPU scheduling simulator with real-time visualization, Gantt charts, and comprehensive performance metrics',
  keywords: 'CPU scheduling, multi-core, OS, algorithms, FCFS, SJF, Round Robin, Priority, Load Balancing',
  authors: [{ name: 'Shubham Malik' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="stylesheet" href="/app-fallback.css" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
