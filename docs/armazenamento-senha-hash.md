# Armazenamento de senha com hash seguro – Gabi Cake

Projeto Integrador II 2026/2 – Equipe 4
Algoritmo: BCrypt (custo 10), via `spring-security-crypto`
Arquivos relacionados: `UsuarioService.java`, `PasswordEncoderConfig.java`, `db/init/05-senha-hash-gerente.sql`, `db/testes/testes-senha-hash.sql` e `UsuarioServiceTest.java`

## 1. O problema que estamos resolvendo

Se alguém conseguir uma cópia do banco de dados (um backup que vazou, uma falha de acesso, um erro de configuração), o que estiver gravado na coluna de senha é o que essa pessoa vai ler. Se for a senha em texto puro, todas as contas estão comprometidas na hora, e ainda por cima muita gente repete a mesma senha em outros sites. Por isso, o sistema nunca guarda a senha: guarda apenas o **hash** dela, uma transformação que só vai em uma direção. Para conferir um login, o sistema aplica a mesma transformação na senha digitada e compara os resultados, sem nunca precisar "desfazer" nada.

## 2. Por que BCrypt

Escolhemos o BCrypt por três motivos. Primeiro, ele foi feito para senhas e é **propositalmente lento**, o que torna caro para um atacante testar milhões de palpites. Segundo, cada hash já carrega dentro de si um **salt** (um tempero aleatório) e o **custo** usado, então duas pessoas com a mesma senha acabam com hashes diferentes e não precisamos guardar nenhum segredo extra. Terceiro, o banco já falava BCrypt: o seed usa `crypt(..., gen_salt('bf', 10))` do `pgcrypto`, que gera hashes `$2a$10$...` compatíveis com o Spring. Isso significa que os usuários migrados na tarefa anterior continuam logando sem nenhuma conversão.

O custo é 10, o mesmo do seed, e pode ser ajustado sem mexer no código pela propriedade `app.security.bcrypt-strength` (ou pela variável de ambiente `BCRYPT_STRENGTH`, que no Docker precisa ser declarada na seção `environment` do backend no `docker-compose.yml`). O OWASP recomenda o Argon2id como primeira opção para sistemas novos e aceita o BCrypt com custo 10 ou mais, que é o nosso caso. Trocar de algoritmo no futuro é possível, mas exigiria migrar os hashes existentes e ajustar as constraints do banco, que hoje aceitam apenas o formato BCrypt.

Usamos apenas o módulo `spring-security-crypto`, e não o Spring Security completo. O módulo completo passa a exigir autenticação em **todos** os endpoints assim que entra no projeto, o que quebraria o frontend e o roteiro de QA antes de existir a tarefa de controle de acesso.

## 3. Como funcionam os dois fluxos

**Criação de usuário** (`POST /usuarios/cadastro`). O serviço normaliza o login (minúsculas, sem espaços nas pontas), confere as regras da senha, confirma que o perfil existe e que o login está livre, e só então chama `passwordEncoder.encode(senha)`. O resultado desse método é a **única** coisa que chega ao banco: não existe nenhum caminho no código em que a senha pura seja atribuída ao usuário. A resposta da API devolve nome, login e perfis, e não tem campo de senha nem de hash.

**Login** (`POST /auth/login`). O serviço procura o usuário pelo login e usa `passwordEncoder.matches(senhaDigitada, hashGravado)` para comparar. Nunca comparamos textos com `equals`. Se estiver tudo certo, devolve os dados do usuário e seus perfis. Se algo falhar, devolve HTTP 401 com a mensagem "Dados de acesso inválidos.", exatamente como pede o RF012.

Além do hash em si, incluímos alguns cuidados que costumam ser esquecidos:

- **A mesma mensagem para tudo.** Login inexistente, senha errada e usuário inativo respondem exatamente igual, para não revelar a quem tenta invadir quais logins existem.
- **Tempo de resposta parecido.** Quando o login não existe, o serviço compara a senha com um hash fictício, para que a resposta não seja visivelmente mais rápida e denuncie a inexistência da conta.
- **Limite de 72 bytes.** O BCrypt só enxerga os primeiros 72 bytes da senha, então senhas maiores são recusadas no cadastro em vez de serem cortadas em silêncio. A senha precisa ter pelo menos 8 caracteres.
- **Senha fora dos logs.** O `toString()` dos objetos de entrada esconde a senha, e a `UsuarioEntity` nem tem `toString()`, para o hash nunca ir parar em um log por acidente.
- **Custo que acompanha o tempo.** Se aumentarmos o custo no futuro, o hash antigo de cada pessoa é regravado com o custo novo no próximo login, aproveitando que a senha acabou de ser digitada.

## 4. O banco como segunda barreira

O código pode ter um erro ou ser contornado, então o banco também recusa texto puro. Em `usuario.senha_hash`, a constraint `ck_usuario_senha_hash` (migration 04) só aceita o formato de hash BCrypt. Já a coluna `gerente.senha`, que existia antes e não tinha essa proteção, aceitava qualquer texto, o que contrariava o critério de "nenhuma senha em texto puro". A migration `05-senha-hash-gerente.sql` resolve isso de duas formas: converte para BCrypt qualquer senha antiga que ainda esteja em texto puro e cria a constraint `ck_gerente_senha_hash`. Ela é idempotente e roda dentro de uma transação, e em um banco que já passou pelo seed não altera nenhuma linha.

Para manter tudo funcionando, trocamos o `'x'` que alguns scripts usavam como senha de teste (`verificar.sql`, `carga-teste-indices.sql` e `testes-integridade.sql`) por um hash válido, e o `verificar.sql` ganhou um caso que tenta gravar texto puro e precisa ser recusado.

## 5. Como validar

| O que | Como rodar | O que prova |
|---|---|---|
| Testes do banco (13 casos) | `docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 < db/testes/testes-senha-hash.sql` | Todas as linhas de `usuario` e `gerente` estão no formato BCrypt, com custo mínimo 10 e salt único. Uma varredura em todas as colunas de texto não encontra a senha do seed em claro. O banco recusa texto puro, hash truncado e MD5. |
| Testes do serviço (13 casos) | `mvn test` na pasta `backend` | A senha nunca é gravada em texto, a mesma senha gera hashes diferentes, o login confere pelo hash, as mensagens são iguais para todos os erros, o hash do Postgres é aceito e o hash antigo é atualizado. |

A saída do script SQL na nossa execução está em `docs/evidencias/resultado-testes-senha-hash.txt`. Para ver com os próprios olhos o que fica no banco, com a API no ar:

```bash
curl -s -X POST localhost:8080/usuarios/cadastro -H "Content-Type: application/json" \
  -d '{"nome":"Funcionária Teste","login":"func.teste","senha":"Segredo#Forte1","perfil":"FUNCIONARIO"}'

curl -s -X POST localhost:8080/auth/login -H "Content-Type: application/json" \
  -d '{"login":"func.teste","senha":"Segredo#Forte1"}'

curl -i -X POST localhost:8080/auth/login -H "Content-Type: application/json" \
  -d '{"login":"func.teste","senha":"senha-errada"}'

docker compose exec db psql -U gabicake -d gabicake -c \
  "SELECT login, left(senha_hash, 7) AS inicio, length(senha_hash) AS tamanho FROM usuario WHERE login = 'func.teste';"
```

O primeiro comando deve devolver HTTP 201 sem nenhum campo de senha, o segundo deve devolver os dados do usuário, o terceiro deve devolver HTTP 401 com "Dados de acesso inválidos." e a consulta final deve mostrar `$2a$10$` no início e tamanho 60. Como os usuários migrados na tarefa anterior ainda têm a senha de teste do seed, `gabriela.almeida` com `Senha@123` também deve conseguir entrar.

## 6. Limites desta entrega e decisões para a equipe

O hash protege contra o vazamento do banco, mas não existe segurança 100%. Ele torna cada senha vazada cara de quebrar, porém uma senha fraca como "12345678" ainda pode ser descoberta por tentativa e erro. Por isso o requisito de tamanho mínimo é só o começo, e a regra de qualidade da senha é uma decisão da equipe e da cliente.

O que **não** está incluído, por ser de outras tarefas: o bloqueio temporário após 3 tentativas erradas (RN006), a sessão autenticada e o controle de inatividade (RF012), a restrição de rotas por perfil (Matriz de Autorização), e a troca ou recuperação de senha. O login desta entrega devolve os dados do usuário, mas ainda não emite token nem cria sessão.

Há um ponto importante de segurança: enquanto não existir o controle de acesso, a rota `POST /usuarios/cadastro` está aberta para qualquer pessoa, inclusive para criar uma conta de gerente. O restante da API já é aberto hoje, mas esta rota precisa ser restrita à gerente **antes** de o sistema ser publicado. Os usuários migrados também herdam a senha de teste `Senha@123`, que precisa ser trocada antes de qualquer uso real. Por fim, a coluna `gerente.senha` ainda existe só por compatibilidade com o seed, e pode ser removida quando o backend deixar de depender dela.