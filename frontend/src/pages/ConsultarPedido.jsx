import { useEffect, useState } from "react";
import "../styles/ConsultarPedido.css";
import {
    atualizarPedido,
    buscarClientes,
    consultarPedidos
} from "../services/api";
import { STATUS, estaPendente, formatarDia } from "../utils/Pedidos";

const POR_PAGINA = 5;

function paraISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function ConsultarPedido({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    abrirAlertas,
    abrirDetalhe,
    fecharConsultarPedido
}) {
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [pagina, setPagina] = useState(1);
    const [clientesPorId, setClientesPorId] = useState({});
    const [aCancelar, setACancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);
    const [aviso, setAviso] = useState("");

    async function buscar(de = inicio, ate = fim) {
        setErro("");
        setAviso("");

        if (de && ate && de > ate) {
            setErro("A data inicial não pode ser posterior à data final.");
            setPedidos([]);
            setPagina(1);
            setCarregando(false);
            return;
        }

        setCarregando(true);

        try {
            const dados = await consultarPedidos({ inicio: de, fim: ate });

            const filtrados = dados.filter((pedido) => {
                const dia = pedido.dataPrevista?.slice(0, 10) ?? "";

                return (
                    (!de || (dia && dia >= de)) &&
                    (!ate || (dia && dia <= ate))
                );
            });

            setPedidos(filtrados);
            setPagina(1);
        } catch (e) {
            setPedidos([]);
            setErro(e.message || "Não foi possível carregar os pedidos.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscar("", "");

        let cancelado = false;

        buscarClientes("")
            .then((lista) => {
                if (cancelado) return;

                const mapa = {};

                lista.forEach((cliente) => {
                    mapa[cliente.id] = cliente;
                });

                setClientesPorId(mapa);
            })
            .catch(() => {
                if (!cancelado) {
                    setClientesPorId({});
                }
            });

        return () => {
            cancelado = true;
        };
    }, []);

    async function confirmarCancelamento() {
        if (!aCancelar) return;

        setCancelando(true);
        setAviso("");
        setErro("");

        try {
            await atualizarPedido(aCancelar.id, {
                statusPedido: "CANCELADO"
            });

            setPedidos((anteriores) =>
                anteriores.map((pedido) =>
                    pedido.id === aCancelar.id
                        ? { ...pedido, statusPedido: "CANCELADO" }
                        : pedido
                )
            );

            setAviso(
                `Pedido #${String(aCancelar.id).padStart(3, "0")} cancelado com sucesso.`
            );

            setACancelar(null);
        } catch (e) {
            setErro(e.message || "Não foi possível cancelar o pedido.");
        } finally {
            setCancelando(false);
        }
    }

    function aplicarPeriodo(tipo) {
        const hoje = new Date();
        const dataFim = paraISO(hoje);
        const dataInicio = new Date(hoje);

        if (tipo === "hoje") {
            setInicio(dataFim);
            setFim(dataFim);
            buscar(dataFim, dataFim);
            return;
        }

        if (tipo === "semana") {
            dataInicio.setDate(hoje.getDate() - 6);
        } else if (tipo === "mes") {
            dataInicio.setDate(1);
        } else if (tipo === "30dias") {
            dataInicio.setDate(hoje.getDate() - 29);
        }

        const inicioISO = paraISO(dataInicio);

        setInicio(inicioISO);
        setFim(dataFim);
        buscar(inicioISO, dataFim);
    }

    function limparFiltros() {
        setInicio("");
        setFim("");
        buscar("", "");
    }

    const totalPaginas = Math.max(
        1,
        Math.ceil(pedidos.length / POR_PAGINA)
    );

    const pedidosPagina = pedidos.slice(
        (pagina - 1) * POR_PAGINA,
        pagina * POR_PAGINA
    );

    const pedidosPendentes = pedidos.filter((pedido) =>
        estaPendente(pedido.statusPedido)
    ).length;

    const primeiro = pedidos.length === 0
        ? 0
        : (pagina - 1) * POR_PAGINA + 1;

    const ultimo = Math.min(pagina * POR_PAGINA, pedidos.length);

    return (
        <div className="consultar-pedido-container">

            <main className="consultar-pedido-main">
                <div className="consultar-pedido-titulo">
                    <h1>Consultar Pedidos</h1>
                    <p>Consulte e acompanhe os pedidos cadastrados.</p>
                </div>

                <section className="filtros-pedidos">
                    <div className="filtro-data">
                        <label htmlFor="data-inicio">Data inicial</label>
                        <input
                            id="data-inicio"
                            type="date"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                        />
                    </div>

                    <div className="filtro-data">
                        <label htmlFor="data-fim">Data final</label>
                        <input
                            id="data-fim"
                            type="date"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                        />
                    </div>

                    <button onClick={() => buscar()}>
                        Buscar
                    </button>

                    <button onClick={limparFiltros}>
                        Limpar
                    </button>

                    <div className="filtros-rapidos">
                        <button onClick={() => aplicarPeriodo("hoje")}>
                            Hoje
                        </button>

                        <button onClick={() => aplicarPeriodo("semana")}>
                            Últimos 7 dias
                        </button>

                        <button onClick={() => aplicarPeriodo("mes")}>
                            Este mês
                        </button>

                        <button onClick={() => aplicarPeriodo("30dias")}>
                            Últimos 30 dias
                        </button>
                    </div>
                </section>

                {aviso && (
                    <p className="pedido-estado" role="status">
                        {aviso}
                    </p>
                )}

                {erro && (
                    <div className="pedido-estado" role="alert">
                        <p>{erro}</p>

                        <button
                            type="button"
                            onClick={() => buscar()}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                <section className="resumo-pedidos">
                    <div>
                        <span>Total de pedidos</span>
                        <strong>{pedidos.length}</strong>
                    </div>

                    <div>
                        <span>Valor total</span>
                        <strong>—</strong>
                    </div>

                    <div>
                        <span>Pedidos pendentes</span>
                        <strong>{pedidosPendentes}</strong>
                    </div>
                </section>

                <section className="tabela-pedidos">
                    <div className="tabela-pedidos-header">
                        <div>#</div>
                        <div>Cliente</div>
                        <div>Data Pedi.</div>
                        <div>Entrega</div>
                        <div>Valor (R$)</div>
                        <div>Status</div>
                        <div>Ações</div>
                    </div>

                    {carregando && (
                        <p className="pedido-estado" role="status">
                            Carregando pedidos...
                        </p>
                    )}

                    {!carregando && !erro && pedidos.length === 0 && (
                        <p className="pedido-estado" role="status">
                            Nenhum pedido encontrado para esse período.
                        </p>
                    )}

                    {!carregando &&
                        !erro &&
                        pedidosPagina.map((pedido) => (
                            <div
                                className="pedido-linha"
                                key={pedido.id}
                            >
                                <div>
                                    {String(pedido.id).padStart(3, "0")}
                                </div>

                                <div>
                                    {pedido.nomeCliente ??
                                        clientesPorId[pedido.idCliente]?.nome ??
                                        `Cliente #${pedido.idCliente ?? "—"}`}
                                </div>

                                <div>
                                    {formatarDia(pedido.dataPedido)}
                                </div>

                                <div>
                                    {formatarDia(pedido.dataPrevista)}
                                </div>

                                <div>—</div>

                                <div
                                    className={
                                        STATUS[pedido.statusPedido]?.classe ?? ""
                                    }
                                >
                                    {STATUS[pedido.statusPedido]?.rotulo ??
                                        pedido.statusPedido ??
                                        "—"}
                                </div>

                                <div className="acoes-pedido">
                                    <button
                                        type="button"
                                        className="botao-visualizar"
                                        title="Visualizar pedido"
                                        onClick={() => {
                                            if (abrirDetalhe) {
                                                abrirDetalhe(pedido.id);
                                            } else {
                                                setAviso(
                                                    "A visualização detalhada não está disponível."
                                                );
                                            }
                                        }}
                                    >
                                        👁
                                    </button>

                                    {estaPendente(pedido.statusPedido) && (
                                        <button
                                            type="button"
                                            className="botao-excluir"
                                            title="Cancelar pedido"
                                            onClick={() => setACancelar(pedido)}
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </section>

                {!carregando && !erro && pedidos.length > 0 && (
                    <footer className="paginacao-pedidos">
                        <span>
                            Mostrando {primeiro}–{ultimo} de {pedidos.length} pedidos
                        </span>

                        <div>
                            <button
                                disabled={pagina <= 1}
                                onClick={() => setPagina((atual) => atual - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {pagina} de {totalPaginas}
                            </span>

                            <button
                                disabled={pagina >= totalPaginas}
                                onClick={() => setPagina((atual) => atual + 1)}
                            >
                                Próxima
                            </button>
                        </div>
                    </footer>
                )}
            </main>

            {aCancelar && (
                <div className="modal-fundo">
                    <div className="modal-cancelar-pedido">
                        <h2>Cancelar pedido</h2>

                        <p>
                            Deseja realmente cancelar o pedido #
                            {String(aCancelar.id).padStart(3, "0")}?
                        </p>

                        <p>
                            Cliente:{" "}
                            {aCancelar.nomeCliente ??
                                clientesPorId[aCancelar.idCliente]?.nome ??
                                `Cliente #${aCancelar.idCliente ?? "—"}`}
                        </p>

                        <div className="modal-acoes">
                            <button
                                type="button"
                                onClick={() => setACancelar(null)}
                                disabled={cancelando}
                            >
                                Voltar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarCancelamento}
                                disabled={cancelando}
                            >
                                {cancelando
                                    ? "Cancelando..."
                                    : "Confirmar cancelamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConsultarPedido;