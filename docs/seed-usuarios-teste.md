# Seed de usuários de teste e massa de dados – Gabi Cake

Projeto Integrador II 2026/2 – Equipe 4
Banco de dados: PostgreSQL 16
Arquivos relacionados: `db/init/06-seed-usuarios.sql`, `db/testes/testes-seed-usuarios.sql` e `docs/evidencias/resultado-testes-seed-usuarios.txt`

## 1. O que faltava

Depois da migration 04, o banco passou a ter os perfis `GERENTE` e `FUNCIONARIO`, mas só o primeiro tinha usuários: os 10 gerentes do seed foram migrados para a tabela `usuario`, e o perfil de funcionário estava vazio. Para a equipe de QA testar login e permissões, e para a avaliação do projeto, o ambiente precisa subir com ao menos um usuário válido de cada perfil. Também faz falta um usuário **inativo**, porque é ele que prova que o sistema recusa o acesso de quem foi desligado. O relatório de QA já registrou que o protótipo "entra mesmo sem credenciais", então ter credenciais válidas e inválidas à mão é o que permite comprovar isso.

## 2. O que fizemos

Criamos o arquivo `db/init/06-seed-usuarios.sql`. Ele é separado do `02-seed.sql` por uma questão de ordem: o Docker executa os arquivos de `db/init` em sequência, e o `02` roda antes de as tabelas `usuario` e `perfil` existirem (elas nascem no `04`), então os usuários só podem ser criados depois. A sequência completa ficou assim: `01` cria as tabelas, `02` insere a massa de dados, `03` cria os índices, `04` cria usuários e perfis (e migra os gerentes), `05` garante o hash nas senhas de gerente e `06` cria os usuários de teste.

O script cria três funcionários e deixa tudo pronto para o teste. Os usuários do perfil `GERENTE` não são criados por ele: já vêm da migração do `04`, que transforma cada gerente do seed em um usuário (`gabriela.almeida`, `rafael.monteiro` e assim por diante). As senhas são gravadas somente como hash BCrypt, gerado pelo próprio PostgreSQL (`pgcrypto`, custo 10), no mesmo formato que o `BCryptPasswordEncoder` do Spring entende. Cada usuário recebe o seu próprio salt, então mesmo com a senha igual os hashes são todos diferentes.

## 3. Usuários de teste

Todos usam a senha de demonstração `Senha@123`.

| Perfil | Login | Situação | Para que serve |
|---|---|---|---|
| Gerente | `gabriela.almeida` | ativa | Login de gerente. Os outros 9 gerentes (de `rafael.monteiro` a `henrique.lima`) funcionam igual |
| Funcionário | `marina.costa` | ativa | Login de funcionário |
| Funcionário | `paulo.ribeiro` | ativo | Segundo funcionário, para testes com dois usuários |
| Funcionário | `renata.dias` | **inativa** | O login deve ser recusado ("Dados de acesso inválidos."), mesmo com a senha certa |

O perfil "Sem login" da Matriz de Autorização não aparece aqui de propósito: ele não é um usuário, e sim a situação de quem ainda não se autenticou. Decidimos usar a mesma senha para todos para facilitar o trabalho de quem testa. O custo é que quem descobrir uma conta descobre todas, o que não importa em um ambiente de demonstração, mas é mais um motivo para nunca usar este seed em produção.

## 4. As garantias do script

O script é **idempotente**: pode ser executado várias vezes, e em um banco que já existe, sem duplicar usuários. Quem já está cadastrado não é alterado, nem a senha nem o perfil (testamos trocando a senha de `marina.costa` à mão e reexecutando duas vezes: a senha trocada continuou valendo). Ele também é **atômico**, ou seja, ou tudo dá certo ou nada muda.

Há ainda uma trava no final. O script só termina com sucesso se **todo** perfil cadastrado tiver ao menos um usuário ativo. Se um dia alguém criar um perfil novo (por exemplo `SUPERVISOR`) e esquecer de dar um usuário de teste a ele, ou se todos os funcionários forem desativados, a inicialização do banco falha na hora e avisa qual perfil ficou sem usuário. Testamos os dois cenários, e em ambos a mensagem aponta o perfil certo e nenhuma linha é alterada. Preferimos que o problema apareça logo a descobrirmos no meio de um teste que um perfil estava sem conta.

## 5. A massa de dados

A massa de dados já estava no `02-seed.sql`, e o nosso trabalho foi garantir, com testes automáticos, que ela segue completa: 12 clientes, 12 produtos, 10 gerentes, 15 pedidos e 26 itens de pedido. Os pedidos cobrem todos os seis status do sistema (pendente, confirmado, em produção, pronto, entregue e cancelado) e as duas formas de entrega (retirada e entrega), e todo pedido tem ao menos um item. Isso é o que a equipe precisa para testar consulta, filtro por status e relatórios sem ter que cadastrar nada antes.

## 6. Como aplicar

Em um banco novo, o Docker executa o `06` sozinho, depois do `05`:

```bash
docker compose down -v && docker compose up --build
```

Em um banco que já existe (o Docker não repete os arquivos de `db/init`), aplique à mão. O `06` precisa que a migration `04` já tenha sido aplicada:

```bash
docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
    < db/init/06-seed-usuarios.sql
```

## 7. Como validamos

O script `db/testes/testes-seed-usuarios.sql` tem 13 verificações: nove sobre os usuários (todo perfil tem usuário ativo, os logins documentados existem com o perfil certo, existe um usuário inativo, todas as senhas são BCrypt com custo 10, todas validam `Senha@123`, nenhum hash se repete, gerentes têm `gerente_id` e funcionários não, e ninguém fica sem perfil) e quatro sobre a massa de dados. Todas passaram, e a saída está em `docs/evidencias/resultado-testes-seed-usuarios.txt`.

Para ter certeza de que os testes não passam à toa, provocamos defeitos de propósito em cópias do banco (nenhum usuário inativo, funcionários todos desativados, senha diferente da documentada, hash com custo 8, funcionária ligada a um gerente, gerente sem `gerente_id`, usuário sem perfil, dois usuários com o mesmo hash e pedidos sem itens). Cada defeito foi acusado pelo teste certo e o script terminou com código de saída diferente de zero. As baterias das tarefas anteriores continuaram passando sem alteração, já com os três funcionários no banco. Pelo lado Java, o BCrypt validou os 13 hashes gravados pelo PostgreSQL, aceitando a senha certa e recusando uma parecida.

Atualizamos também a documentação que o QA usa. No `GUIA-QA.md`, o caso CT-06 dizia que existiam 5 tabelas e agora são 8, o CT-13 ganhou as contagens de `perfil` e `usuario`, foram criados os casos CT-20 a CT-22 (usuários por perfil, senhas só em hash e o script de testes do seed) e há uma seção com a tabela de usuários de teste. O `README.md` lista os arquivos novos de `db`, e o `db/verificar.sql` passou a mostrar as tabelas de acesso e a lista de usuários por perfil. Executamos os comandos dos casos CT-06, CT-20, CT-21 e CT-22 exatamente como escritos, e os resultados batem com o que o guia promete.

## 8. Limites e cuidados

As credenciais deste seed são públicas, porque estão no repositório. Elas servem **só para demonstração e teste**. Como o `docker-compose.yml` monta a pasta `db/init` inteira, o `06-seed-usuarios.sql` seria executado em qualquer ambiente criado a partir dele, então ele precisa ser retirado (ou as senhas trocadas) antes de qualquer uso real do sistema.

O teste de que `renata.dias` é recusada no login só pode ser feito de ponta a ponta quando a rota de login estiver integrada ao backend. Hoje o que comprovamos no banco é que ela existe, está inativa e tem uma senha válida em hash. A recusa em si é feita pelo serviço de login da tarefa de hash de senha, que tem um teste próprio para esse caso. Por fim, as alterações no `GUIA-QA.md` e no `README.md` partem do pressuposto de que as migrations `04` e `05` estão integradas ao repositório.