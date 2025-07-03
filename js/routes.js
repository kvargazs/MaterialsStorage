// importa o Express para criar um conjunto de rotas
import express from 'express';

// importa o sql e o poolPromise do arquivo db.js
import { sql, poolPromise } from './db.js';

// cria um roteador (router) para agrupar as rotas do servidor
const router = express.Router();

//ROTA PARA INSERIR ITEM
router.post('/inserir', async (req, res) => {
    const { nome, codigo, segmento, complemento, unidade, quantidade } = req.body;

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

            res.status(200).send('Item inserido com sucesso!');
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
            res.json({ sucesso: true, usuario: result.recordset[0] });
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

    res.status(200).json({ message: 'Item excluído com sucesso!' });

  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ message: error.message });
  }
});





// ROTA PARA EDITAR ITEM COMPLETO PELO CÓDIGO
router.put('/itens/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome, complemento, quantidade, unidade, segmento } = req.body;

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


// exporta o roteador para ser usado no server.js
export default router;
