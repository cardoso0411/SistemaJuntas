const { getPool } = require('./db');

class ProdutoDAO {
    async validarCodigoDisponivel(codigo, idAtual) {
        const sql = idAtual === undefined
            ? 'SELECT id FROM produtos WHERE codigo = ? LIMIT 1'
            : 'SELECT id FROM produtos WHERE codigo = ? AND id <> ? LIMIT 1';
        const params = idAtual === undefined ? [codigo] : [codigo, idAtual];
        const [rows] = await getPool().execute(sql, params);

        if (rows.length > 0) {
            throw new Error('CODIGO_DUPLICADO');
        }
    }

    async listarTodos() {
        const [rows] = await getPool().execute(
            'SELECT * FROM produtos WHERE ativo = 1 ORDER BY nome'
        );
        return rows;
    }

    async buscarPorTermo(termo) {
        const busca = `%${termo}%`;
        const [rows] = await getPool().execute(
            `SELECT * FROM produtos
             WHERE ativo = 1 AND (codigo LIKE ? OR nome LIKE ?)
             ORDER BY nome`,
            [busca, busca]
        );
        return rows;
    }

    async adicionar(produto) {
        try {
            await this.validarCodigoDisponivel(produto.codigo);
            const [result] = await getPool().execute(
                'INSERT INTO produtos (nome, codigo, medidas, imagem) VALUES (?, ?, ?, ?)',
                [produto.nome, produto.codigo, produto.medidas, produto.imagem]
            );
            return { id: result.insertId };
        } catch (err) {
            if (err && err.code === 'ER_DUP_ENTRY') {
                throw new Error('CODIGO_DUPLICADO');
            }
            throw err;
        }
    }

    async editar(produto) {
        try {
            await this.validarCodigoDisponivel(produto.codigo, produto.id);
            await getPool().execute(
                'UPDATE produtos SET nome = ?, codigo = ?, medidas = ?, imagem = ? WHERE id = ?',
                [produto.nome, produto.codigo, produto.medidas, produto.imagem, produto.id]
            );
        } catch (err) {
            if (err && err.code === 'ER_DUP_ENTRY') {
                throw new Error('CODIGO_DUPLICADO');
            }
            throw err;
        }
    }

    async deletar(id) {
        await getPool().execute('DELETE FROM produtos WHERE id = ?', [id]);
    }
}

module.exports = new ProdutoDAO();
