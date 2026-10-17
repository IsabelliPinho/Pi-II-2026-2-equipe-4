import React, { useEffect, useState } from "react";
import { listarProdutos, ApiError } from "../api"; // Ajuste o caminho de importação conforme sua estrutura

export function TelaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarProdutos()
      .then((dados) => {
        setProdutos(dados);
        setCarregando(false);
      })
      .catch((err) => {
        const mensagem = err instanceof ApiError ? err.message : "Não foi possível carregar o catálogo de produtos.";
        setErro(mensagem);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ padding: "20px", color: "#d9534f" }}>
        <p><strong>Erro:</strong> {erro}</p>
        <button onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Catálogo de Produtos</h2>

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "20px" }}>
          {produtos.map((p) => (
            <div
              key={p.id ?? p.nome}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{p.nome}</h3>
              <p style={{ color: "#666", fontSize: "14px", margin: "0 0 12px 0" }}>{p.descricao || "Sem descrição disponível."}</p>
              <strong style={{ fontSize: "18px", color: "#2e7d32" }}>
                R$ {Number(p.preco || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}