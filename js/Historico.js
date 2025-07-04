document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Se não for ADM, remove o menu de histórico
  if (!usuario || usuario.tipo !== 'adm') {
    const menuHistorico = document.getElementById('menu-historico');
    const menuCadastro = document.getElementById('menu-cadastro');
    if (menuHistorico && menuCadastro) {
      menuHistorico.remove();
      menuCadastro.remove();
    }
  }
});