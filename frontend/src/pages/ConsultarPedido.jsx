import "../styles/ConsultarPedido.css";

function ConsultarPedido({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    fecharConsultarPedido
}) {
    const pedidos = [
        {
            numero: "001",
            cliente: "Maria Silva",
            data: "01/09",
            entrega: "25/09",
            valor: "R$ 205,99",
            status: "Entregue"
        },
        {
            numero: "002",
            cliente: "João Souza",
            data: "01/09",
            entrega: "19/09",
            valor: "R$ 150,00",
            status: "Pendente"
        },
        {
            numero: "003",
            cliente: "Ana Costa",
            data: "15/09",
            entrega: "12/10",
            valor: "R$ 170,50",
            status: "Pendente"
        },
        {
            numero: "004",
            cliente: "Carlos Lima",
            data: "16/09",
            entrega: "14/10",
            valor: "R$ 300,25",
            status: "Pendente"
        },
        {
            numero: "005",
            cliente: "Beatriz Alves",
            data: "05/09",
            entrega: "25/10",
            valor: "R$ 100,00",
            status: "Pendente"
        }
    ];

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

                        <svg
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

                        <svg
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

                    <button className="filtro-hoje">
                        Hoje
                    </button>

                    <button className="filtro-semana">
                        Esta Sem.
                    </button>

                    <button className="filtro-mes">
                        Este Mês
                    </button>

                    <button className="filtro-30dias">
                        Últim. 30d
                    </button>

                </div>


                {/* =========================
                    BOTÕES
                ========================= */}

                <div className="botoes-filtro">

                    <button className="botao-buscar">
                        Buscar
                    </button>

                    <button className="botao-limpar">
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
                        </div>

                        <div className="card-periodo">
                            <span>Valor Total (R$)</span>
                        </div>

                        <div className="card-periodo">
                            <span>Pedidos Pendentes</span>
                        </div>

                    </div>

                </section>


                {/* =========================
                    TABELA
                ========================= */}

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


                    {/* PEDIDOS */}
                    {pedidos.map((pedido) => (

                        <div
                            className="pedido-linha"
                            key={pedido.numero}
                        >

                            <div>
                                {pedido.numero}
                            </div>

                            <div>
                                {pedido.cliente}
                            </div>

                            <div>
                                {pedido.data}
                            </div>

                            <div>
                                {pedido.entrega}
                            </div>

                            <div>
                                {pedido.valor}
                            </div>

                            <div
                                className={
                                    pedido.status === "Entregue"
                                        ? "status-entregue"
                                        : "status-pendente"
                                }
                            >
                                {pedido.status}
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
                                    title="Excluir pedido"
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
                            Mostrando 1–5 de 100 Pedidos
                        </span>

                        <div className="paginacao">

                            <button className="pagina-seta">
                                ←
                            </button>

                            <button className="pagina-ativa">
                                1
                            </button>

                            <button>
                                2
                            </button>

                            <button>
                                3
                            </button>

                            <button>
                                50
                            </button>

                            <button className="pagina-seta">
                                →
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ConsultarPedido;