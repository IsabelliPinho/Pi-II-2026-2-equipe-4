# Matriz de Rastreabilidade — Gabi Cake

A Matriz de Rastreabilidade da Gabi Cake tem como objetivo organizar e acompanhar as relações entre os requisitos do sistema, os casos de uso, as telas, as rotas, as regras de negócio e as issues do projeto. Dessa forma, fica mais fácil verificar quais partes do sistema estão relacionadas e manter a documentação organizada durante o desenvolvimento.

## 1. Matriz de Rastreabilidade por Requisito

| Requisito Funcional | Casos de Uso | Telas | Rotas | Regras de Negócio | Issues |
|---|---|---|---|---|---|
| RF001 – Cadastro de clientes | UC001 | T003 | R001 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF002 – Busca de clientes | UC002 | T004, T005 | R002 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF003 – Registro e consulta de pedidos | UC003, UC004 | T006, T007, T008, T009, T010, T011 | R003, R004, R009, R010 | RN001, RN002, RN003 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF004 – Alteração e atualização de pedidos | UC005 | T011 | R005, R010 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF005 – Definição da forma de entrega ou retirada | UC006, UC003, UC005 | T006, T011 | R003, R005 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF006 – Organização da agenda | UC007 | — | R006, R010 | RN004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF007 – Acompanhamento de pedidos pendentes | UC008 | T012, T011 | R004, R005, R010 | RN004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF008 – Lembrete de pedidos próximos do prazo | UC009 | T013, T011 | R007, R010 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF009 – Cancelamento de pedidos | UC010 | T011 | R005, R010 | RN004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF010 – Acesso e utilização da planilha financeira | UC011 | — | R008 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF011 – Verificação do raio de entrega | UC012 | — | — | RN005 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |
| RF012 – Autenticação e controle de sessão | UC013 | T001, T002 | — | RN006 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/12) |

## 2. Matriz de Rastreabilidade por Caso de Uso

| Caso de Uso | Requisitos Funcionais | Telas | Rotas | Regras de Negócio | Issues |
|---|---|---|---|---|---|
| UC001 — Cadastrar cliente | RF001 | T003 | R001 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC002 — Buscar cliente | RF002 | T004, T005 | R002 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC003 — Registrar pedido | RF003, RF005 | T006, T007, T008, T009 | R002, R003, R009 | RN001, RN002, RN003 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC004 — Consultar pedidos | RF003 | T010 | R004 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC005 — Alterar pedido | RF004, RF005 | T011 | R005, R010 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC006 — Definir entrega ou retirada | RF005 | T006, T011 | R003, R005 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC007 — Consultar agenda | RF006 | — | R006, R010 | RN004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC008 — Acompanhar pedidos pendentes | RF007 | T012, T011 | R004, R005, R010 | RN004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC009 — Receber lembrete de pedido próximo do prazo | RF008 | T013, T011 | R007, R010 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC010 — Cancelar pedido | RF009 | T011 | R005, R010 | RN004, RA04 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC011 — Acessar planilha financeira | RF010 | — | R008 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC012 — Verificar raio de entrega | RF011 | — | — | RN005 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |
| UC013 – Realizar autenticação no sistema | RF012 | T001, T002 | — | RN006 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/14) |

## 3. Matriz de Rastreabilidade por Rota

| Tela | Método / Caminho | RF no Contrato | Casos de Uso | Telas | Issues |
|---|---|---|---|---|---|
| R001 – Cadastrar Cliente | POST /clientes/cadastro | RF001 | UC001 | T003 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R002 – Buscar clientes | GET /clientes/busca | RF002 | UC002 | T004, T005, T006 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R003 – Registrar Pedido | POST /pedidos/cadastro | RF003, RF005 | UC003, UC006 | T006, T007, T009 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R004 – Consultar Pedidos | GET /pedidos/consulta | RF003, RF007 | UC004, UC008 | T010, T012 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R005 – Atualizar Pedido | PATCH /pedidos/{id} | RF004, RF005, RF007, RF009 | UC005, UC006, UC008, UC010 | T011, T012 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R006 – Consultar Agenda | GET /agenda | RF006 | UC007 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R007 – Pedidos Próximos do Prazo | GET /lembretes/pedidos-proximos | RF008 | UC009 | T013 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R008 – Acesso à planilha financeira | GET /financeiro/acesso | RF010 | UC011 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R009 – Listar Produtos | GET /listar/produtos | RF003 | UC003 | T006 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |
| R010 – Consultar Pedido por ID | GET /pedidos/{id} | RF003, RF007 | UC005, UC007, UC008, UC009, UC010 | T011 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/16) |

## 4. Matriz de Rastreabilidade por Tela

| Rota | Requisitos Funcionais | Casos de Uso | Telas | Issues |
|---|---|---|---|---|
| T001 – Alertas | RF008 | UC009 | R007 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/65) |
| T002 – Cadastro | RF001 | UC001 | R001 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/70) |
| T003 – Carrinho | RF003 | UC003 | R003 | — |
| T004 – CarrinhoVazio | — | — | — | — |
| T005 – Clientes | RF002 | UC002 | R002 | — |
| T006 – ConsultarPedidos | RF003 | UC004 | R004 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/70) |
| T007 – DadosCliente | RF002, RF001 | UC002 | R002 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/70) |
| T008 – Dashboard | RF012 | UC013 | — | — |
| T009 – DetalhePedido | RF003, RF004, RF006, RF007, RF008, RF009 | UC005, UC007, UC008, UC009, UC010 | R005, R010 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/65) |
| T010 – Login | RF012 | UC013 | — | — |
| T011 – Pedido | RF003, RF005 | UC003, UC006 | R002, R003, R009 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/5) |
| T012 – PedidoRealizado | RF003 | — | R003 | — |
| T013 – Pendentes | RF007 | UC008 | R004, R005 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/65) |

## 5. Matriz de Rastreabilidade por Regra de Negócio

| Regra de Negócio | Requisitos Funcionais | Casos de Uso | Telas | Rotas | Issues |
|---|---|---|---|---|---|
| RN001 | RF003 | UC003 | T006, T007 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
| RN002 | RF003 | UC003 | T006 | R003 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
| RN003 | RF003 | UC003 | — | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
| RN004 | RF006, RF007, RF009 | UC008, UC007, UC010 | T012 | R004, R005, R006 | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
| RN005 | RF011 | UC012 | — | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
| RN006 | RF012 | UC013 | T001 | — | [Isseue](https://github.com/IsabelliPinho/Pi-II-2026-2-equipe-4/issues/30) |
