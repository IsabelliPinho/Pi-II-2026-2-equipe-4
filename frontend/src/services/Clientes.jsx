import React, { useState, useEffect } from "react";
import { buscarClientes, ApiError } from "../api";

export function TelaClientes() {
  const [termo, setTermo] = useState("");
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarClientes = (query = "") => {
    setCarregando(true);
    setErro(null);
    buscarClientes(query)
      .then((dados) => {
        setClientes(dados);
        setCarregando(false);
      })
      .catch((err) => {
        const mensagem = err instanceof ApiError ? err.message : "Erro ao buscar clientes.";
        setErro(mensagem);
        setCarregando(false);
      });
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    setTermo(valor);
    carregarClientes(valor);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Consulta de Clientes</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nome do cliente..."
          value={termo}
          onChange={handleBuscaChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {erro && <p style={{ color: "#d9534f" }}>{erro}</p>}

      {carregando ? (
        <p>Buscando clientes...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Nome</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Contato / Telefone</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: "10px", textAlign: "center" }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id ?? c.cpf} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{c.nome}</td>
                  <td style={{ padding: "10px" }}>{c.telefone || c.email || "Não informado"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}