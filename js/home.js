// SIDEBAR
var currentPath = window.location.pathname;
var links = document.querySelectorAll('.nav-link');
links.forEach(function (link) {
    if (link.getAttribute('href') === currentPath || currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});

// Variável global para armazenar o item selecionado
let itemSelecionado = null;

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
                        // Salvar item selecionado na variável global
                        itemSelecionado = {
                            nome: item.getAttribute("data-nome"),
                            codigo: item.getAttribute("data-codigo"),
                            segmento: item.getAttribute("data-segmento"),
                            complemento: item.getAttribute("data-complemento"),
                            quantidade: item.getAttribute("data-quantidade"),
                            unidade: item.getAttribute("data-unidade")
                        };

                        // Preencher modal itemModal
                        document.getElementById("modal-nome").innerHTML = `<span>${itemSelecionado.nome}</span><span style="margin: 0 8px;">–</span><span id="modal-codigo" style="color: #0d6efd;">${itemSelecionado.codigo}</span>`;
                        document.getElementById("modal-segmento").textContent = `Segmento: ${itemSelecionado.segmento}`;
                        document.getElementById("modal-complemento").textContent = `Complemento: ${itemSelecionado.complemento}`;
                        document.getElementById("modal-quantidade").textContent = `Quantidade: ${itemSelecionado.quantidade}`;
                        document.getElementById("modal-unidade").textContent = `Unidade: ${itemSelecionado.unidade}`;

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


   // Elementos usados na modal de baixa
    const inputQuantidadeBaixa = document.getElementById('quantidadeBaixa');
    const confirmarBaixaBtn = document.getElementById('confirmarBaixaBtn');

    // Botão dar baixa
    btnDarBaixa.addEventListener('click', function () {
        // Esconder modal de item
        const itemModalEl = document.getElementById('itemModal');
        const itemModalInstance = bootstrap.Modal.getInstance(itemModalEl);
        if (itemModalInstance) itemModalInstance.hide();

        if (itemSelecionado) {
            // Preenche nome e código
            const nomeCodigoBaixa = document.getElementById('nomeCodigoBaixa');
            nomeCodigoBaixa.innerHTML = `<strong>Item: </strong> ${itemSelecionado.nome} (Código: ${itemSelecionado.codigo})`;

            // Preenche quantidade atual
            const quantidadeAtualBaixa = document.getElementById('quantidadeAtualBaixa');
            quantidadeAtualBaixa.innerHTML = `<strong>Quantidade atual: </strong> ${itemSelecionado.quantidade}`;

            // Define limites no input
            inputQuantidadeBaixa.setAttribute('min', '1');
            inputQuantidadeBaixa.setAttribute('max', itemSelecionado.quantidade);
            inputQuantidadeBaixa.value = '';
        }

        // Mostrar modal de baixa
        const darBaixaModalEl = document.getElementById('darBaixaModal');
        const darBaixaModalInstance = new bootstrap.Modal(darBaixaModalEl);
        darBaixaModalInstance.show();
    });

    // Confirmação da baixa
    confirmarBaixaBtn.addEventListener('click', async () => {
    if (!itemSelecionado) {
        alert('Nenhum item selecionado!');
        return;
    }

    const quantidadeDigitada = parseInt(inputQuantidadeBaixa.value, 10);

    if (isNaN(quantidadeDigitada) || quantidadeDigitada <= 0) {
        alert('Digite uma quantidade válida!');
        return;
    }

    // Calcula quantidade final após baixa
    const quantidadeAtual = Number(itemSelecionado.quantidade);
    if (quantidadeDigitada > quantidadeAtual) {
        alert(`A quantidade para baixa não pode ser maior que a quantidade atual (${quantidadeAtual}).`);
        return;
    }

    const quantidadeFinal = quantidadeAtual - quantidadeDigitada;

    try {
        const response = await fetch(`http://localhost:5000/itens/${itemSelecionado.codigo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantidade: quantidadeFinal})
    });

        const data = await response.json();

        if (response.ok) {
        alert('Quantidade atualizada com sucesso!');
        itemSelecionado.quantidade = quantidadeFinal;

        const darBaixaModalEl = document.getElementById('darBaixaModal');
        const darBaixaModalInstance = bootstrap.Modal.getInstance(darBaixaModalEl);
        if (darBaixaModalInstance) darBaixaModalInstance.hide();

        carregarItens();
        } else {
        alert(data.message || 'Erro ao atualizar quantidade.');
        }
    } catch (error) {
        console.error('Erro ao chamar API:', error);
        alert('Erro de conexão com o servidor.');
    }
    });
});