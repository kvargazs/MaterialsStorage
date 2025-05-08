// SIDEBAR SELECIONADA
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



// NOVO ITEM
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("itens-container");

    // Função para adicionar um novo item
    function adicionarItem(nomeItem) {
        const novoItem = document.createElement("div");
        novoItem.classList.add("itens");
        novoItem.innerHTML = nomeItem;
        container.appendChild(novoItem);
    }

    for (let i = 1; i <= 8; i++) {
        adicionarItem(`ITEM ${i}`);
    }
});

