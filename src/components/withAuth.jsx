// components/withAuth.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function withAuth(Component, requireAuth = true) {
  return function AuthenticatedComponent(props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = () => {
        const hasToken = document.cookie.split(';').some(item => item.trim().startsWith('token='))

        if (!hasToken && requireAuth) {
          router.replace('/login')
        } else if (hasToken && !requireAuth) {
          router.replace('/')
        } else {
          setIsLoading(false)
        }
      }

      checkAuth()
    }, [router])

    if (isLoading) {
      return (
        <LoadingSpinner/>
      )
    }

    return <Component {...props} />
  }
}

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  )
}


