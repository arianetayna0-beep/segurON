<template>
    <header class="header-content">
            <img src="../assets/logo.png" alt="Logo" class="logo">
            <div class="header-links">
                <router-link class="link" to="/">Início</router-link>
                <router-link class="link" to="/sobre">Sobre</router-link>
            </div>
            <div class="buttons">
                <button class="login-button" @click="router.push('/login')">Entrar</button>
                <i class="pi pi-align-justify" style="font-size: 2rem;"></i>
            </div>
    </header>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        return { router };
    }
}
</script>

<style scoped>
.header-content{
    display: flex;
    justify-content: space-around;
    height: 6rem;
    align-items: center;
    background-color: #fff;
    gap: 5rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.logo{
    margin-top: 4rem;
    width: 10rem;
}

.link{
    text-decoration: none;
    color: #000;
    font-size: 1.2rem;
}

.header-links {
    display: flex;
    align-items: center;
    gap: 8rem;
}

.link:hover {
    color: #1f9f21;
}

.buttons {
    display: flex;
    gap: 1rem;
}

.login-button{
    width: 6rem;
    height: 2rem;
    border-radius: 1rem;
    border: none;
    background-color: #E5E5F0;
    color: #88AB5D;
    font-weight: bold;
    cursor: pointer;
}

.login-button:hover {
    background-color: #88AB5D;
    color: #fff;
}

</style>