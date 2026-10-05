# Guia de QA: Sprint 1 (esqueleto em containers)

Este guia explica como subir o ambiente do Gabi Cake e como verificar que o esqueleto da Sprint 1 está funcional. Não é preciso saber programar: basta seguir os passos e comparar com o resultado esperado.

## 1. O que existe na Sprint 1

| Parte | O que faz | Como é acessada |
|---|---|---|
| Banco de dados (PostgreSQL) | Guarda os dados. Os dados persistem em um volume do Docker | `localhost:5432` |
| Backend (Spring Boot) | API. Nesta sprint só responde ao teste de saúde (`/actuator/health`) | `http://localhost:8080` |
| Frontend (web, nginx) | Interface web servida pelo nginx | `http://localhost:3000` |

**Fora do escopo desta verificação** (não reportar como bug): tabelas do negócio, rotas como `/clientes`, `/pedidos` e `/produtos` (que já existem com dados fixos, mas fazem parte da Sprint 2), consulta real ao banco e telas funcionais completas. A rota usada para validar o esqueleto é a de saúde (`/actuator/health`).

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

O ambiente está pronto quando o log do backend mostra `Started GabicakeApplication`.

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

Mantenha `BACKEND_PORT` em 8080 durante os testes: o frontend encaminha a API para essa porta.

## 5. Roteiro de testes

Execute na ordem. Marque cada caso como **Passou** ou **Falhou**.

| ID | Caso de teste | Passos | Resultado esperado |
|---|---|---|---|
| CT-01 | Ambiente sobe | `docker compose up --build` | Os 3 serviços iniciam sem erro. O log do backend mostra `Started GabicakeApplication` |
| CT-02 | Containers ativos | Em outro terminal: `docker compose ps` | `db`, `backend` e `frontend` com status `Up`; o `db` aparece como `healthy` |
| CT-03 | Saúde do backend | Abrir `http://localhost:8080/actuator/health` | `{"status":"UP"}` |
| CT-04 | Frontend abre | Abrir `http://localhost:3000` | A página inicial da aplicação carrega, sem tela em branco nem erro do nginx |
| CT-05 | Frontend e backend ao mesmo tempo | Com os 3 serviços no ar, abrir `http://localhost:3000` e `http://localhost:8080/actuator/health` em duas abas | As duas respondem (tela do frontend e `{"status":"UP"}`). A integração das telas com a API é da Sprint 2 |
| CT-06 | Banco foi criado | `docker compose exec db psql -U gabicake -d gabicake -c "\dt"` | O comando conecta sem erro. Nesta sprint não há tabelas de negócio: a mensagem `Did not find any relations.` é esperada |
| CT-07 | Persistência do volume | 1) `docker compose exec db psql -U gabicake -d gabicake -c "CREATE TABLE teste_volume (id int);"` 2) `docker compose down` 3) `docker compose up -d` 4) repetir o comando `\dt` do CT-06 | A tabela `teste_volume` continua listada. Depois, apague-a: `... -c "DROP TABLE teste_volume;"` |
| CT-08 | Variável obrigatória | Renomear o `.env` para `.env.bak` e rodar `docker compose up` | O Docker recusa subir e mostra a mensagem `Defina POSTGRES_DB no .env` (ou equivalente). Depois, devolver o nome do arquivo |
| CT-09 | `.env` não vai para o Git | `git check-ignore -v .env` | Mostra a regra `.gitignore:...:.env`. E `git status` não lista o `.env` |
| CT-10 | Reinício limpo | `docker compose down -v` e depois `docker compose up --build` | Sobe de novo do zero, sem erro (o `-v` apaga os dados do banco) |
| CT-11 | Rota inexistente | Abrir `http://localhost:8080/rota-que-nao-existe` | O backend responde com erro (404). Não deve travar nem derrubar o container |
| CT-12 | Porta ocupada | Com algo usando a porta 5432 no computador (por exemplo, um PostgreSQL instalado localmente), subir o ambiente | O Docker avisa que a porta está em uso. A solução é trocar `DB_HOST_PORT` no `.env` (por exemplo para `5433`) |

Os casos CT-01 a CT-07 e CT-09 são o núcleo da Sprint 1. Os demais cobrem falhas comuns.

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
| Mudei o `schema.sql` e nada mudou | O `schema.sql` só roda quando o volume está vazio | `docker compose down -v` e subir de novo |
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
