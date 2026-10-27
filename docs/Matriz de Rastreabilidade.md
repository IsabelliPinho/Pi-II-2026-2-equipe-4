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

## 3. Matriz de Rastreabilidade por Tela

| Tela | Requisitos Funcionais | Casos de Uso | Rotas | Regras de Negócio | Issues |
|---|---|---|---|---|---|
| |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## 4. Matriz de Rastreabilidade por Rota

| Rota | Requisitos Funcionais | Casos de Uso | Telas | Regras de Negócio | Issues |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## 5. Matriz de Rastreabilidade por Regra de Negócio

| Regra de Negócio | Requisitos Funcionais | Casos de Uso | Telas | Rotas | Issues |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
