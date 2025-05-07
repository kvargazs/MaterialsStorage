// Obter o caminho atual da URL
var currentPath = window.location.pathname;

// Selecionar todos os links de navegação
var links = document.querySelectorAll('.nav-link');

// Iterar sobre os links e verificar se o href corresponde ao caminho atual
links.forEach(function(link) {
    // Se o href do link corresponder à URL atual, adicione a classe "active"
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});