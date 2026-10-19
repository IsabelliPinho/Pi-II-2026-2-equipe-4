import React, { useState, useEffect } from "react";
import { consultarPedidos, ApiError } from "./api.js";

export function TelaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    consultarPedidos({ status: statusFiltro })
      .then((dados) => {
        setPedidos(dados);
        setCarregando(false);
      })
      .catch((err) => {
        const mensagem = err instanceof ApiError ? err.message : "Erro ao carregar a agenda de pedidos.";
        setErro(mensagem);
        setCarregando(false);
      });
  }, [statusFiltro]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Agenda e Encomendas</h2>

      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="status-select"><strong>Filtrar por Status:</strong></label>
        <select
          id="status-select"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Todos os Status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_PRODUCAO">Em Produção</option>
          <option value="PRONTO">Pronto</option>
          <option value="ENTREGUE">Entregue</option>
        </select>
      </div>

      {erro && <p style={{ color: "#d9534f" }}>{erro}</p>}

      {carregando ? (
        <p>Carregando encomendas...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pedidos.length === 0 ? (
            <p>Nenhum pedido encontrado para o filtro selecionado.</p>
          ) : (
            pedidos.map((ped) => (
              <div
                key={ped.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "16px",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 4px 0" }}>Pedido #{ped.id}</h4>
                  <p style={{ margin: 0, color: "#555" }}>
                    Cliente: {ped.clienteNome || ped.clienteId || "Não identificado"}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        ped.status === "ENTREGUE" ? "#d4edda" :
                        ped.status === "PRONTO" ? "#cce5ff" :
                        ped.status === "EM_PRODUCAO" ? "#fff3cd" : "#f8d7da",
                      color:
                        ped.status === "ENTREGUE" ? "#155724" :
                        ped.status === "PRONTO" ? "#004085" :
                        ped.status === "EM_PRODUCAO" ? "#856404" : "#721c24"
                    }}
                  >
                    {ped.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}