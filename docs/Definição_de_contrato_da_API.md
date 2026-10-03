# **CONTRATO DA API** 

**Projeto Integrador II — Equipe 4-Gabi Cake**

O documento define as 10 rotas HTTP da API do sistema Gabi Cake, derivadas diretamente dos Requisitos Funcionais (RF 001 a RF010).

## **Requisitos Funcionais Mapeados**

* **RF001** — Cadastro de clientes  
* **RF002** — Busca de clientes  
* **RF003** — Registro e consulta de pedidos  
* **RF004** — Alteração e atualização de pedidos  
* **RF005** — Forma de entrega ou retirada  
* **RF006** — Organização da agenda  
* **RF007** — Acompanhamento de pedidos pendentes  
* **RF008** — Lembrete de pedidos próximos do prazo  
* **RF009** — Cancelamento de pedidos  
* **RF010** — Controle financeiro

## **Convenções Gerais**

* Formato de entrada e saída: application/json  
* Datas: YYYY-MM-DD  
* Data e hora: YYYY-MM-DDTHH:mm:ss  
* Valores monetários: Número decimal positivo, em reais.  
* Nomenclatura: camelCase nos campos JSON.( as colunas do banco estão em snake_case)
* Identificadores: Números inteiros (Long / Integer).  
* Status de pedido permitidos: PENDENTE, ATENDIDO, CANCELADO  
* Formas de atendimento permitidas: ENTREGA, RETIRADA  


**ROTAS :**

### **1\. Cadastrar Cliente**

* **Requisito:** RF001  
* **Caminho:** /clientes/cadastro  
* **Método:** POST  
* **Status HTTP de Sucesso:** 201 Created

**Body de Entrada:**

{  
  "nome": "Maria da Silva",  
   "telefones": ["(85) 99999-1111", "(85) 98888-2222"],
   "bairro": "Centro",
   "rua": "Rua das Flores",
   "numCasa": "120",
  "cep": "60000-000"
}

**Resposta:**

{  
  "id": 1,  
  "nome": "Maria da Silva",  
  "telefones": ["(85) 99999-1111", "(85) 98888-2222"],
  "bairro": "Centro",
  "rua": "Rua das Flores",
  "numCasa": "120",
  "cep": "60000-000"
}



### **2\. Buscar Clientes**

* **Requisito:** RF002  
* **Caminho:** /clientes/busca  
* **Método:** GET  
* **Parâmetros de Query:** busca (opcional \- busca por nome ou telefone)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /clientes/busca?busca=maria

**Resposta:**

\[  
  {  
    "id": 1,  
    "nome": "Maria da Silva",  
    "telefones": ["(85) 99999-1111"] 
  }  
\]

### **3\. Registrar Pedido**

* **Requisito:** RF003, RF005  
* **Caminho:** /pedidos/cadastro  
* **Método:** POST  
* **Status HTTP de Sucesso:** 201 Created

*Nota: Se formaEntrega for "RETIRADA", os campos entregaBairro,entregaRua e entregaNumCasa não são obrigatórios.*

*Nota: dataPrevista não pode ser anterior a data atual .*

*Nota: em cada item, quantidade deve ser maior que 0 ( assumindo 1 se não for informado ) ; peso, quando informado , deve ser no mínimo 2 kilos*

**Body de Entrada:**

{  
  "idCliente": 1,  
  "nomeGerente":"Gabriela",
  "dataPrevista":"2026-09-25T15:00:00",
  "formaEntrega":"ENTREGA",
  "entregaBairro":"Centro",
  "entregaRua":"Rua das Flores",
  "entregaNumCasa":"120",
  "entregaCep":"60000-000",
  "itens": [
    {
     "idProduto": 10,
    "quantidade": 1,
    "tipoMassa": "Chocolate",
    "tema": "Aniversário",
    "peso": 2.5,
    "tipoRecheio": "Brigadeiro"
    }
  ]
}

**Resposta:**

{
  "id": 100,
  "idCliente": 1,
  "nomeGerente": "Gabriela",
  "dataPedido": "2026-09-20",
  "dataPrevista": "2026-09-25T15:00:00",
  "statusPedido": "PENDENTE",
  "formaEntrega": "ENTREGA",
  "entregaBairro": "Centro",
  "entregaRua": "Rua das Flores",
  "entregaNumCasa": "120",
  "entregaCep": "60000-000",
  "itens": [
    {
      "idProduto": 10,
      "quantidade": 1,
      "tipoMassa": "Chocolate",
      "tema": "Aniversário",
      "peso": 2.5,
      "tipoRecheio": "Brigadeiro"
    }
  ]
}

### **4\. Consultar Pedidos**

* **Requisito:** RF003, RF007  
* **Caminho:** /pedidos/consulta  
* **Método:** GET  
* **Parâmetros de Query:** status (opcional), inicio (opcional), fim (opcional)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /pedidos/consulta?status=PENDENTE

**Resposta:**

\[  
  {  
    "id": 100,  
    "nomeCliente": "Maria da Silva",  
    "dataPrevista": "2026-09-25T15:00:00",  
    "formaEntrega": "ENTREGA",  
    "statusPedido": "PENDENTE"  
  }  
\]

### **5\. Atualizar Pedido**

* **Requisito:** RF004, RF005, RF007, RF009  
* **Caminho:** /pedidos/{id}  
* **Método:** PATCH  
* **Parâmetro de Rota:** id 
* **Status HTTP de Sucesso:** 200 OK

*Valores possíveis para statusPedido: PENDENTE, ATENDIDO, CANCELADO*
*Regra só é permitido alterar Cancelado se o status atual for PENDENTE.*

**Body de Entrada:**

{  
  "statusPedido": "ATENDIDO"  
}

**Resposta:**

{  
  "id": 100,  
  "statusPedido": "ATENDIDO",  
  "atualizadoEm": "2026-09-20T15:10:00"  
}

### **6\. Consultar Agenda**

* **Requisito:** RF006  
* **Caminho:** /agenda  
* **Método:** GET  
* **Parâmetro de Query:** data (obrigatório)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /agenda?data=2026-09-25

**Resposta:**

{  
  "data": "2026-09-25",  
  "pedidos": [  
    {  
      "id": 100,  
      "nomeCliente": "Maria da Silva",  
      "formaEntrega": "ENTREGA",  
      "statusPedido": "PENDENTE"  
    }  
  ]  
}

### **7\. Pedidos Próximos do Prazo**

* **Requisito:** RF008  
* **Caminho:** /lembretes/pedidos-proximos  
* **Método:** GET  
* **Parâmetro de Query:** dias (obrigatório)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /lembretes/pedidos-proximos?dias=2

**Resposta:**

[  
  {  
    "id": 100,  
    "nomeCliente": "Maria da Silva",  
    "dataPrevista": "2026-09-25T15:00:00",  
    "diasRestantes": 1  
  }  
]

### **8\. Acesso á planilha financeira**

* **Requisito:** RF010  
* **Caminho:** /financeiro/acesso 
* **Método:** GET    
* **Status HTTP de Sucesso:** 200 OK
  
* Nota: os dados financeiros ficam numa planilha externa (Google Sheets), não
no banco — por isso esta rota só devolve o link de acesso, sem gerenciar
lançamentos.*

**Resposta:**
{"url":"https://docs.google.com/spreadsheets/d/EXEMPLO-ID/edit"}

possível erro : planilha indisponível :
Status HTTP: 404   Not Found
{
"error":"PLANILHA_INDISPONIVEL",
"message":"Não foi possível acessar a planilha financeira."
}


### **9\. Listar Produtos**

* **Requisito:** RF003
* **Caminho:** /listar/produtos  
* **Método:** GET 
* **Status HTTP de Sucesso:** 200 ok
  
**Resposta:**
[
{  
  "id": 10,  
  "nome": "Bolo de Chocolate",
  "preco": 80.00
}
,
{
 "id":11,
 "nome": "Bolo de Baunilha",
 "preco":70.00
}
]
### **10\.Consultar Pedido por ID**

* **Requisito:** RF003,RF007  
* **Caminho:**/pedidos/{id}  
* **Método:**Get  
* **Parâmetro de Rota:** id 
* **Status HTTP de Sucesso:** 200 OK e 404 se o pedido não existir
  
* Nota: diferente da rota 4 ( que lista vários pedidos resumidos ) , esta retorna um único pedido com todos os detalhes, incluindo os itens .*
  
  **Resposta:**
  {
  "id": 100,
  "idCliente": 1,
  "nomeGerente": "Gabriela",
  "dataPedido": "2026-09-20",
  "dataPrevista": "2026-09-25T15:00:00",
  "statusPedido": "PENDENTE",
  "formaEntrega": "ENTREGA",
  "entregaBairro": "Centro",
  "entregaRua": "Rua das Flores",
  "entregaNumCasa": "120",
  "entregaCep": "60000-000",
  "itens": [
    {
      "idProduto": 10,
      "quantidade": 1,
      "tipoMassa": "Chocolate",
      "tema": "Aniversário",
      "peso": 2.5,
      "tipoRecheio": "Brigadeiro"
    }
  ]
}
  



