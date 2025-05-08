//importa o módulo express, framework para criar servidores http no Node.js
import express from 'express'

import cors from 'cors';

//importa o conjunto de rotas criadas em routes.js
import apiRoutes from './routes.js'

//inicializa a aplicação express
const app = express()

//define a porta em que o servidor vai executar as requisições http
const PORT = 5000

app.use(cors());

//middleware para permitir que o servidor interprete as requisições com o formato JSON
app.use(express.json())

//define que todas as rotas que chegarem no servidor vão ser direcionadas para as rotas importadas
app.use('/', apiRoutes);

//inicializa o servidor e faz com que ele comece a eescutar as requisições na porta selecionada
app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`)
})