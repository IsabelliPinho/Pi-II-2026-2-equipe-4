import { useEffect, useRef, useState } from "react";
import "../styles/ConsultarPedido.css";
import { atualizarPedido, consultarPedidos } from "../services/api";

const POR_PAGINA = 5;

const STATUS = {
    PENDENTE: { rotulo: "Pendente", classe: "status-pendente" },
    ATENDIDO: { rotulo: "Atendido", classe: "status-entregue" },
    CANCELADO: { rotulo: "Cancelado", classe: "status-cancelado" }
};

// Date -> "YYYY-MM-DD" no fuso local
function paraISO(d) {
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
}

// "2026-09-25T15:00:00" -> "25/09"
function formatarDia(iso) {
    return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

function ConsultarPedido({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    fecharConsultarPedido
}) {
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [pagina, setPagina] = useState(1);

    // RF009: cancelamento
    const [aCancelar, setACancelar] = useState(null); // pedido aguardando confirmação
    const [cancelando, setCancelando] = useState(false);
    const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", texto }

    const inicioRef = useRef(null);
    const fimRef = useRef(null);

    // RF003: consulta por mês/intervalo. Sem datas = todos os pedidos.
    async function buscar(de = inicio, ate = fim) {
        setErro("");
        setAviso(null);

        if (de && ate && de > ate) {
            setPedidos([]);
            setErro("Data inválida: a data inicial é maior que a final.");
            setCarregando(false);
            return;
        }

        setCarregando(true);
        try {
            const dados = await consultarPedidos({ inicio: de, fim: ate });
            // garante o filtro por período mesmo que o backend ignore inicio/fim
            const filtrados = dados.filter((p) => {
                const dia = p.dataPrevista.slice(0, 10);
                return (!de || dia >= de) && (!ate || dia <= ate);
            });
            setPedidos(filtrados);
            setPagina(1);
        } catch (e) {
            setPedidos([]);
            setErro(e.message);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscar("", "");
    }, []);

    // RF009: PATCH /pedidos/{id} com statusPedido = CANCELADO
    async function confirmarCancelamento() {
        const pedido = aCancelar;
        setCancelando(true);
        try {
            await atualizarPedido(pedido.id, { statusPedido: "CANCELADO" });
            setPedidos((atual) =>
                atual.map((p) =>
                    p.id === pedido.id ? { ...p, statusPedido: "CANCELADO" } : p
                )
            );
            setAviso({
                tipo: "sucesso",
                texto: `Pedido ${String(pedido.id).padStart(3, "0")} cancelado com sucesso.`
            });
        } catch (e) {
            // ex.: 409 se o pedido não estiver mais PENDENTE
            setAviso({ tipo: "erro", texto: e.message });
        } finally {
            setCancelando(false);
            setACancelar(null);
        }
    }

    function aplicarPeriodo(de, ate) {
        const a = paraISO(de);
        const b = paraISO(ate);
        setInicio(a);
        setFim(b);
        buscar(a, b);
    }

    function filtroHoje() {
        const h = new Date();
        aplicarPeriodo(h, h);
    }

    function filtroSemana() {
        const h = new Date();
        const dif = (h.getDay() + 6) % 7; // semana de segunda a domingo
        const seg = new Date(h.getFullYear(), h.getMonth(), h.getDate() - dif);
        const dom = new Date(seg.getFullYear(), seg.getMonth(), seg.getDate() + 6);
        aplicarPeriodo(seg, dom);
    }

    function filtroMes() {
        const h = new Date();
        aplicarPeriodo(
            new Date(h.getFullYear(), h.getMonth(), 1),
            new Date(h.getFullYear(), h.getMonth() + 1, 0)
        );
    }

    function filtro30Dias() {
        const h = new Date();
        aplicarPeriodo(new Date(h.getFullYear(), h.getMonth(), h.getDate() - 29), h);
    }

    function limpar() {
        setInicio("");
        setFim("");
        buscar("", "");
    }

    const totalPaginas = Math.max(1, Math.ceil(pedidos.length / POR_PAGINA));
    const visiveis = pedidos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
    const pendentes = pedidos.filter((p) => p.statusPedido === "PENDENTE").length;
    const primeiro = pedidos.length === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
    const ultimo = Math.min(pagina * POR_PAGINA, pedidos.length);

    const numerosPagina = [];
    for (let n = Math.max(1, pagina - 2); n <= Math.min(totalPaginas, pagina + 2); n++) {
        numerosPagina.push(n);
    }

    return (
        <div className="consultar-container">

            {/* =========================
                BARRA SUPERIOR
            ========================= */}

            <header className="consultar-header">

                {/* LOGO */}
                <div className="consultar-logo">
                    <div className="logo-circulo-consultar">
                        <span>GM</span>
                    </div>
                </div>


                {/* MENU */}
                <nav className="consultar-menu">

                    <button onClick={abrirDashboard}>
                        Dashboard
                    </button>

                    <button onClick={abrirNovoPedido}>
                        Novo Pedido
                    </button>

                    <button
                        className="menu-ativo"
                        onClick={abrirConsultarPedido}
                    >
                        Consultar Pedido
                    </button>

                    <button onClick={abrirPendentes}>
                        Pendentes
                    </button>

                    <button onClick={abrirFinanceiro}>
                        Controle Financeiro
                    </button>

                    <button onClick={abrirClientes}>
                        Clientes
                    </button>

                </nav>


                {/* SINO */}
                <button className="consultar-notificacao">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>
                </button>


                {/* FECHAR */}
                <button
                    className="botao-fechar-consultar"
                    onClick={fecharConsultarPedido}
                >
                    ×
                </button>

            </header>


            {/* =========================
                CONTEÚDO
            ========================= */}

            <main className="consultar-main">

                <h1>Consultar Pedido</h1>


                {/* =========================
                    FILTROS DE DATA
                ========================= */}

                <div className="filtros-data">

                    {/* DE */}
                    <div className="campo-data">

                        <span>De</span>

                        <input
                            type="date"
                            ref={inicioRef}
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                        />

                        <svg
                            onClick={() => inicioRef.current?.showPicker?.()}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="3" x2="8" y2="7" />
                            <line x1="16" y1="3" x2="16" y2="7" />
                            <line x1="7" y1="14" x2="7" y2="14" />
                            <line x1="12" y1="14" x2="12" y2="14" />
                            <line x1="17" y1="14" x2="17" y2="14" />
                            <line x1="7" y1="17" x2="7" y2="17" />
                            <line x1="12" y1="17" x2="12" y2="17" />
                            <line x1="17" y1="17" x2="17" y2="17" />
                        </svg>

                    </div>


                    {/* PARA */}
                    <div className="campo-data">

                        <span>Para</span>

                        <input
                            type="date"
                            ref={fimRef}
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                        />

                        <svg
                            onClick={() => fimRef.current?.showPicker?.()}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="3" x2="8" y2="7" />
                            <line x1="16" y1="3" x2="16" y2="7" />
                            <line x1="7" y1="14" x2="7" y2="14" />
                            <line x1="12" y1="14" x2="12" y2="14" />
                            <line x1="17" y1="14" x2="17" y2="14" />
                            <line x1="7" y1="17" x2="7" y2="17" />
                            <line x1="12" y1="17" x2="12" y2="17" />
                            <line x1="17" y1="17" x2="17" y2="17" />
                        </svg>

                    </div>

                </div>


                {/* =========================
                    FILTROS RÁPIDOS
                ========================= */}

                <div className="filtros-rapidos">

                    <button className="filtro-hoje" onClick={filtroHoje}>
                        Hoje
                    </button>

                    <button className="filtro-semana" onClick={filtroSemana}>
                        Esta Sem.
                    </button>

                    <button className="filtro-mes" onClick={filtroMes}>
                        Este Mês
                    </button>

                    <button className="filtro-30dias" onClick={filtro30Dias}>
                        Últim. 30d
                    </button>

                </div>


                {/* =========================
                    BOTÕES
                ========================= */}

                <div className="botoes-filtro">

                    <button className="botao-buscar" onClick={() => buscar()}>
                        Buscar
                    </button>

                    <button className="botao-limpar" onClick={limpar}>
                        Limpar
                    </button>

                </div>


                {/* =========================
                    RESUMO
                ========================= */}

                <section className="resumo-periodo">

                    <h2>
                        Resumo do Período
                    </h2>

                    <div className="cards-periodo">

                        <div className="card-periodo">
                            <span>Total Pedi.</span>
                            <strong>{pedidos.length}</strong>
                        </div>

                        <div className="card-periodo">
                            <span>Valor Total (R$)</span>
                            <strong>—</strong>
                        </div>

                        <div className="card-periodo">
                            <span>Pedidos Pendentes</span>
                            <strong>{pendentes}</strong>
                        </div>

                    </div>

                </section>


                {/* =========================
                    TABELA
                ========================= */}

                {aviso && (
                    <p className={`aviso-pedido aviso-${aviso.tipo}`} role="status">
                        {aviso.texto}
                    </p>
                )}

                <section className="tabela-pedidos">

                    {/* CABEÇALHO */}
                    <div className="tabela-pedidos-header">

                        <div>#</div>

                        <div>Cliente</div>

                        <div>Data Pedi.</div>

                        <div>Entrega</div>

                        <div>Valor (R$)</div>

                        <div>Status</div>

                        <div>Ações</div>

                    </div>


                    {carregando && <p className="pedido-estado">Carregando...</p>}

                    {!carregando && erro && <p className="pedido-estado">{erro}</p>}

                    {!carregando && !erro && pedidos.length === 0 && (
                        <p className="pedido-estado">
                            Nenhum pedido encontrado no período selecionado.
                        </p>
                    )}

                    {/* PEDIDOS */}
                    {!carregando && !erro && visiveis.map((pedido) => (

                        <div
                            className="pedido-linha"
                            key={pedido.id}
                        >

                            <div>
                                {String(pedido.id).padStart(3, "0")}
                            </div>

                            <div>
                                {pedido.nomeCliente}
                            </div>

                            <div>
                                —
                            </div>

                            <div>
                                {formatarDia(pedido.dataPrevista)}
                            </div>

                            <div>
                                —
                            </div>

                            <div
                                className={STATUS[pedido.statusPedido]?.classe}
                            >
                                {STATUS[pedido.statusPedido]?.rotulo ?? pedido.statusPedido}
                            </div>

                            <div className="acoes-pedido">

                                {/* OLHO */}
                                <button
                                    className="botao-olho-pedido"
                                    title="Visualizar pedido"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                                        <circle cx="12" cy="12" r="2.8" />
                                    </svg>
                                </button>


                                {/* LIXEIRA */}
                                <button
                                    className="botao-lixeira-pedido"
                                    title={
                                        pedido.statusPedido === "PENDENTE"
                                            ? "Cancelar pedido"
                                            : "Só pedidos pendentes podem ser cancelados"
                                    }
                                    disabled={pedido.statusPedido !== "PENDENTE"}
                                    onClick={() => setACancelar(pedido)}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="4 7 20 7" />
                                        <path d="M9 7V4h6v3" />
                                        <path d="M6 7l1 14h10l1-14" />
                                        <line x1="10" y1="11" x2="10" y2="18" />
                                        <line x1="14" y1="11" x2="14" y2="18" />
                                    </svg>
                                </button>

                            </div>

                        </div>

                    ))}


                    {/* =========================
                        RODAPÉ DA TABELA
                    ========================= */}

                    <div className="tabela-rodape">

                        <span>
                            Mostrando {primeiro}–{ultimo} de {pedidos.length} Pedidos
                        </span>

                        <div className="paginacao">

                            <button
                                className="pagina-seta"
                                disabled={pagina === 1}
                                onClick={() => setPagina(pagina - 1)}
                            >
                                ←
                            </button>

                            {numerosPagina.map((n) => (
                                <button
                                    key={n}
                                    className={n === pagina ? "pagina-ativa" : ""}
                                    onClick={() => setPagina(n)}
                                >
                                    {n}
                                </button>
                            ))}

                            <button
                                className="pagina-seta"
                                disabled={pagina === totalPaginas}
                                onClick={() => setPagina(pagina + 1)}
                            >
                                →
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* CONFIRMAÇÃO DE CANCELAMENTO */}
            {aCancelar && (
                <div className="modal-fundo">
                    <div className="modal-cancelar" role="dialog" aria-modal="true">
                        <h2>Cancelar pedido?</h2>

                        <p>
                            Pedido {String(aCancelar.id).padStart(3, "0")} de{" "}
                            {aCancelar.nomeCliente}. Essa ação não pode ser desfeita.
                        </p>

                        <div className="modal-botoes">
                            <button
                                className="modal-voltar"
                                onClick={() => setACancelar(null)}
                                disabled={cancelando}
                            >
                                Voltar
                            </button>

                            <button
                                className="modal-confirmar"
                                onClick={confirmarCancelamento}
                                disabled={cancelando}
                            >
                                {cancelando ? "Cancelando..." : "Cancelar pedido"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ConsultarPedido;