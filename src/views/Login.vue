<template>
    <div class = "container">
    <main class="auth-page">
        <form @submit.prevent="fazerLogin">
            <div class="input-group">
                <label for="email">Email:</label>
                <input class="input" type="email" id="email" v-model="email" required />
            </div>
            <div class="input-group">
                <label for="password">Senha:</label>
                <input class="input" type="password" id="password" v-model="password" required />
            </div>
            <button class="login-button" type="submit" :disabled="loading">Entrar</button>
            <p v-if="erro" class="error">{{ erro }}</p>
        </form>
    </main>
    </div>
</template>
 
<script setup>
import { useSupabase } from '../composables/UseSupabase.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
 
const { supabase } = useSupabase()
const router = useRouter()
 
const email = ref('')
const password = ref('')
const loading = ref(false)
const erro = ref('')
 
async function fazerLogin() {
    erro.value = ''
    loading.value = true
 
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
 
        if (error) {
            erro.value = 'Falha no login. Verifique suas credenciais.'
            return
        }
 
        router.push('/dashboard')
    } finally {
        loading.value = false
    }
}
</script>