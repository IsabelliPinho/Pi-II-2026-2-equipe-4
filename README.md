# Gabi Cake

Sistema de gestão de pedidos para a loja de bolos Gabi Cake, desenvolvido na disciplina de Projeto Integrador (UFC Crateús, 2026.2) pela Equipe 4.

O sistema permite à gerente da loja cadastrar clientes, registrar e acompanhar pedidos, controlar entregas e retiradas e consultar a agenda de encomendas.

> **Status:** Sprint 1 concluída (esqueleto em containers). Sprint 2 em andamento: o banco já tem as tabelas do MER e dados de teste, e as rotas `GET /listar/produtos` e `GET /clientes/busca` consultam o PostgreSQL. As demais rotas ainda usam dados fixos.

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
│   ├── src/main/java/com/gabicake/api/
│   │   ├── ApiApplication.java   # classe principal
│   │   ├── config/               # CORS
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/               # entidades JPA (tabelas do banco)
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/           # acesso ao banco (Spring Data)
│   │   ├── service/
│   │   └── store/                # dados fixos (mock) das rotas ainda não ligadas ao banco
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # Aplicação web (Node + nginx)
├── db/
│   ├── init/
│   │   ├── 01-schema.sql             # tabelas, chaves e restrições (a partir do MER)
│   │   ├── 02-seed.sql               # dados sintéticos para demonstração
│   │   ├── 03-indices.sql            # índices de busca
│   │   ├── 04-usuarios-perfis.sql    # tabelas de usuário e perfil; gerentes viram usuários
│   │   ├── 05-senha-hash-gerente.sql # senha de gerente aceita só hash BCrypt
│   │   └── 06-seed-usuarios.sql      # usuários de teste de todos os perfis
│   ├── rollback/                     # desfazem as migrations
│   ├── testes/                       # baterias de teste do banco (integridade, senhas, seed)
│   └── verificar.sql                 # consultas de conferência do banco
├── docs/                   # Requisitos, MER, contrato da API, casos de teste, guia de QA
├── docker-compose.yml      # Sobe banco, backend e frontend
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

O frontend é servido pelo nginx na porta 3000, e a API fica na porta 8080. O navegador chama a API diretamente em `http://localhost:8080`, e o backend libera essa origem (`localhost:3000`) por CORS, na classe `CorsConfig`.

## Endereços

| Serviço | Endereço |
|---|---|
| Saúde da API | http://localhost:8080/actuator/health |
| Banco de dados (cliente externo) | `localhost:5432` (usuário e senha do `.env`) |
| Frontend | http://localhost:3000 |
| Lista de produtos (vem do banco) | http://localhost:8080/listar/produtos |
| Busca de clientes (vem do banco) | http://localhost:8080/clientes/busca?busca=mar |

## Banco de dados

- O PostgreSQL cria o banco e o usuário na primeira inicialização, a partir das variáveis do `.env`.
- Os arquivos da pasta `db/init` são executados em ordem, **apenas na primeira inicialização**, quando o volume `db_data` está vazio: o `01-schema.sql` cria as tabelas (`cliente`, `gerente`, `produto`, `pedido` e `item_pedido`, com chaves primárias, estrangeiras e restrições) e o `02-seed.sql` insere os dados de teste (10 ou mais linhas por tabela). Os arquivos seguintes criam os índices (`03`), as tabelas de usuários e perfis (`04`), a trava de hash nas senhas de gerente (`05`) e os usuários de teste de todos os perfis (`06`, senha de demonstração `Senha@123`, gravada só como hash BCrypt).
- Os dados ficam no volume `db_data` e **persistem** entre `docker compose down` e `up`.
- O Hibernate está em modo `validate` (definido no `docker-compose.yml`): ele não cria nem altera tabelas, apenas confere se as entidades batem com o banco. Uma entidade com coluna ou tipo errado impede o backend de iniciar.
- O arquivo `db/verificar.sql` reúne consultas de conferência (contagens, junções e testes de integridade que devem falhar de propósito).

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
| Rodar as consultas de conferência | `docker compose exec -T db psql -U gabicake -d gabicake < db/verificar.sql` |

Se alterar os arquivos de `db/init` depois da primeira execução, use `docker compose down -v` para recriar o banco com o novo conteúdo.

## Rotas da API

| Rota | De onde vêm os dados |
|---|---|
| `GET /listar/produtos` | PostgreSQL |
| `GET /clientes/busca` | PostgreSQL (o banco guarda um telefone por cliente, e a resposta o devolve como lista de um item) |
| `POST /clientes/cadastro`, `/pedidos/...` | Dados fixos (em memória), ainda não ligados ao banco |

O contrato completo está em `docs/`.

## Documentação

A pasta [`docs/`](docs/) reúne o documento de requisitos, o relatório de análise de requisitos funcionais, o modelo entidade-relacionamento (`ER.drawio`), a definição do contrato da API, os casos de teste e o guia de QA (`GUIA-QA.md`), com o roteiro para subir o ambiente e verificar o sistema.

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