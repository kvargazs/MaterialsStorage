// importa o Express para criar um conjunto de rotas
import express from 'express';

// importa o sql e o poolPromise do arquivo db.js
import { sql, poolPromise } from './db.js';

// cria um roteador (router) para agrupar as rotas do servidor
const router = express.Router();

//ROTA PARA INSERIR ITEM
router.post('/inserir', async (req, res) => {
    const { nome, codigo, segmento, complemento, unidade, quantidade, nomeUsuario } = req.body;

    try {
        const pool = await poolPromise;

        // Verifica se já existe um item com o mesmo código
        const result = await pool.request()
            .input('codigo', sql.VarChar(20), codigo)
            .query('SELECT * FROM itens WHERE Codigo = @codigo');

        if (result.recordset.length > 0) {
            // Já existe: atualiza a quantidade
            await pool.request()
                .input('codigo', sql.VarChar(20), codigo)
                .input('quantidade', sql.Int, quantidade)
                .query(`
                    UPDATE itens 
                    SET Quantidade = Quantidade + @quantidade 
                    WHERE Codigo = @codigo
                `);

            res.status(200).send('Quantidade atualizada com sucesso!');
        } else {
            // Não existe: faz o insert
            await pool.request()
                .input('Codigo', sql.VarChar(20), codigo)
                .input('Segmento', sql.VarChar(100), segmento)
                .input('Descricao', sql.VarChar(255), nome) // Corrigido aqui
                .input('Complemento', sql.VarChar(255), complemento)
                .input('Unidade', sql.VarChar(50), unidade)
                .input('Quantidade', sql.Int, quantidade)
                .query(`
                    INSERT INTO itens (Codigo, Segmento, Descricao, Complemento, Unidade, Quantidade)
                    VALUES (@Codigo, @Segmento, @Descricao, @Complemento, @Unidade, @Quantidade)
                `);

            //res.status(200).send('Item inserido com sucesso!');
            // Insere o registro na tabela 'movimentacoes'
            await pool.request()
                .input('codigo', sql.VarChar(20), codigo)
                .input('nome', sql.VarChar(255), nome)
                .input('quantidade', sql.Int, quantidade)
                .input('unidade', sql.VarChar(50), unidade)
                .input('usuarioNome', sql.VarChar(255), nomeUsuario)
                .input('dataMovimentacao', sql.DateTime, new Date()) // Adiciona timestamp atual
                .query(`
                    INSERT INTO movimentacoes (Codigo, Nome, Movimentacao, Quantidade, Unidade, UsuarioNome, DataMovimentacao)
                    VALUES (@codigo, @nome, 'adicionar', @quantidade, @unidade, @usuarioNome, @dataMovimentacao)
                `);

            res.status(200).json({ message: 'Item inserido e movimentação registrada com sucesso' });
        }

    } catch (error) {
        console.error('Erro ao inserir ou atualizar item:', error);
        res.status(500).json({ message: error.message });
    }
});



//ROTA PARA TRAZER OS itens DO BANCO PARA A TELA
router.get('/itens', async (req, res) => {
    try {
        const pool = await poolPromise;

        // consulta o banco
        const result = await pool.request().query(`
            SELECT Codigo, Descricao, Segmento, Complemento, Quantidade, Unidade FROM itens
        `);

        res.json(result.recordset); // envia o array de itens
    } catch (error) {
        console.error('Erro ao consultar os itens:', error);
        res.status(500).json({ message: error.message });
    }
});

// ROTA PARA DAR BAIXA (atualizar SOMENTE a quantidade de um item)
router.put('/itens/:codigo/quantidade', async (req, res) => {
  const { codigo } = req.params;
  const { quantidade } = req.body;

  if (quantidade == null || isNaN(quantidade) || quantidade < 0) {
    return res.status(400).json({ message: 'Quantidade inválida' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('codigo', sql.VarChar(20), codigo)
      .query('SELECT Quantidade FROM itens WHERE Codigo = @codigo');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    await pool.request()
      .input('codigo', sql.VarChar(20), codigo)
      .input('quantidade', sql.Int, quantidade)
      .query(`
        UPDATE itens
        SET Quantidade = @quantidade
        WHERE Codigo = @codigo
      `);

    res.status(200).json({ message: 'Quantidade atualizada com sucesso', novaQuantidade: quantidade });

  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    res.status(500).json({ message: error.message });
  }
});



// ROTA LOGIN
router.post('/login', async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const pool = await poolPromise;

        // Consulta SQL com parâmetros para evitar SQL Injection
        const result = await pool
            .request()
            .input('nome', nome)
            .input('senha', senha)
            .query(`
                SELECT * FROM Usuarios WHERE nome = @nome AND senha = @senha
            `);

        if (result.recordset.length > 0) {
            // Pega os dados do usuário e estrutura como JSON
            const usuario = result.recordset[0];

            // Cria um objeto JSON com as informações do usuário
            const usuarioJson = {
                nome: usuario.nome,
                tipo: usuario.tipo
            };

            // Retorna o JSON para o cliente
            res.json({ sucesso: true, usuario: usuarioJson });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});



// ROTA PARA DELETAR UM ITEM PELO CÓDIGO
router.delete('/itens/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { nome, quantidade, unidade, nomeUsuario} = req.body;

  try {
    const pool = await poolPromise;

    // Verifica se o item existe
    const result = await pool.request()
      .input('codigo', sql.VarChar(20), codigo)
      .query('SELECT * FROM itens WHERE Codigo = @codigo');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Deleta o item
    await pool.request()
      .input('codigo', sql.VarChar(20), codigo)
      .query('DELETE FROM itens WHERE Codigo = @codigo');

     //res.status(200).json({ message: 'Item excluído com sucesso!' });

    // Insere o registro na tabela 'movimentacoes'
    await pool.request()
        .input('codigo', sql.VarChar(20), codigo)
        .input('nome', sql.VarChar(255), nome)
        .input('quantidade', sql.Int, quantidade)
        .input('unidade', sql.VarChar(50), unidade)
        .input('usuarioNome', sql.VarChar(255), nomeUsuario)
        .input('dataMovimentacao', sql.DateTime, new Date()) // Adiciona timestamp atual
        .query(`
            INSERT INTO movimentacoes (Codigo, Nome, Movimentacao, Quantidade, Unidade, UsuarioNome, DataMovimentacao)
            VALUES (@codigo, @nome, 'excluir', @quantidade, @unidade, @usuarioNome, @dataMovimentacao)
        `);


    res.status(200).json({ message: 'Item excluído e movimentação registrada com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ message: error.message });
  }
});





// ROTA PARA EDITAR ITEM COMPLETO PELO CÓDIGO
/*
router.put('/itens/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome, complemento, quantidade, unidade, segmento, usuarioNome } = req.body;

    console.log('Atualizando item:', { codigo, nome, complemento, quantidade, unidade, segmento });

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('codigo', sql.VarChar(20), codigo)
            .input('nome', sql.VarChar(255), nome)
            .input('complemento', sql.VarChar(255), complemento)
            .input('quantidade', sql.Int, quantidade)
            .input('unidade', sql.VarChar(50), unidade)
            .input('segmento', sql.VarChar(100), segmento)
            .query(`
                UPDATE itens
                SET Descricao = @nome,
                    Complemento = @complemento,
                    Quantidade = @quantidade,
                    Unidade = @unidade,
                    Segmento = @segmento
                WHERE Codigo = @codigo
            `);

        res.status(200).json({ message: 'Item atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ message: error.message });
    }
});
*/
router.put('/itens/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome, complemento, quantidade, unidade, segmento, usuarioNome } = req.body;

    console.log('Atualizando item:', { codigo, nome, complemento, quantidade, unidade, segmento });

    try {
        const pool = await poolPromise;

        // Atualiza o item na tabela 'itens'
        await pool.request()
            .input('codigo', sql.VarChar(20), codigo)
            .input('nome', sql.VarChar(255), nome)
            .input('complemento', sql.VarChar(255), complemento)
            .input('quantidade', sql.Int, quantidade)
            .input('unidade', sql.VarChar(50), unidade)
            .input('segmento', sql.VarChar(100), segmento)
            .query(`
                UPDATE itens
                SET Descricao = @nome,
                    Complemento = @complemento,
                    Quantidade = @quantidade,
                    Unidade = @unidade,
                    Segmento = @segmento
                WHERE Codigo = @codigo
            `);

        // Insere o registro na tabela 'movimentacoes'
        await pool.request()
            .input('codigo', sql.VarChar(20), codigo)
            .input('nome', sql.VarChar(255), nome)
            .input('quantidade', sql.Int, quantidade)
            .input('unidade', sql.VarChar(50), unidade)
            .input('usuarioNome', sql.VarChar(255), usuarioNome)
            .input('dataMovimentacao', sql.DateTime, new Date()) // Adiciona timestamp atual
            .query(`
                INSERT INTO movimentacoes (Codigo, Nome, Movimentacao, Quantidade, Unidade, UsuarioNome, DataMovimentacao)
                VALUES (@codigo, @nome, 'editar', @quantidade, @unidade, @usuarioNome, @dataMovimentacao)
            `);

        res.status(200).json({ message: 'Item atualizado e movimentação registrada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ message: error.message });
    }
});




// ROTA PARA ADICIONAR USUÁRIO
router.post('/adicionarusuario', async (req, res) => {
    const { nome_usuario, senha_usuario, tipo_usuario} = req.body;

    try {
        const pool = await poolPromise;

        // Verifica se já existe um item com o mesmo nome
        const result = await pool.request()
            .input('nome_usuario', sql.VarChar(20), nome_usuario)
            .query('SELECT * FROM usuarios WHERE Codigo = @nome_usuario');

        if (result.recordset.length = 0) {
            
            // O usuário não existe: faz o insert
            await pool.request()
                .input('nome_usuario', sql.VarChar(20), nome_usuario)
                .input('senha_usuario', sql.VarChar(100), senha_usuario)
                .input('tipo_usuario', sql.VarChar(255), tipo_usuario)
                .query(`
                    INSERT INTO usuarios (nome, senha, tipo)
                    VALUES (@nome_usuario, @senha_usuario, @tipo_usuario)
                `);

            res.status(200).send('Usuário adicionado com sucesso!');
        }

    } catch (error) {
        console.error('Erro ao adicionar:', error);
        res.status(500).json({ message: error.message });
    }
});



// ROTA PARA ALTERAR SENHA DO USUÁRIO
router.post('/alterarsenha', async (req, res) => {
    const { nome, novaSenha } = req.body;

    if (!nome || !novaSenha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome e nova senha são obrigatórios' });
    }

    try {
        const pool = await poolPromise;

        // Verifica se o usuário existe
        const result = await pool.request()
            .input('nome', sql.VarChar(50), nome)
            .query('SELECT * FROM usuarios WHERE nome = @nome');

        if (result.recordset.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
        }

        // Atualiza a senha do usuário
        await pool.request()
            .input('nome', sql.VarChar(50), nome)
            .input('novaSenha', sql.VarChar(100), novaSenha)
            .query('UPDATE usuarios SET senha = @novaSenha WHERE nome = @nome');

        res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso!' });

    } catch (error) {
        console.error('Erro ao alterar a senha:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});


// ROTA PARA REGISTRAR PESQUISA DE MOVIMENTAÇÃO
router.post('/registropesquisa', async (req, res) => {
    const { nomeUsuario, barraDePesquisa} = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('nome', sql.VarChar(255), barraDePesquisa)
            .input('usuarioNome', sql.VarChar(255), nomeUsuario)
            .input('dataMovimentacao', sql.DateTime, new Date()) // Adiciona timestamp atual
            .query(`
                INSERT INTO registrosPesquisa (Pesquisa, UsuarioNome, DataMovimentacao)
                VALUES (@nome, @usuarioNome, @dataMovimentacao)
            `);

        res.status(200).send('registro feito!');

    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({ message: error.message });
    }
});

// exporta o roteador para ser usado no server.js
export default router;