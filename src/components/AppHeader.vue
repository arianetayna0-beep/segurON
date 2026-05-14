<template>
    <header class="header-content">
        <img src="../assets/logo.png" alt="Logo" class="logo">
        <div class="header-links">
            <router-link class="link" to="/">Início</router-link>
            <router-link class="link" to="/Sobre">Sobre</router-link>
        </div>
        <div class="buttons">
            <button class="login-button" @click="router.push('/Login')">Entrar</button>
            <button class="signup-button" @click="router.push('/cadastro')">Cadastrar-se</button>
            <i class="pi pi-align-justify" style="font-size: 2rem;"></i>
        </div>
    </header>
    <router-view />
</template>
