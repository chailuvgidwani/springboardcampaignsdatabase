import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Race Database',
  description: 'Database for tracking political race metrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}