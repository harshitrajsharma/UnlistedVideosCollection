import { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Unlisted YouTube',
  description: 'Vault for unlisted videos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <footer className="bg-gray-100 dark:bg-gray-900 text-center p-4">
            <p>&copy; 2024 Memories. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}