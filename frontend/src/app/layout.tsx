// Shared root layout — applies to every page.
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Health Record System',
  description: 'Centralized Patient Health Record Management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
