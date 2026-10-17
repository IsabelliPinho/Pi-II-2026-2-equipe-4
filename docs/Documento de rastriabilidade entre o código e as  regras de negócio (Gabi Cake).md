# **Documento de rastreabilidade entre o código e as regras de negócio** 

 Gabi Cake — Sistema de Gestão para Confeitaria

Este documento correlaciona de forma direta e estruturada as Regras de Negócio ,apresentada no documento de requisitos, (RN001–RN005) do projeto Gabi Cake com as respetivas classes, métodos e trechos de código implementados na aplicação Spring Boot.

## **1\. Mapeamento de Regras de Negócio**

### **1.1 RN001 – Registro de Descontos e Valores do Pedido**

* **Requisito Vinculado:** RF003 – Registro e consulta de pedidos.  
* **Classe:** com.gabicake.api.service.PedidoService  
* **Método / Linhas Associadas:** registrar(Pedido pedido) (validação de campos obrigatórios e integridade do payload).  
  **trecho do código : java** 

if (pedido.getIdCliente() \== null  
        || pedido.getNomeGerente() \== null || pedido.getNomeGerente().isBlank()  
        || pedido.getDataPrevista() \== null  
        || pedido.getFormaEntrega() \== null  
        || pedido.getItens() \== null || pedido.getItens().isEmpty()) {  
    throw ApiException.validacao("idCliente, nomeGerente, dataPrevista, formaEntrega e itens são obrigatórios.");  
}

* **Correlação:** Garante a integridade financeira e estrutural dos dados informados no payload do pedido antes da persistência no banco de dados.

### **1.2 RN002 – Associação de Cliente e Gerente ao Pedido**

* **Requisito Vinculado:** RF003 – Registro e consulta de pedidos.  
* **Classe:** com.gabicake.api.service.PedidoService  
* **Método / Linhas Associadas:** registrar(Pedido pedido) e rotinas de validação de dependências.  
  **trecho do código : java**

if (pedido.getIdCliente() \== null || pedido.getNomeGerente() \== null || pedido.getNomeGerente().isBlank()) {  
    throw ApiException.validacao("idCliente e nomeGerente são obrigatórios.");  
}

* **Correlação:** Assegura a rastreabilidade operacional, vinculando o pedido de forma clara ao identificador do cliente (idCliente) e ao colaborador responsável pelo atendimento (nomeGerente).

### **1.3 RN003 – Validação de Prazo e Antecedência Mínima (Itens/Pesos)**

* **Requisito Vinculado:** RF003 – Registro e consulta de pedidos.  
* **Classe:** com.gabicake.api.service.PedidoService  
* **Método / Linhas Associadas:** registrar(...) e validarItens(List\<ItemPedido\> itens).  
  **trecho do código :  java**

LocalDate hoje \= LocalDate.now();  
if (pedido.getDataPrevista().toLocalDate().isBefore(hoje)) {  
    throw ApiException.validacao("A data prevista não pode ser anterior à data atual.");  
}

// Validação de peso e quantidade mínima para itens customizados/massas  
if (item.getPeso() \!= null && item.getPeso().compareTo(new BigDecimal("2")) \< 0\) {  
    throw ApiException.validacao("O peso de cada item, quando informado, deve ser no mínimo 2 kg.");  
}

* **Correlação:** Valida restrições temporais (dataPrevista) e especificações de produção de massas,bolos e outros, assegurando limites operacionais viáveis para a confeitaria.

### **1.4 RN004 – Restrição de Cancelamento de Pedidos (Agenda / Pendentes)**

* **Requisito Vinculado:** RF009 (Cancelamento) e RF006/RF007 (Agenda e Pedidos Pendentes).  
* **Classe:** com.gabicake.api.service.PedidoService  
* **Método / Linhas Associadas:** validarTransicaoDeStatus(String statusAtual, String novoStatus) acionado no método atualizar(...).  
    
  **trecho do código :  java**


private void validarTransicaoDeStatus(String statusAtual, String novoStatus) {  
    // Regra: só pode cancelar se o status atual ainda for PENDENTE.  
    if ("CANCELADO".equalsIgnoreCase(novoStatus) && \!"PENDENTE".equalsIgnoreCase(statusAtual)) {  
        throw ApiException.conflito("Só é possível cancelar um pedido que ainda esteja PENDENTE.");  
    }  
}

* **Correlação:** Controla rigorosamente o ciclo de vida do pedido. Pedidos que já avançaram na produção perdem a elegibilidade para cancelamento direto, preservando a consistência da agenda produtiva.

### **1.5 RN005 – Verificação de Endereço e Forma de Entrega**

* **Requisito Vinculado:** RF011 (Raio de entrega) e RF005 (Definição de entrega ou retirada).  
* **Classe:** com.gabicake.api.service.PedidoService  
* **Método / Linhas Associadas:** registrar(Pedido pedido) (validação condicional de modalidade).  
  **trecho do código :  java**

if (\!"ENTREGA".equalsIgnoreCase(pedido.getFormaEntrega())  
        && \!"RETIRADA".equalsIgnoreCase(pedido.getFormaEntrega())) {  
    throw ApiException.validacao("formaEntrega deve ser ENTREGA ou RETIRADA.");  
}

if ("ENTREGA".equalsIgnoreCase(pedido.getFormaEntrega())  
        && (pedido.getEntregaBairro() \== null  
            || pedido.getEntregaRua() \== null  
            || pedido.getEntregaNumCasa() \== null)) {  
    throw ApiException.validacao("entregaBairro, entregaRua e entregaNumCasa são obrigatórios quando formaEntrega for ENTREGA.");  
}

* **Correlação:** Condiciona a obrigatoriedade dos dados logísticos à modalidade escolhida (ENTREGA vs RETIRADA), evitando falhas de despacho.

## **2\. Tratamento e Padronização de Exceções HTTP (ApiException.java)**

Todas as violações mapeadas acima disparam respostas padronizadas geradas pelo manipulador global (GlobalExceptionHandler) que são estruturadas pela classe ApiException: assim :

| Status HTTP | Código do Erro (JSON) | Cenário de Aplicação |
| :---- | :---- | :---- |
| **400 Bad Request** | VALIDATION\_ERROR / REQUISICAO\_INVALIDA | Atributos obrigatórios ausentes ou preenchidos incorretamente (RN001, RN002, RN005). |
| **409 Conflict** | BUSINESS\_RULE\_VIOLATION | Violação direta de regras de negócio do domínio, como restrições de ciclo de vida (RN004). |
| **404 Not Found** | NOT\_FOUND | Tentativa de acesso a recursos (clientes, produtos ou pedidos) inexistentes na base de dados. |

