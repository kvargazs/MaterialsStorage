let todosItens = [];

async function carregarItens(filtro = '') {
    try {
        const response = await fetch('http://localhost:5000/itens');
        todosItens = await response.json();

        renderizarItens(todosItens, filtro);
        gerarCheckboxesDeFiltro(todosItens);
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
    }
}

function renderizarItens(itens, filtro = '') {
    const container = document.getElementById('itens-container');
    const mensagemVazia = document.getElementById('mensagem-vazia');
    container.innerHTML = '';

    const itensFiltrados = itens.filter(item => {
        const textoFiltro = filtro.toLowerCase();
        return item.Descricao.toLowerCase().includes(textoFiltro) || item.Codigo.toLowerCase().includes(textoFiltro);
    });

    if (itensFiltrados.length === 0) {
        mensagemVazia.style.display = "block";
    } else {
        mensagemVazia.style.display = "none";
        itensFiltrados.forEach(item => {
            const divItem = document.createElement('div');
            divItem.classList.add('itens');
            divItem.dataset.codigo = item.Codigo;
            divItem.dataset.nome = item.Descricao;
            divItem.dataset.segmento = item.Segmento;
            divItem.dataset.complemento = item.Complemento;
            divItem.dataset.quantidade = item.Quantidade;
            divItem.dataset.unidade = item.Unidade;

            divItem.innerHTML = `
                <p class="item-caracteristica item-nome">${item.Descricao}</p>
                <p class="item-caracteristica item-codigo">Cód: ${item.Codigo}</p>
                <p class="item-caracteristica item-segmento">Segmento: ${item.Segmento}</p>
                <p class="item-caracteristica item-complemento">${item.Complemento}</p>
                <div class="div-item-info">
                    <p class="item-caracteristica item-quantidade">Quantidade: ${item.Quantidade}</p>
                    <p class="item-caracteristica item-unidade">Unidade: ${item.Unidade}</p>
                </div>
            `;

            divItem.addEventListener("click", () => {
                itemSelecionado = {
                    nome: item.Descricao,
                    codigo: item.Codigo,
                    segmento: item.Segmento,
                    complemento: item.Complemento,
                    quantidade: item.Quantidade,
                    unidade: item.Unidade
                };

                document.getElementById("modal-nome").innerHTML = `<span>${itemSelecionado.nome}</span><span style="margin: 0 8px;">–</span><span id="modal-codigo" style="color: #0d6efd;">${itemSelecionado.codigo}</span>`;
                document.getElementById("modal-segmento").textContent = `Segmento: ${itemSelecionado.segmento}`;
                document.getElementById("modal-complemento").textContent = `Complemento: ${itemSelecionado.complemento}`;
                document.getElementById("modal-quantidade").textContent = `Quantidade: ${itemSelecionado.quantidade}`;
                document.getElementById("modal-unidade").textContent = `Unidade: ${itemSelecionado.unidade}`;

                new bootstrap.Modal(document.getElementById('itemModal')).show();
            });

            container.appendChild(divItem);
        });
    }
}

function gerarCheckboxesDeFiltro(itens) {
    const segmentos = [...new Set(itens.map(i => i.Segmento))];
    const unidades = [...new Set(itens.map(i => i.Unidade))];

    const containerSegmento = document.getElementById("filtroSegmento");
    const containerUnidade = document.getElementById("filtroUnidade");

    containerSegmento.innerHTML = '';
    containerUnidade.innerHTML = '';

    segmentos.forEach(seg => {
        const id = `seg-${seg}`;
        containerSegmento.innerHTML += `
            <div class="form-check">
                <input class="form-check-input filtro-segmento" type="checkbox" value="${seg}" id="${id}">
                <label class="form-check-label" for="${id}">${seg}</label>
            </div>
        `;
    });

    unidades.forEach(uni => {
        const id = `uni-${uni}`;
        containerUnidade.innerHTML += `
            <div class="form-check">
                <input class="form-check-input filtro-unidade" type="checkbox" value="${uni}" id="${id}">
                <label class="form-check-label" for="${id}">${uni}</label>
            </div>
        `;
    });
}

function aplicarFiltros() {
    const segmentosSelecionados = Array.from(document.querySelectorAll('.filtro-segmento:checked')).map(cb => cb.value);
    const unidadesSelecionadas = Array.from(document.querySelectorAll('.filtro-unidade:checked')).map(cb => cb.value);
    const textoFiltro = document.getElementById("search").value.trim().toLowerCase();

    const itensFiltrados = todosItens.filter(item => {
        const segmentoOk = segmentosSelecionados.length === 0 || segmentosSelecionados.includes(item.Segmento);
        const unidadeOk = unidadesSelecionadas.length === 0 || unidadesSelecionadas.includes(item.Unidade);
        const textoOk = item.Descricao.toLowerCase().includes(textoFiltro) || item.Codigo.toLowerCase().includes(textoFiltro);
        return segmentoOk && unidadeOk && textoOk;
    });

    renderizarItens(itensFiltrados);
}

function limparFiltros() {
    document.querySelectorAll('.filtro-segmento, .filtro-unidade').forEach(cb => cb.checked = false);
    document.getElementById("search").value = '';
    renderizarItens(todosItens);
}

function pesquisarItens() {
    aplicarFiltros(); // reaproveita lógica
}