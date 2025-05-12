//importa o Express para criar um conjunto de rotas
import express from 'express';

//importa o sql e o pollPromise do arquivo db.js
import {sql, poolPromise} from './db.js';

//cria um roteador(router) para agrupar as rotas do servidor
const router = express.Router();

//INSERIR ITEM NO BANCO
router.post('/inserir', async (req, res) => {
    const { nome, codigo, segmento, complemento, unidade, quantidade } = req.body;

    try {
        const pool = await poolPromise;

        // Verifica se já existe um item com o mesmo código
        const result = await pool.request()
            .input('codigo', sql.VarChar(20), codigo)
            .query('SELECT * FROM Itens WHERE Codigo = @codigo');

        if (result.recordset.length > 0) {
            // Já existe: atualiza a quantidade
            await pool.request()
                .input('codigo', sql.VarChar(20), codigo)
                .input('quantidade', sql.Int, quantidade)
                .query(`
                    UPDATE Itens 
                    SET Quantidade = Quantidade + @quantidade 
                    WHERE Codigo = @codigo
                `);

            //res.status(200).json({ message: 'Quantidade atualizada com sucesso!' });
            res.status(200).send('Quantidade atualizada com sucesso!');

        } else {
            // Não existe: faz o insert
            await pool.request()
                .input('codigo', sql.VarChar(20), codigo)
                .input('segmento', sql.VarChar(100), segmento)
                .input('nome', sql.VarChar(255), nome) // Descricao
                .input('complemento', sql.VarChar(255), complemento)
                .input('unidade', sql.VarChar(50), unidade)
                .input('quantidade', sql.Int, quantidade)
                .query(`
                    INSERT INTO Itens (Codigo, Segmento, Descricao, Complemento, Unidade, Quantidade)
                    VALUES (@codigo, @segmento, @nome, @complemento, @unidade, @quantidade)
                `);

            //res.status(201).json({ message: 'Item adicionado com sucesso!' });
            res.status(200).send('Item inserido com sucesso!');
        }

    } catch (error) {
        console.error('Erro ao inserir ou atualizar item:', error);
        res.status(500).json({ message: error.message });
    }
});



// ROTA GET PARA PUXAR OS ITENS DO BANCO PARA A PAGINA
router.get('/itens', async (req, res) => {
    try {
        const pool = await poolPromise;

        //faz a consulta no banco de dados
        const result = await pool.request().query('SELECT Codigo, nome, Segmento, Complemento, Quantidade, Unidade FROM Itens');

        //verifica se tem itens na resposta
        if (result.recordset.length > 0) {
            //envia como JSON
            res.json(result.recordset);
        } else {
            //dse não tiver itens, responde com um array vazio
            res.json([]);
        }
    } catch (error) {
        console.error('Erro ao consultar os itens:', error);
        res.status(500).json({ message: error.message });
    }
});


//exporta o roteador para ser usado no server.js
export default router;