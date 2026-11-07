const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const produtoDAO = require('./backend/produtoDAO');
const db = require('./backend/db');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        title: "VedaCore - Sistema de Gestão de Juntas",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('renderer/index.html');
}

app.whenReady().then(async () => {
    try {
        await db.getPool().query('SELECT 1');
        createWindow();
    } catch (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        dialog.showErrorBox(
            'Falha ao conectar ao MySQL',
            `Verifique as variáveis MYSQL_* e se o banco está disponível.\n\n${err.message}`
        );
        app.quit();
    }
});

app.on('before-quit', () => {
    db.closePool().catch((err) => {
        console.error('Erro ao encerrar a conexão com MySQL:', err);
    });
});

exports.appVersion = app.getVersion();

// Expõe versão da aplicação via IPC
ipcMain.handle('get-version', async () => {
  return app.getVersion();
});

// IPC para listar produtos
ipcMain.handle('listar-produtos', () => produtoDAO.listarTodos());

// IPC para buscar
ipcMain.handle('buscar-produtos', (event, termo) => {
    if (typeof termo !== 'string') {
        throw new TypeError('O termo de busca precisa ser texto.');
    }
    return produtoDAO.buscarPorTermo(termo);
});

ipcMain.handle('adicionar-produto', (event, produto) => produtoDAO.adicionar(produto));

ipcMain.handle('editar-produto', (event, produto) => produtoDAO.editar(produto));

ipcMain.handle('deletar-produto', (event, id) => produtoDAO.deletar(id));

ipcMain.handle("salvar-imagem", async (event, payload) => {
  const ext = path.extname(payload.name || "").toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    throw new Error("EXTENSAO_INVALIDA");
  }

  const imagensDir = path.join(app.getPath("userData"), "imagens");
  if (!fs.existsSync(imagensDir)) fs.mkdirSync(imagensDir, { recursive: true });

  const fileName = `${Date.now()}${ext}`;
  const destPath = path.join(imagensDir, fileName);
  const buffer = Buffer.from(payload.data || []);
  fs.writeFileSync(destPath, buffer);

  return `file:///${destPath.replace(/\\/g, "/")}`;
});