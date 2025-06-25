'use client'

import { useEffect } from 'react'
import BlogHeader from '@/Components/BlogHeader'
import BlogEditor from '@/Components/BlogEditor'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function WriteBlogPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/blogs/login')
    }
  }, [user, loading, router])
  
  if (loading) {
    return (
      <>
        <BlogHeader />
        <main className="min-h-screen bg-white pt-24 md:pt-32">
          <div className="container mx-auto px-4">
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c60000]"></div>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4">
          <BlogEditor />
        </div>
      </main>
    </>
  )
} 