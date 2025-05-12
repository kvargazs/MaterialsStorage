// SIDEBAR
var currentPath = window.location.pathname;
var links = document.querySelectorAll('.nav-link');
links.forEach(function (link) {
    if (link.getAttribute('href') === currentPath || currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});

// MODAL DE ITENS
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("buscarBtn");

    async function carregarItens(filtro = '') {
        try {
            const response = await fetch('http://localhost:5000/itens');
            const itens = await response.json();

            const container = document.getElementById('itens-container');
            const mensagemVazia = document.getElementById('mensagem-vazia');
            container.innerHTML = '';

            const itensFiltrados = itens.filter(item => {
                return item.Descricao.toLowerCase().includes(filtro.toLowerCase()) ||
                    item.Codigo.toLowerCase().includes(filtro.toLowerCase());
            });

            if (itensFiltrados.length === 0) {
                mensagemVazia.style.display = "block";
            } else {
                mensagemVazia.style.display = "none";
                itensFiltrados.forEach(item => {
                    const divItem = document.createElement('div');
                    divItem.classList.add('itens');
                    divItem.setAttribute('data-codigo', item.Codigo);
                    divItem.setAttribute('data-nome', item.Descricao);
                    divItem.setAttribute('data-segmento', item.Segmento);
                    divItem.setAttribute('data-complemento', item.Complemento);
                    divItem.setAttribute('data-quantidade', item.Quantidade);
                    divItem.setAttribute('data-unidade', item.Unidade);

                    divItem.innerHTML = `
                        <p class="item-caracteristica item-nome">${item.Descricao}</p>
                        <p class="item-caracteristica item-codigo">Cód: ${item.Codigo}</p>
                        <p class="item-caracteristica item-segmento">Segmento: ${item.Segmento}</p>
                        <p class="item-caracteristica item-complemento">${item.Complemento}</p>
                        <div class="div-item-info">
                            <p class="item-caracteristica item-quantidade">Qntd: ${item.Quantidade}</p>
                            <p class="item-caracteristica item-unidade">Unid: ${item.Unidade}</p>
                        </div>
                    `;

                    container.appendChild(divItem);
                });

                // Aplica eventos da modal
                const updatedItems = document.querySelectorAll(".itens");
                updatedItems.forEach(item => {
                    item.addEventListener("click", function () {
                        const nome = item.getAttribute("data-nome");
                        const codigo = item.getAttribute("data-codigo");
                        const segmento = item.getAttribute("data-segmento");
                        const complemento = item.getAttribute("data-complemento");
                        const quantidade = item.getAttribute("data-quantidade");
                        const unidade = item.getAttribute("data-unidade");

                        document.getElementById("modal-nome").innerHTML = `<span>${nome}</span><span style="margin: 0 8px;">–</span><span id="modal-codigo" style="color: #0d6efd;">${codigo}</span>`;
                        document.getElementById("modal-segmento").textContent = `Segmento: ${segmento}`;
                        document.getElementById("modal-complemento").textContent = `Complemento: ${complemento}`;
                        document.getElementById("modal-quantidade").textContent = `Quantidade: ${quantidade}`;
                        document.getElementById("modal-unidade").textContent = `Unidade: ${unidade}`;

                        const myModal = new bootstrap.Modal(document.getElementById('itemModal'));
                        myModal.show();
                    });
                });
            }

        } catch (error) {
            console.error('Erro ao carregar itens:', error);
        }
    }

    carregarItens(); // Carrega todos ao iniciar

    function pesquisarItens() {
        const filtro = searchInput.value.trim();
        carregarItens(filtro);
    }

    // Eventos: digitar, apagar, clicar ou pressionar Enter
    searchInput.addEventListener("input", pesquisarItens);
    searchButton.addEventListener("click", pesquisarItens);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            pesquisarItens();
        }
    });
});
