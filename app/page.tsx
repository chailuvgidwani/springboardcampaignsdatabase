'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RaceDatabase from '@/components/RaceDatabase'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="container mx-auto py-6 px-4">
      <RaceDatabase />
    </main>
  )
}