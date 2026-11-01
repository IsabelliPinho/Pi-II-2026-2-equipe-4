# Guia de QA: ambiente em containers e rotas ligadas ao banco

Este guia explica como subir o ambiente do Gabi Cake e como verificar que o esqueleto está funcional e que as rotas ligadas ao banco respondem com os dados dele. Não é preciso saber programar: basta seguir os passos e comparar com o resultado esperado.

## 1. O que existe

| Parte | O que faz | Como é acessada |
|---|---|---|
| Banco de dados (PostgreSQL) | 8 tabelas (as 5 do MER: `cliente`, `gerente`, `produto`, `pedido`, `item_pedido`; e as de acesso: `perfil`, `usuario`, `usuario_perfil`) com dados de teste, incluindo usuários de todos os perfis, criadas na primeira inicialização. Os dados persistem em um volume do Docker | `localhost:5432` |
| Backend (Spring Boot) | API. As rotas `GET /listar/produtos` e `GET /clientes/busca` consultam o banco. As demais rotas usam dados fixos | `http://localhost:8080` |
| Frontend (web, nginx) | Interface web servida pelo nginx | `http://localhost:3000` |

**Fora do escopo desta verificação** (não reportar como bug): as rotas de cadastro de cliente e de pedidos (`/clientes/cadastro` e `/pedidos/...`) ainda usam dados fixos em memória, e o que elas gravam some ao reiniciar o backend. O banco guarda um telefone por cliente, e a busca o devolve como uma lista de um item.

## 2. Pré-requisitos

- Docker Desktop instalado e **aberto** (o ícone da baleia deve estar ativo)
- Git
- Portas livres no computador: **3000**, **8080** e **5432**

## 3. Preparar e subir o ambiente

```bash
git clone https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4.git
cd Pi-II-2026-2-equipe-4
git checkout main
cp .env.example .env
```

Abra o arquivo `.env` e troque `POSTGRES_PASSWORD` por uma senha qualquer. Depois:

```bash
docker compose up --build
```

- A primeira execução demora alguns minutos (baixa imagens e dependências).
- O terminal fica "preso" mostrando os logs. Isso é normal. Para parar: `Ctrl + C`.
- Para rodar em segundo plano, use `docker compose up --build -d`.

O ambiente está pronto quando o log do backend mostra `Started ApiApplication`. Os arquivos de `db/init` só rodam quando o volume do banco está vazio (primeira subida, ou depois de `docker compose down -v`).

## 4. Variáveis de ambiente (arquivo `.env`)

| Variável | Para que serve | Valor padrão |
|---|---|---|
| `APP_TZ` | Fuso horário de banco, backend e frontend | `America/Fortaleza` |
| `POSTGRES_DB` | Nome do banco | `gabicake` |
| `POSTGRES_USER` | Usuário do banco | `gabicake` |
| `POSTGRES_PASSWORD` | Senha do banco (obrigatória) | `troque_esta_senha` |
| `DB_HOST_PORT` | Porta do computador para acessar o banco | `5432` |
| `BACKEND_PORT` | Porta da API | `8080` |
| `FRONTEND_PORT` | Porta do frontend no navegador | `3000` |

Mantenha `BACKEND_PORT` em 8080 durante os testes: o frontend chama a API em `http://localhost:8080`.

## 5. Roteiro de testes

Execute na ordem. Marque cada caso como **Passou** ou **Falhou**.

| ID | Caso de teste | Passos | Resultado esperado |
|---|---|---|---|
| CT-01 | Ambiente sobe | `docker compose up --build` | Os 3 serviços iniciam sem erro. O log do backend mostra `Started ApiApplication` |
| CT-02 | Containers ativos | Em outro terminal: `docker compose ps` | `db`, `backend` e `frontend` com status `Up`; o `db` aparece como `healthy` |
| CT-03 | Saúde do backend | Abrir `http://localhost:8080/actuator/health` | `{"status":"UP"}` |
| CT-04 | Frontend abre | Abrir `http://localhost:3000` | A página inicial da aplicação carrega, sem tela em branco nem erro do nginx |
| CT-05 | Frontend chama o backend | Abrir `http://localhost:3000` (tela "Faça seu Pedido") com o `F12` aberto na aba **Network** e recarregar | Aparece a requisição `produtos` com status `200`, e o campo **Produto** é preenchido com a lista. Nenhum erro de CORS no **Console** |
| CT-06 | Banco foi criado | `docker compose exec db psql -U gabicake -d gabicake -c "\dt"` | Lista 8 tabelas: `cliente`, `gerente`, `item_pedido`, `pedido`, `perfil`, `produto`, `usuario` e `usuario_perfil` |
| CT-07 | Persistência do volume | 1) `docker compose exec db psql -U gabicake -d gabicake -c "CREATE TABLE teste_volume (id int);"` 2) `docker compose down` 3) `docker compose up -d` 4) repetir o comando `\dt` do CT-06 | A tabela `teste_volume` continua listada. Depois, apague-a: `... -c "DROP TABLE teste_volume;"` |
| CT-08 | Variável obrigatória | Renomear o `.env` para `.env.bak` e rodar `docker compose up` | O Docker recusa subir e mostra a mensagem `Defina POSTGRES_DB no .env` (ou equivalente). Depois, devolver o nome do arquivo |
| CT-09 | `.env` não vai para o Git | `git check-ignore -v .env` | Mostra a regra `.gitignore:...:.env`. E `git status` não lista o `.env` |
| CT-10 | Reinício limpo | `docker compose down -v` e depois `docker compose up --build` | Sobe de novo do zero, sem erro (o `-v` apaga os dados do banco) |
| CT-11 | Rota inexistente | Abrir `http://localhost:8080/rota-que-nao-existe` | O backend responde com erro (404). Não deve travar nem derrubar o container |
| CT-13 | Seed e integridade do banco | `docker compose exec -T db psql -U gabicake -d gabicake < db/verificar.sql` | As contagens mostram 10 ou mais linhas nas tabelas de dados (cliente 12, gerente 10, produto 12, pedido 15, item_pedido 26) e as de acesso (perfil 2, usuario 13, usuario_perfil 13). Logo abaixo aparece a lista dos usuários de teste por perfil. No bloco de testes de integridade, as linhas `ERROR` são **esperadas**: o banco recusa de propósito dados inválidos (chave estrangeira, `CHECK`, `UNIQUE`) |
| CT-14 | Produtos vêm do banco | `curl http://localhost:8080/listar/produtos` | Lista JSON com 12 produtos, ids de 1 a 12 (`id`, `nome`, `preco`) |
| CT-15 | Busca de clientes | `curl "http://localhost:8080/clientes/busca"` e depois `curl "http://localhost:8080/clientes/busca?busca=mar"` | A primeira devolve os 12 clientes, cada um com `telefones` como lista de um item. A segunda devolve só Mariana Souza, Marcos Vinícius Rocha e Sabrina Martins |
| CT-16 | Busca curta demais | `curl "http://localhost:8080/clientes/busca?busca=ab"` | `{"error":"VALIDATION_ERROR","message":"A busca deve possuir pelo menos 3 caracteres."}` |
| CT-17 | Os dados vêm mesmo do banco | 1) anotar o nome do produto 1: `docker compose exec db psql -U gabicake -d gabicake -c "SELECT nome FROM produto WHERE id = 1;"` 2) `docker compose exec db psql -U gabicake -d gabicake -c "UPDATE produto SET nome = 'TESTE BANCO' WHERE id = 1;"` 3) recarregar a tela "Faça seu Pedido" | O primeiro item da lista de produtos passa a se chamar `TESTE BANCO`. **Depois, devolver o nome anotado** com outro `UPDATE` |
| CT-18 | Tela de clientes | Abrir a tela de clientes no frontend e fazer uma busca com 3 ou mais letras | A requisição `clientes/busca?busca=...` retorna `200`, e a lista mostra os clientes do banco |
| CT-19 | Banco recusa dado inválido | `docker compose exec db psql -U gabicake -d gabicake -c "INSERT INTO produto (nome, preco) VALUES ('Teste', -1);"` | Erro `violates check constraint "ck_produto_preco"`, e nada é gravado |
| CT-12 | Porta ocupada | Com algo usando a porta 5432 no computador (por exemplo, um PostgreSQL instalado localmente), subir o ambiente | O Docker avisa que a porta está em uso. A solução é trocar `DB_HOST_PORT` no `.env` (por exemplo para `5433`) |
| CT-20 | Usuários de teste de todos os perfis | `docker compose exec db psql -U gabicake -d gabicake -c "SELECT p.nome AS perfil, u.login, u.ativo FROM usuario u JOIN usuario_perfil up ON up.usuario_id = u.id JOIN perfil p ON p.id = up.perfil_id ORDER BY p.nome, u.id;"` | 13 linhas: 10 do perfil `GERENTE` (todos ativos, o primeiro é `gabriela.almeida`) e 3 do perfil `FUNCIONARIO` (`marina.costa` e `paulo.ribeiro` ativos, `renata.dias` inativa) |
| CT-21 | Senhas só em hash | `docker compose exec db psql -U gabicake -d gabicake -c "SELECT login, left(senha_hash, 7) AS inicio, length(senha_hash) AS tamanho FROM usuario ORDER BY id;"` | Todas as linhas mostram `$2a$10$` no início e tamanho `60`. Nenhuma senha aparece em texto puro |
| CT-22 | Seed de usuários e dados | `docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 < db/testes/testes-seed-usuarios.sql` | O resumo mostra 13 linhas `PASSOU` e nenhuma `FALHOU` |

Os casos CT-01 a CT-07, CT-09, CT-13 a CT-17 e CT-20 a CT-22 são o núcleo. Os demais cobrem falhas comuns.

### Usuários de teste

Todos usam a senha de demonstração `Senha@123`, que fica gravada no banco apenas como hash. São credenciais públicas e servem **só para teste**.

| Perfil | Login | Situação | Para que serve |
|---|---|---|---|
| Gerente | `gabriela.almeida` | ativa | Login de gerente. Os outros 9 gerentes, de `rafael.monteiro` a `henrique.lima`, funcionam do mesmo jeito |
| Funcionário | `marina.costa` | ativa | Login de funcionário |
| Funcionário | `paulo.ribeiro` | ativo | Segundo funcionário, para testes com dois usuários |
| Funcionário | `renata.dias` | **inativa** | O login deve ser **recusado** ("Dados de acesso inválidos."), mesmo com a senha certa |

É com estes usuários que os casos de autenticação (como o CT-001 do plano de testes) devem ser executados quando a rota de login estiver disponível no backend. O perfil "Sem login" da Matriz de Autorização não é um usuário: representa quem ainda não se autenticou.
## 6. Comandos úteis para o teste

| O que fazer | Comando |
|---|---|
| Ver os containers | `docker compose ps` |
| Ver os logs de um serviço | `docker compose logs backend` (ou `db`, `frontend`) |
| Acompanhar os logs em tempo real | `docker compose logs -f backend` |
| Parar mantendo os dados | `docker compose down` |
| Parar e apagar os dados do banco | `docker compose down -v` |
| Recompilar após mudança no código | `docker compose up --build` |

## 7. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop fechado | Abrir o Docker Desktop e aguardar iniciar |
| `port is already allocated` | Porta em uso por outro programa | Trocar a porta no `.env` ou fechar o programa que a usa |
| `curl` ou navegador não conecta em `localhost:8080` | Backend ainda iniciando, ou parado | Aguardar cerca de 10 segundos; conferir com `docker compose ps` e `docker compose logs backend` |
| O backend reinicia ou sai logo após subir | Banco ainda não estava pronto, ou senha diferente da usada na primeira inicialização | Ver `docker compose logs backend`. Se mudou a senha depois de criar o banco, usar `docker compose down -v` |
| Mudei um arquivo de `db/init` e nada mudou | Esses arquivos só rodam quando o volume do banco está vazio | `docker compose down -v` e subir de novo |
| O banco sobe sem tabelas | O volume já existia de uma versão antiga | `docker compose down -v` e subir de novo |
| O backend reinicia sem parar, com `Schema-validation` no log | Uma entidade não bate com a tabela (coluna ou tipo diferente) | Ver `docker compose logs backend`, que indica a coluna, e avisar a equipe do backend |
| A tela abre, mas a lista fica vazia e o **Console** mostra erro de CORS | O backend não libera a origem do frontend | Conferir que o frontend está em `http://localhost:3000` e reconstruir com `docker compose up -d --build` |
| `localhost:3000` recusa a conexão com o ambiente no ar | `.env` antigo com `FRONTEND_PORT=6080` | Trocar para `FRONTEND_PORT=3000` no `.env` e rodar `docker compose up -d`; confirmar a porta com `docker compose ps` |
| Página em branco em `localhost:3000` | Build do frontend com erro | `docker compose logs frontend` e `docker compose up --build` |

## 8. Como reportar um defeito

Abra uma **Issue** no GitHub com:

1. **Título curto:** o que falhou (exemplo: "CT-03: /actuator/health não responde").
2. **Caso de teste** (ID) e **passos para reproduzir**.
3. **Resultado esperado** e **resultado obtido**.
4. **Evidência:** print da tela ou o trecho do log (`docker compose logs <serviço>`).
5. **Ambiente:** sistema operacional e versão do Docker (`docker --version`).
6. **Label:** `bug` (e `backend`, `frontend` ou `infra`, se souber).

Nunca cole o conteúdo do `.env` em uma Issue: ele contém a senha do banco.