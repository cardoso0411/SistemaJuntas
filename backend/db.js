const mysql = require('mysql2/promise');

let pool;

function getPool() {
    if (pool) return pool;

    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const port = Number(process.env.MYSQL_PORT || 3306);

    if (!user || password === undefined) {
        throw new Error('Configure as variáveis MYSQL_USER e MYSQL_PASSWORD.');
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('MYSQL_PORT deve ser um número entre 1 e 65535.');
    }

    pool = mysql.createPool({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port,
        database: process.env.MYSQL_DATABASE || 'sistema_juntas',
        user,
        password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
    });

    return pool;
}

async function closePool() {
    if (!pool) return;

    const currentPool = pool;
    pool = undefined;
    await currentPool.end();
}

module.exports = { getPool, closePool };
