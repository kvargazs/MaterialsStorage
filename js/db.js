// importa biblioteca mssql
import sql from 'mssql'


const config = {
    user: 'fellipe',  //usuário do sql
    password: '123456',  //senha do usuário do sql
    server: 'DESKTOP-HOPVEQ1\\TEW_SQLEXPRESS',  //nome ou ip do servidor sql
    database: 'Storage', //nome do banco de dados
    options: {
        encrypt: true,  //define se a conexão será criptografada
        trustServerCertificate: true //permite confiar no certificado ssl mesmo que seja autoassiando
    }
};

// poolPromise que representa uma conexão comm o banco já estabelecida ou em processo de estabelecimento
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado ao SQL Server')
        return pool; //retorna a conexão para ser usada nas rotas de APIS
    })
    .catch(err => {
        console.error('Erro na conexão com o SQL Server: ', err.message)
    });


//exportar o objeto SQL (com funções utilitátias) e o poolPromise (conexão pronta)
export {sql, poolPromise};