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
* Nomenclatura: camelCase nos campos JSON.  
* Identificadores: Números inteiros (Long / Integer).  
* Status de pedido permitidos: PENDENTE, ATENDIDO, CANCELADO  
* Formas de atendimento permitidas: ENTREGA, RETIRADA  
* Tipos financeiros permitidos: ENTRADA, SAIDA


**ROTAS :**

### **1\. Cadastrar Cliente**

* **Requisito:** RF001  
* **Caminho:** /clientes  
* **Método:** POST  
* **Status HTTP de Sucesso:** 201 Created

**Body de Entrada:**

{  
  "nome": "Maria da Silva",  
  "telefone": "(85) 99999-1111",  
  "endereco": {  
    "rua": "Rua das Flores",  
    "numero": "120",  
    "bairro": "Centro",  
    "cep": "60000-000"  
  }  
}

**Resposta:**

{  
  "idCliente": 1,  
  "nome": "Maria da Silva",  
  "telefone": "(85) 99999-1111",  
  "endereco": {  
    "rua": "Rua das Flores",  
    "numero": "120",  
    "bairro": "Centro",  
    "cep": "60000-000"  
  },  
  "criadoEm": "2026-09-20T14:30:00"  
}

### **2\. Buscar Clientes**

* **Requisito:** RF002  
* **Caminho:** /clientes  
* **Método:** GET  
* **Parâmetros de Query:** busca (opcional \- busca por nome ou telefone)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /clientes?busca=maria

**Resposta:**

\[  
  {  
    "idCliente": 1,  
    "nome": "Maria da Silva",  
    "telefone": "(85) 99999-1111",  
    "quantidadePedidos": 3  
  }  
\]

### **3\. Registrar Pedido**

* **Requisito:** RF003, RF005  
* **Caminho:** /pedidos  
* **Método:** POST  
* **Status HTTP de Sucesso:** 201 Created

*Nota: Se formaAtendimento for "RETIRADA", o campo enderecoEntrega não é obrigatório.*

**Body de Entrada:**

{  
  "idCliente": 1,  
  "descricao": "Bolo de aniversário",  
  "valorTotal": 150.00,  
  "dataPedido": "2026-09-20",  
  "dataPrevistaEntrega": "2026-09-25",  
  "formaAtendimento": "ENTREGA",  
  "enderecoEntrega": {  
    "rua": "Rua das Flores",  
    "numero": "120",  
    "bairro": "Centro",  
    "cep": "60000-000"  
  }  
}

**Resposta:**

{  
  "idPedido": 100,  
  "idCliente": 1,  
  "descricao": "Bolo de aniversário",  
  "valorTotal": 150.00,  
  "dataPedido": "2026-09-20",  
  "dataPrevistaEntrega": "2026-09-25",  
  "formaAtendimento": "ENTREGA",  
  "status": "PENDENTE"  
}

### **4\. Consultar Pedidos**

* **Requisito:** RF003, RF007  
* **Caminho:** /pedidos  
* **Método:** GET  
* **Parâmetros de Query:** status (opcional), inicio (opcional), fim (opcional)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /pedidos?status=PENDENTE

**Resposta:**

\[  
  {  
    "idPedido": 100,  
    "nomeCliente": "Maria da Silva",  
    "dataPrevistaEntrega": "2026-09-25",  
    "formaAtendimento": "ENTREGA",  
    "status": "PENDENTE"  
  }  
\]

### **5\. Atualizar Pedido**

* **Requisito:** RF004, RF005, RF007, RF009  
* **Caminho:** /pedidos/{idPedido}  
* **Método:** PATCH  
* **Parâmetro de Rota:** idPedido  
* **Status HTTP de Sucesso:** 200 OK

*Valores possíveis para status: PENDENTE, ATENDIDO, CANCELADO*

**Body de Entrada:**

{  
  "status": "ATENDIDO"  
}

**Resposta:**

{  
  "idPedido": 100,  
  "status": "ATENDIDO",  
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
  "pedidos": \[  
    {  
      "idPedido": 100,  
      "nomeCliente": "Maria da Silva",  
      "formaAtendimento": "ENTREGA",  
      "status": "PENDENTE"  
    }  
  \]  
}

### **7\. Pedidos Próximos do Prazo**

* **Requisito:** RF008  
* **Caminho:** /lembretes/pedidos-proximos  
* **Método:** GET  
* **Parâmetro de Query:** dias (obrigatório)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /lembretes/pedidos-proximos?dias=2

**Resposta:**

\[  
  {  
    "idPedido": 100,  
    "nomeCliente": "Maria da Silva",  
    "dataPrevistaEntrega": "2026-09-25",  
    "diasRestantes": 1  
  }  
\]

### **8\. Consultar Lançamentos Financeiros**

* **Requisito:** RF010  
* **Caminho:** /financeiro  
* **Método:** GET  
* **Parâmetros de Query:** tipo (opcional: ENTRADA | SAIDA), inicio (opcional), fim (opcional)  
* **Status HTTP de Sucesso:** 200 OK

**Exemplo de Chamada:** /financeiro?tipo=ENTRADA

**Resposta:**

\[  
  {  
    "idLancamento": 50,  
    "valor": 150.00,  
    "tipo": "ENTRADA",  
    "data": "2026-09-20",  
    "descricao": "Pagamento do pedido 100"  
  }  
\]

### **9\. Adicionar Lançamento Financeiro**

* **Requisito:** RF010  
* **Caminho:** /financeiro  
* **Método:** POST  
* **Status HTTP de Sucesso:** 201 Created

**Body de Entrada:**

{  
  "valor": 150.00,  
  "tipo": "ENTRADA",  
  "data": "2026-09-20",  
  "descricao": "Pagamento do pedido 100"  
}

**Resposta:**

{  
  "idLancamento": 50,  
  "valor": 150.00,  
  "tipo": "ENTRADA",  
  "data": "2026-09-20",  
  "descricao": "Pagamento do pedido 100"  
}

### **10\. Alterar Lançamento Financeiro**

* **Requisito:** RF010  
* **Caminho:** /financeiro/{idLancamento}  
* **Método:** PATCH  
* **Parâmetro de Rota:** idLancamento  
* **Status HTTP de Sucesso:** 200 OK

**Body de Entrada:**

{  
  "valor": 175.00,  
  "descricao": "Valor atualizado"  
}

**Resposta:**

{  
  "idLancamento": 50,  
  "valor": 175.00,  
  "descricao": "Valor atualizado",  
  "atualizadoEm": "2026-09-20T16:00:00"  
}

