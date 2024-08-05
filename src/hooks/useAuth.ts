import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<Session | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return { user }
}
