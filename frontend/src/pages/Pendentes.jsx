import { useEffect, useState } from "react";
import "../styles/Pendentes.css";
import {
    atualizarPedido,
    buscarClientes,
    buscarPedido,
    consultarPedidos,
    listarProdutos
} from "../services/api";
import {
    STATUS,
    STATUS_ATENDIDO,
    diasAte,
    estaPendente,
    formatarData,
    formatarDia,
    rotuloPrazo
} from "../utils/Pedidos";

function Pendentes({ voltarDashboard, abrirDetalhe, abrirAprovar }) {

    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", texto }

    const [clientesPorId, setClientesPorId] = useState({});
    const [produtosPorId, setProdutosPorId] = useState({});

    const [selecionadoId, setSelecionadoId] = useState(null);
    const [detalhe, setDetalhe] = useState(null);
    const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
    const [marcando, setMarcando] = useState(false);

    // RF007: pedidos ainda não atendidos, do prazo mais próximo ao mais distante
    useEffect(() => {
        consultarPedidos()
            .then((dados) =>
                setPedidos(
                    dados
                        .filter((p) => estaPendente(p.statusPedido))
                        .sort((a, b) =>
                            (a.dataPrevista ?? "").localeCompare(b.dataPrevista ?? "")
                        )
                )
            )
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));

        // nomes/telefones e produtos para montar o painel de detalhes
        buscarClientes("")
            .then((lista) => {
                const mapa = {};
                lista.forEach((c) => {
                    mapa[c.id] = c;
                });
                setClientesPorId(mapa);
            })
            .catch(() => {});

        listarProdutos()
            .then((lista) => {
                const mapa = {};
                lista.forEach((p) => {
                    mapa[p.id ?? p.idProduto] = p.nome;
                });
                setProdutosPorId(mapa);
            })
            .catch(() => {});
    }, []);

    function selecionar(id) {
        setSelecionadoId(id);
        setDetalhe(null);
        setAviso(null);
        setCarregandoDetalhe(true);

        buscarPedido(id)
            .then(setDetalhe)
            .catch((e) => setAviso({ tipo: "erro", texto: e.message }))
            .finally(() => setCarregandoDetalhe(false));
    }

    // RF007 (fluxo 5 e 6): atendido = ENTREGUE no banco; remove da lista
    async function marcarAtendido() {
        setMarcando(true);
        try {
            await atualizarPedido(selecionadoId, { statusPedido: STATUS_ATENDIDO });
            setPedidos((atual) => atual.filter((p) => p.id !== selecionadoId));
            setAviso({
                tipo: "sucesso",
                texto: `Pedido ${String(selecionadoId).padStart(3, "0")} marcado como entregue.`
            });
            setSelecionadoId(null);
            setDetalhe(null);
        } catch (e) {
            setAviso({ tipo: "erro", texto: e.message });
        } finally {
            setMarcando(false);
        }
    }

    const urgentes = pedidos.filter(
        (p) => p.dataPrevista && diasAte(p.dataPrevista) <= 2
    ).length;
    const proxima = pedidos[0]?.dataPrevista ? formatarDia(pedidos[0].dataPrevista) : "—";

    // painel de detalhes
    const cliente = detalhe ? clientesPorId[detalhe.idCliente] : null;

    const textoPedido = detalhe?.itens
        ?.map((item) => {
            const nome = produtosPorId[item.idProduto] ?? `Produto ${item.idProduto}`;
            const extras = [
                item.peso ? `${item.peso} kg` : null,
                item.tipoMassa ? `massa: ${item.tipoMassa}` : null,
                item.tipoRecheio ? `recheio: ${item.tipoRecheio}` : null,
                item.tema ? `tema: ${item.tema}` : null
            ].filter(Boolean);
            return `${item.quantidade}x ${nome}${extras.length ? " — " + extras.join(", ") : ""}`;
        })
        .join("\n");

    const textoEntrega = detalhe
        ? detalhe.formaEntrega === "ENTREGA"
            ? `${formatarData(detalhe.dataPrevista)} · Entrega: ${[
                  detalhe.entregaRua,
                  detalhe.entregaNumCasa,
                  detalhe.entregaBairro
              ]
                  .filter(Boolean)
                  .join(", ")}`
            : `${formatarData(detalhe.dataPrevista)} · Retirada`
        : "";

    return (
        <div className="pendentes-container">


            <main className="pendentes-main">

                {/* LISTA */}
                <section className="pendentes-esquerda">

                    <h1>Pedidos Pendentes</h1>

                    {aviso && (
                        <p className={`aviso-pendentes aviso-${aviso.tipo}`} role="status">
                            {aviso.texto}
                        </p>
                    )}

                    <div className="resumo-pendentes">

                        <h2>Resumo</h2>

                        <div className="resumo-cards">

                            <div className="resumo-card">
                                <span>Pendentes</span>
                                <strong>{pedidos.length}</strong>
                            </div>

                            <div className="resumo-card">
                                <span>Urgentes</span>
                                <strong>{urgentes}</strong>
                            </div>

                            <div className="resumo-card resumo-entrega">
                                <span>Prox. Entrega</span>
                                <strong>{proxima}</strong>
                            </div>

                        </div>

                    </div>

                    <div className="tabela-pendentes">

                        <div className="tabela-pendentes-header">
                            <div>#</div>
                            <div>Cliente</div>
                            <div>Status</div>
                            <div>Data</div>
                            <div>Prazo</div>
                        </div>

                        {carregando && <p className="estado-pendentes">Carregando...</p>}

                        {!carregando && erro && <p className="estado-pendentes">{erro}</p>}

                        {!carregando && !erro && pedidos.length === 0 && (
                            <p className="estado-pendentes">
                                Não há pedidos pendentes no momento.
                            </p>
                        )}

                        {!carregando && !erro && pedidos.map((pedido) => {
                            const dias = pedido.dataPrevista ? diasAte(pedido.dataPrevista) : null;
                            const rotulo = dias === null ? "" : rotuloPrazo(dias);

                            return (
                                <div
                                    className={
                                        "linha-pendente" +
                                        (pedido.id === selecionadoId ? " linha-selecionada" : "")
                                    }
                                    key={pedido.id}
                                    onClick={() => selecionar(pedido.id)}
                                >
                                    <div>{String(pedido.id).padStart(3, "0")}</div>

                                    <div>
                                        {pedido.nomeCliente ??
                                            clientesPorId[pedido.idCliente]?.nome ??
                                            "—"}
                                    </div>

                                    <div>
                                        {STATUS[pedido.statusPedido]?.rotulo ??
                                            pedido.statusPedido ??
                                            "—"}
                                    </div>

                                    <div>{formatarDia(pedido.dataPrevista)}</div>

                                    <div className="prazo-pedido">
                                        {rotulo ? (
                                            <span className="prazo-urgente">{rotulo}</span>
                                        ) : (
                                            <span>{dias === null ? "—" : `em ${dias} dias`}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* DETALHES */}
                <section className="detalhes-pendente">

                    <h1>Detalhes</h1>

                    {!selecionadoId && (
                        <p className="estado-pendentes">Selecione um pedido na lista.</p>
                    )}

                    {carregandoDetalhe && <p className="estado-pendentes">Carregando...</p>}

                    <div className="campo-detalhe">
                        <label>Cliente</label>
                        <input type="text" readOnly value={cliente?.nome ?? ""} />
                    </div>

                    <div className="campo-detalhe">
                        <label>Telefone</label>
                        <input type="text" readOnly value={cliente?.telefones?.[0] ?? ""} />
                    </div>

                    <div className="campo-detalhe">
                        <label>Data do Pedido</label>
                        <input
                            type="text"
                            readOnly
                            value={detalhe?.dataPedido ? formatarData(detalhe.dataPedido) : ""}
                        />
                    </div>

                    <div className="campo-detalhe">
                        <label>Entrega/Retirada</label>
                        <input type="text" readOnly value={textoEntrega} />
                    </div>

                    <div className="campo-detalhe">
                        <label>Pedido</label>
                        <textarea readOnly value={textoPedido ?? ""}></textarea>
                    </div>

                    <div className="campo-detalhe">
                        <label>Observações</label>
                        <textarea className="campo-observacoes" readOnly></textarea>
                    </div>

                    <div className="acoes-detalhe">

                        <label className="marcar-atendida">
                            <input
                                type="checkbox"
                                checked={false}
                                disabled={!detalhe || marcando}
                                onChange={marcarAtendido}
                            />
                            <span className="checkbox-personalizado"></span>
                            <span>
                                {marcando ? "Salvando..." : "Marcar como entregue?"}
                            </span>
                        </label>

                        <button
                            className="botao-editar"
                            disabled={!detalhe || detalhe.statusPedido !== "PENDENTE"}
                            title={
                                detalhe && detalhe.statusPedido !== "PENDENTE"
                                    ? `Pedido já está ${detalhe.statusPedido}. Só PENDENTE pode ser aprovado.`
                                    : "Aprovar pedido"
                            }
                            onClick={() => abrirAprovar?.(selecionadoId)}
                        >
                            Aprovar
                        </button>

                        <button
                            className="botao-editar"
                            disabled={!detalhe}
                            onClick={() => abrirDetalhe?.(selecionadoId)}
                        >
                            Editar
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Pendentes;