// SIDEBAR SELECIONADA
var currentPath = window.location.pathname;

// Selecionar todos os links de navegação
var links = document.querySelectorAll('.nav-link');

// Iterar sobre os links e verificar se o href corresponde ao caminho atual
links.forEach(function(link) {
    // Verifica se o href do link contém o caminho atual
    if (link.getAttribute('href') === currentPath || currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});

// FUNÇÃO PARA PUXAR AS INFOS DO ITEM PARA A MODAL
document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll(".itens");

    items.forEach(item => {
        item.addEventListener("click", function() {
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
});

// FUNCAO PARA ADICIOANR OS ITENS NA PAGINA DE FORMA DINAMICA
document.addEventListener("DOMContentLoaded", function() {
    //busca os itens da API
    async function carregarItens() {
        try {
            const response = await fetch('http://localhost:5000/itens'); //url da api
            const itens = await response.json();

            const container = document.getElementById('itens-container');
            container.innerHTML = ''; // Limpar o conteúdo atual

            itens.forEach(item => {
                const divItem = document.createElement('div');
                divItem.classList.add('itens');
                divItem.setAttribute('data-codigo', item.Codigo); // Atributos personalizados
                divItem.setAttribute('data-nome', item.nome);
                divItem.setAttribute('data-segmento', item.Segmento);
                divItem.setAttribute('data-complemento', item.Complemento);
                divItem.setAttribute('data-quantidade', item.Quantidade);
                divItem.setAttribute('data-unidade', item.Unidade);

                divItem.innerHTML = `
                    <p class="item-caracteristica item-nome">${item.nome}</p>
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
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
        }
    }

    // Chama a função para carregar os itens quando a página for carregada
    carregarItens();
});
