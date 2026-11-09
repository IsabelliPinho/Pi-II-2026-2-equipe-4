import { useEffect, useState } from "react";
import "../styles/AprovarPedido.css";
import {
    atualizarPedido,
    buscarClientes,
    buscarPedido,
    listarProdutos
} from "../services/api";
import { formatarData } from "../utils/Pedidos";

const moeda = (n) =>
    Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Aprovar = PENDENTE -> CONFIRMADO | Cancelar = PENDENTE -> CANCELADO
function AprovarPedido({ idPedido, voltar }) {
    const [pedido, setPedido] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [produtos, setProdutos] = useState({});
    const [carregando, setCarregando] = useState(Boolean(idPedido));
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        if (!idPedido) return;

        setCarregando(true);
        setErro("");

        Promise.all([buscarPedido(idPedido), buscarClientes(""), listarProdutos()])
            .then(([ped, clientes, lista]) => {
                setPedido(ped);
                setCliente(clientes.find((c) => c.id === ped.idCliente) ?? null);

                const mapa = {};
                lista.forEach((p) => {
                    mapa[p.id ?? p.idProduto] = p;
                });
                setProdutos(mapa);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, [idPedido]);

    const itens = pedido?.itens ?? [];

    const descricao = itens
        .map((item) => {
            const nome = produtos[item.idProduto]?.nome ?? `Produto ${item.idProduto}`;
            const extras = [
                item.peso ? `${item.peso} kg` : null,
                item.tipoMassa ? `massa: ${item.tipoMassa}` : null,
                item.tipoRecheio ? `recheio: ${item.tipoRecheio}` : null,
                item.tema ? `tema: ${item.tema}` : null
            ].filter(Boolean);
            return `${item.quantidade}x ${nome}${extras.length ? " — " + extras.join(", ") : ""}`;
        })
        .join("\n");

    const total = itens.reduce(
        (soma, item) =>
            soma + Number(produtos[item.idProduto]?.preco || 0) * (item.quantidade || 1),
        0
    );

    const pendente = pedido?.statusPedido === "PENDENTE";
    const numero = idPedido ? String(idPedido).padStart(3, "0") : "—";

    async function mudarStatus(novoStatus, mensagem) {
        setSalvando(true);
        setErro("");

        try {
            await atualizarPedido(idPedido, { statusPedido: novoStatus });
            setSucesso(mensagem);
            setPedido((atual) => ({ ...atual, statusPedido: novoStatus }));
        } catch (e) {
            setErro(e.message);
        } finally {
            setSalvando(false);
        }
    }

    function aprovar() {
        mudarStatus("CONFIRMADO", `Pedido ${numero} aprovado.`);
    }

    function cancelar() {
        if (!window.confirm(`Cancelar o pedido ${numero}?`)) return;
        mudarStatus("CANCELADO", `Pedido ${numero} cancelado.`);
    }

    if (!idPedido) {
        return (
            <main className="aprovar-main">
                <p className="aprovar-aviso">Nenhum pedido selecionado.</p>
                <button className="aprovar-voltar" onClick={voltar}>Voltar</button>
            </main>
        );
    }

    return (
        <main className="aprovar-main">
            <h1 className="aprovar-titulo">Pedido Nº {numero}</h1>

            {carregando && <p className="aprovar-aviso">Carregando pedido...</p>}
            {erro && <p className="aprovar-erro" role="alert">{erro}</p>}
            {sucesso && <p className="aprovar-sucesso" role="status">{sucesso}</p>}

            {!carregando && pedido && (
                <div className="aprovar-grade">
                    <div className="aprovar-coluna">
                        <section className="aprovar-card">
                            <h2>Cliente</h2>
                            <input readOnly value={cliente?.nome ?? ""} placeholder="Nome" />
                            <input
                                readOnly
                                value={cliente?.telefones?.[0] ?? ""}
                                placeholder="Telefone"
                            />
                        </section>

                        <input
                            className="aprovar-campo"
                            readOnly
                            value={pedido.dataPedido ? `Data do pedido: ${formatarData(pedido.dataPedido)}` : ""}
                        />

                        <textarea
                            className="aprovar-campo aprovar-descricao"
                            readOnly
                            value={descricao}
                            placeholder="Descrição do pedido"
                        />

                        <section className="aprovar-card">
                            <h2>Valor Total (R$)</h2>
                            <input readOnly value={moeda(total)} />
                        </section>
                    </div>

                    <div className="aprovar-coluna">
                        <section className="aprovar-card">
                            <h2>Tipo</h2>
                            <div className="aprovar-tipo">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={pedido.formaEntrega === "RETIRADA"}
                                        readOnly
                                        disabled
                                    />
                                    Retirada
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={pedido.formaEntrega === "ENTREGA"}
                                        readOnly
                                        disabled
                                    />
                                    Entrega
                                </label>
                            </div>
                        </section>

                        <input
                            className="aprovar-campo"
                            readOnly
                            value={
                                pedido.dataPrevista
                                    ? `${pedido.formaEntrega === "ENTREGA" ? "Entrega" : "Retirada"}: ${formatarData(pedido.dataPrevista)}`
                                    : ""
                            }
                        />

                        <textarea
                            className="aprovar-campo aprovar-observacoes"
                            readOnly
                            value={pedido.observacoes ?? ""}
                            placeholder="Observações"
                        />

                        {!pendente && (
                            <p className="aprovar-aviso">
                                Este pedido já está {pedido.statusPedido.toLowerCase().replace("_", " ")}.
                            </p>
                        )}

                        <div className="aprovar-acoes">
                            <button
                                className="aprovar-botao aprovar-botao-ok"
                                onClick={aprovar}
                                disabled={!pendente || salvando}
                            >
                                {salvando ? "Salvando..." : "Aprovar Pedido"}
                            </button>

                            <button
                                className="aprovar-botao aprovar-botao-cancelar"
                                onClick={cancelar}
                                disabled={!pendente || salvando}
                            >
                                Cancelar
                            </button>
                        </div>

                        <button className="aprovar-voltar" onClick={voltar}>
                            Voltar para pendentes
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AprovarPedido;