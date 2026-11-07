# VedaCore

VedaCore é um aplicativo desktop para cadastrar e consultar produtos de juntas automotivas. Ele permite listar, pesquisar, adicionar, editar e excluir produtos armazenados em um banco de dados MySQL. Também permite associar imagens aos produtos.

## Tecnologias

- **Electron 28** cria a janela desktop e executa a aplicação.
- **Node.js e JavaScript** implementam a lógica da aplicação.
- **Vue 3** atualiza a interface e exibe os produtos.
- **HTML e CSS** definem a estrutura e a aparência das telas.
- **Bootstrap 5** fornece componentes e estilos visuais.
- **MySQL** armazena os produtos.
- **mysql2** conecta o Node.js ao MySQL.
- **electron-builder** gera o instalador para Windows.

O projeto usa Vue 3 e Bootstrap são carregados de um CDN, portanto a aplicação precisa de internet para carregar esses recursos.

## Requisitos

Antes de executar, instale:

1. **Node.js**, que inclui o npm.
2. **MySQL Server**, iniciado e acessível pelo computador.
3. Um banco MySQL com a tabela `produtos`.

O usuário MySQL da aplicação precisa ter permissão para consultar, inserir, atualizar e excluir registros da tabela.

## Banco de dados

O projeto usa o banco `sistema_juntas` por padrão e espera uma tabela `produtos` com estas colunas:

| Coluna | Uso |
| --- | --- |
| `id` | Identificador do produto |
| `codigo` | Código único do produto |
| `nome` | Nome exibido na lista |
| `medidas` | Medidas do produto |
| `imagem` | Caminho ou endereço do arquivo de imagem |
| `ativo` | A listagem e a pesquisa exibem registros com valor `1` |

O código verifica códigos duplicados durante o cadastro e a edição. Também é recomendado que `codigo` tenha uma restrição `UNIQUE` no MySQL.

## Configurar a conexão

Abra o PowerShell na pasta do projeto. Informe a conexão com o MySQL usando variáveis de ambiente. Substitua o usuário e a senha pelos dados da sua instalação:

```powershell
$env:MYSQL_HOST = "127.0.0.1"
$env:MYSQL_PORT = "3306"
$env:MYSQL_DATABASE = "sistema_juntas"
$env:MYSQL_USER = "seu_usuario"
$env:MYSQL_PASSWORD = "sua_senha"
```

`MYSQL_HOST`, `MYSQL_PORT` e `MYSQL_DATABASE` são opcionais se o MySQL estiver no computador local, na porta padrão e usando o banco `sistema_juntas`. `MYSQL_USER` e `MYSQL_PASSWORD` são obrigatórias.

Essas variáveis ficam definidas apenas na janela atual do PowerShell. Se abrir outra janela, configure-as novamente. Não grave senhas reais no código nem envie arquivos com credenciais ao repositório.

## Executar em modo de desenvolvimento

No PowerShell:

```powershell
cd caminho\para\SistemaJuntas
npm install
$env:MYSQL_HOST = "127.0.0.1"
$env:MYSQL_PORT = "3306"
$env:MYSQL_DATABASE = "sistema_juntas"
$env:MYSQL_USER = "seu_usuario"
$env:MYSQL_PASSWORD = "sua_senha"
npm start
```

O aplicativo testa a conexão com o MySQL ao iniciar. Se a conexão falhar, confira se o MySQL está rodando, se as variáveis estão corretas e se o usuário tem acesso ao banco.

## Gerar o instalador para Windows

Com as dependências instaladas, execute:

```powershell
npm run build
```

O instalador e os arquivos gerados ficam na pasta `dist/`. Essa pasta é criada pelo processo de build e não precisa ser enviada ao repositório.

## Imagens dos produtos

As imagens selecionadas no aplicativo são copiadas para a pasta de dados do usuário do Electron, em uma subpasta chamada `imagens`. O caminho da imagem é armazenado na coluna `imagem` do registro do produto.

## Estrutura principal

```text
backend/
  db.js           Configuração do pool de conexões MySQL
  produtoDAO.js   Consultas e operações da tabela produtos
renderer/
  index.html      Estrutura da interface
  renderer.js     Interações da interface com o Electron
  style.css       Estilos da aplicação
main.js           Processo principal do Electron e manipuladores IPC
package.json      Dependências e comandos do projeto
```