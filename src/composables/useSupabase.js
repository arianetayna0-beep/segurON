import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const createFallbackSupabase = () => ({
    auth: {
        async getSession() {
            return { data: { session: null }, error: null }
        },
        onAuthStateChange() {
            return {
                data: { subscription: { unsubscribe() {} } },
                error: null,
            }
        },
    },
})

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabase()

const session = ref(null)
const loadingSession = ref(true)

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env para habilitar autenticacao.'
    )
}

supabase.auth.getSession().then(({ data }) => {

    session.value = data.session

    loadingSession.value = false

})



supabase.auth.onAuthStateChange((_event, newSession) => {

    session.value = newSession

})



export function useSupabase() {

    return {

        supabase,

        session,

        loadingSession

    }

}