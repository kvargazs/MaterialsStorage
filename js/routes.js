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


// exporta o roteador para ser usado no server.js
export default router;
