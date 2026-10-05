# Gabi Cake

Sistema de gestão de pedidos para a loja de bolos Gabi Cake, desenvolvido na disciplina de Projeto Integrador (UFC Crateús, 2026.2) pela Equipe 4.

O sistema permite à gerente da loja cadastrar clientes, registrar e acompanhar pedidos, controlar entregas e retiradas e consultar a agenda de encomendas.

> **Status:** Sprint 1 (esqueleto em containers). O backend e o banco sobem com um comando. Tabelas, rotas e integração com o frontend entram na Sprint 2.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 25, Spring Boot, Hibernate (JPA) |
| Banco de dados | PostgreSQL 16 |
| Frontend | Aplicação web (Node.js no build, servida por nginx) |
| Infraestrutura | Docker e Docker Compose |

## Estrutura do repositório

```
.
├── backend/                # API Spring Boot
│   ├── src/main/java/gabicake/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── model/
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # Aplicação web (Node + nginx)
├── docs/                   # Requisitos, MER, contrato da API, casos de teste
├── docker-compose.yml      # Sobe banco, backend e frontend
├── schema.sql              # Criação das tabelas (provisório até a Sprint 2)
├── .env.example            # Modelo das variáveis de ambiente
└── README.md
```

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **aberto** (inclui o Docker Compose)
- [Git](https://git-scm.com/)

Não é necessário instalar Java, Maven nem PostgreSQL: tudo roda dentro dos containers.

## Como rodar

**1. Clone o repositório**

```bash
git clone https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4.git
cd Pi-II-2026-2-equipe-4
```

**2. Crie o arquivo `.env`**

```bash
cp .env.example .env
```

Abra o `.env` e troque o valor de `POSTGRES_PASSWORD` por uma senha própria. O `.env` nunca vai para o Git (está no `.gitignore`).

**3. Suba os serviços**

```bash
docker compose up --build db backend
```

Para subir também o frontend, use `docker compose up --build` (sem listar serviços).

A primeira execução demora alguns minutos, porque baixa as imagens e as dependências do Maven.

**4. Confira se funcionou**

Abra no navegador:

```
http://localhost:8080/actuator/health
```

A resposta esperada é `{"status":"UP"}`. Esse resultado indica que o backend está de pé e conectado ao banco.

## Variáveis de ambiente

Definidas no arquivo `.env` (modelo em `.env.example`):

| Variável | O que faz | Valor padrão |
|---|---|---|
| `APP_TZ` | Fuso horário usado por banco, backend e frontend. Evita horários deslocados na agenda | `America/Fortaleza` |
| `POSTGRES_DB` | Nome do banco de dados | `gabicake` |
| `POSTGRES_USER` | Usuário do banco (o backend usa o mesmo) | `gabicake` |
| `POSTGRES_PASSWORD` | Senha do banco. **Obrigatória**: troque o valor de exemplo | `troque_esta_senha` |
| `DB_HOST_PORT` | Porta do seu computador para acessar o banco (DBeaver, pgAdmin, psql) | `5432` |
| `BACKEND_PORT` | Porta da API | `8080` |
| `FRONTEND_PORT` | Porta para acessar o frontend no navegador | `3000` |

O `docker-compose.yml` repassa ao backend os dados de conexão como `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`, que o Spring Boot reconhece automaticamente. Dentro do Docker, o backend acessa o banco pelo nome do serviço (`db`), e não por `localhost`.

O frontend chama a API pelo caminho `/api/`, e o nginx encaminha essas requisições para o serviço `backend`. Por isso o navegador só conversa com um endereço e não é preciso configurar CORS.

## Endereços

| Serviço | Endereço |
|---|---|
| Saúde da API | http://localhost:8080/actuator/health |
| Banco de dados (cliente externo) | `localhost:5432` (usuário e senha do `.env`) |
| Frontend | http://localhost:3000 |
| API pelo frontend (proxy do nginx) | http://localhost:3000/api/ |

## Banco de dados

- O PostgreSQL cria o banco e o usuário na primeira inicialização, a partir das variáveis do `.env`.
- O arquivo `schema.sql` é executado **apenas na primeira inicialização**, quando o volume `db_data` está vazio.
- Os dados ficam no volume `db_data` e **persistem** entre `docker compose down` e `up`.
- O Hibernate está em modo `validate`: ele não cria nem altera tabelas, apenas confere se as entidades batem com o `schema.sql`.

## Comandos úteis

| O que fazer | Comando |
|---|---|
| Subir em segundo plano | `docker compose up -d db backend` |
| Ver o que está rodando | `docker compose ps` |
| Ver os logs do backend | `docker compose logs -f backend` |
| Parar os containers (mantém os dados) | `docker compose down` |
| Parar e **apagar os dados do banco** | `docker compose down -v` |
| Recompilar o backend | `docker compose up --build backend` |
| Listar as tabelas do banco | `docker compose exec db psql -U gabicake -d gabicake -c "\dt"` |

Se alterar o `schema.sql` depois da primeira execução, use `docker compose down -v` para recriar o banco com o novo conteúdo.

## Documentação

A pasta [`docs/`](docs/) reúne o documento de requisitos, o relatório de análise de requisitos funcionais, o modelo entidade-relacionamento (`ER.drawio`), a definição do contrato da API e os casos de teste.

## Como contribuir

1. Atualize a `main`: `git checkout main && git pull origin main`
2. Crie uma branch a partir dela: `git checkout -b feature/nome-da-tarefa`
3. Faça commits pequenos, seguindo o padrão `tipo(escopo): descrição` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`)
4. Envie a branch: `git push -u origin feature/nome-da-tarefa`
5. Abra um Pull Request para a `main` e peça revisão de alguém da equipe

Não faça push direto na `main` e nunca commite o `.env`.

## Equipe

Equipe 4, Projeto Integrador II, UFC Crateús.

<!-- Preencher com os nomes dos integrantes e seus papéis -->
