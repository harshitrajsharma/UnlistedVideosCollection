'use client'

import { Home } from '@/components/home'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include', // This is important to include cookies
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null // This will prevent any flash of unauthenticated content
  }

  return (
    <main>
      <Home />
    </main>
  )
}

export default Page