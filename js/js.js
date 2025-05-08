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

    for (let i = 2; i <= 8; i++) {
        adicionarItem(`ITEM ${i}`);
    }
});



// MODAL
document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll(".itens");

    items.forEach(item => {
        item.addEventListener("click", function() {
            // Pega os dados do item
            const nome = item.querySelector(".item-nome").textContent;
            const codigo = item.querySelector(".item-codigo").textContent.split("Cód: ")[1]; // Extrair apenas o código
            const segmento = item.querySelector(".item-segmento").textContent.split("Segmento: ")[1];
            const complemento = item.querySelector(".item-complemento").textContent;
            const quantidade = item.querySelector(".item-quantidade").textContent.split("Qntd: ")[1];
            const unidade = item.querySelector(".item-unidade").textContent.split("Unid: ")[1];

            // Preenche o nome e o código no modal (ao lado)
            document.getElementById("modal-nome").innerHTML = `<span>${nome}</span><span style="margin: 0 8px;">–</span><span id="modal-codigo" style="color: #0d6efd;">${codigo}</span>`;

            // Preenche os outros campos
            document.getElementById("modal-segmento").textContent = `Segmento: ${segmento}`;
            document.getElementById("modal-complemento").textContent = `Complemento: ${complemento}`;
            document.getElementById("modal-quantidade").textContent = `Quantidade: ${quantidade}`;
            document.getElementById("modal-unidade").textContent = `Unidade: ${unidade}`;

            // Abre o modal usando o Bootstrap
            const myModal = new bootstrap.Modal(document.getElementById('itemModal'));
            myModal.show();
        });
    });
});






