const sql = require('mssql');

// config da conexão
const config = {
    user: 'fellipe',
    password: '123456',
    server: 'DESKTOP-HOPVEQ1\\TEW_SQLEXPRESS',
    database: 'Storage',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

var nome = ""
var codigo = ""
var segmento = ""
var complemento = ""
var unidade = ""
var quantidade = ""

function EnviarItem() {
    nome = document.getElementById('input_nome').value
    codigo = document.getElementById('input_codigo').value
    segmento = document.getElementById('input_segmento').value
    complemento = document.getElementById('input_complemento').value
    unidade = document.getElementById('input_unidade').value
    quantidade = document.getElementById('input_quantidade').value
    console.log(nome, codigo, segmento, complemento, unidade, quantidade);
}

const enviarSQL = 'INSERT INTO Itens (nome, codigo, segmento, complemento, unidade, quantidade) VALUES ('+nome+','+codigo+','+segmento+','+complemento+','+unidade+','+quantidade+');'

async function inserirTabelaAlunos(){

    try{
        // conecta com o banco de dados
        await sql.connect(config)

        // executa o select
        const resultado = await sql.query(enviarSQL)

        // resultado da consulta no terminal
        console.table(resultado.recordset);
    }catch(err){
        console.error('Erro ao enviar pra tabela: ', err)
    }finally{
        sql.close();
    }
}
inserirTabelaAlunos()