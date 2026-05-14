<template>                                                                          <!-- bloco obrigatório que envolve o HTML do componente Vue -->

  <header class="navbar">                                                          <!-- faixa do topo da página -->

    <div class="navbar__marca">                                                    <!-- agrupa apenas o logo -->
      <img
        src="../assets/logo.png"                                                   <!-- caminho da imagem do logo -->
        alt="Logo EPI"                                                             <!-- texto se a imagem não carregar -->
        class="navbar__logo"                                                       <!-- classe CSS que define o tamanho do logo -->
      />                                                                           <!-- tag img não tem fechamento -->
    </div>                                                                         <!-- fecha o agrupador do logo -->

    <nav aria-label="Menu principal">                                              <!-- área de navegação, aria-label ajuda leitores de tela -->
      <ul class="navbar__lista">                                                   <!-- lista sem numeração ou bolinhas -->
        <li><RouterLink to="/" class="navbar__link">Dashboard</RouterLink></li>                         <!-- li: item da lista | RouterLink: navega sem recarregar -->
        <li><RouterLink to="/colaboradores" class="navbar__link">Colaboradores</RouterLink></li>        <!-- to: rota definida no router/index.js -->
        <li><RouterLink to="/equipamentos" class="navbar__link">Equipamentos</RouterLink></li>          <!-- to: rota definida no router/index.js -->
        <li><RouterLink to="/entregas" class="navbar__link">Entregas</RouterLink></li>                  <!-- to: rota definida no router/index.js -->
        <li><RouterLink to="/relatorios" class="navbar__link">Relatórios</RouterLink></li>              <!-- to: rota definida no router/index.js -->
      </ul>                                                                        <!-- fecha a lista -->
    </nav>                                                                         <!-- fecha a navegação -->

    <RouterLink to="/login" class="navbar__login">                                 <!-- link que leva para a rota /login -->
      <button type="button" class="navbar__btn">Entrar</button>                   <!-- botão clicável, type="button" evita envio de formulário -->
    </RouterLink>                                                                  <!-- fecha o RouterLink do botão -->

  </header>                                                                        <!-- fecha o header -->
</template>  
