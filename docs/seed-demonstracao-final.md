# Seed de demonstração do Marco Final

O script `db/seed/09-demonstracao-final.sql` popula o ambiente de demonstração sob demanda com dados sintéticos. A carga inclui 30 clientes, 8 produtos, 84 pedidos e 168 itens. São 12 pedidos de cada status e 42 pedidos de cada modalidade de atendimento.

| Perfil | Login | Senha |
|---|---|---|
| GERENTE | `demo.marco.gerente` | Valor de `DEMO_SENHA_GERENTE` |
| FUNCIONARIO | `demo.marco.funcionario` | Valor de `DEMO_SENHA_FUNCIONARIO` |

Forneça duas senhas distintas, de 12 a 72 bytes. O PostgreSQL grava os hashes BCrypt com custo 10 e um salt por conta. Use essas contas no ambiente de demonstração.

## Preparar uma base exclusiva de demonstração

Na raiz do projeto, com o Docker Compose configurado, crie o banco local `gabicake_marco_final` e aplique os scripts de estrutura.

```bash
docker compose up -d --wait db
docker compose exec -T db sh -c 'createdb -U "$POSTGRES_USER" gabicake_marco_final'

for script in db/init/0{1,3,4,5,7,8}-*.sql; do
    docker compose exec -T db sh -c '
        psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d gabicake_marco_final -f -
    ' < "$script" || break
done
```

Informe as senhas pelo terminal e execute o seed com `psql` 16 ou superior. As datas dos pedidos usam como referência o dia da primeira carga em `America/Fortaleza`.

```bash
read -rs -p 'Senha da conta gerente: ' DEMO_SENHA_GERENTE
printf '\n'
read -rs -p 'Senha da conta funcionário: ' DEMO_SENHA_FUNCIONARIO
printf '\n'
export DEMO_SENHA_GERENTE DEMO_SENHA_FUNCIONARIO

docker compose exec -T -e DEMO_SENHA_GERENTE -e DEMO_SENHA_FUNCIONARIO db sh -c '
    psql -X -U "$POSTGRES_USER" -d gabicake_marco_final -f -
' < db/seed/09-demonstracao-final.sql

unset DEMO_SENHA_GERENTE DEMO_SENHA_FUNCIONARIO
```

Quando as duas contas já existem com os perfis esperados e estão ativas, o script reutiliza a carga anterior. Em caso de erro, a transação é revertida.

Para abrir a aplicação com a base do Marco Final, suba os serviços apontando para o banco de demonstração.

```bash
POSTGRES_DB=gabicake_marco_final docker compose up -d --build backend frontend
```

## Roteiro de demonstração

Na base exclusiva, a consulta inicial de pedidos mostra 17 páginas de até 5 registros. No dia da carga, o filtro **Hoje** mostra 11 pedidos em 3 páginas. **Últimos 7 dias** mostra 20 pedidos e **Últimos 30 dias** mostra 44.

1. Entre com `demo.marco.gerente` e abra **Consultar Pedido**. Selecione **Hoje** e navegue com **Próxima** e **Anterior**.
2. Teste um período usando **Data inicial**, **Data final** e **Buscar**. Na API, `GET /pedidos/consulta?status=PENDENTE` permite conferir o filtro por status.
3. Entre com `demo.marco.funcionario` e confira o acesso à consulta. A rota `GET /financeiro/acesso` exige o perfil GERENTE.

## Validação

Em 27/11/2026, a carga foi aplicada em PostgreSQL 16.16. As duas contas fizeram login com o perfil esperado. A consulta retornou 12 pedidos para cada filtro de status, e a tela de pedidos exibiu os totais e as páginas do roteiro. O dump de dados permaneceu idêntico após reaplicar o seed.