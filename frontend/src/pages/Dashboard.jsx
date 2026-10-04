import "../styles/Dashboard.css";

function Dashboard({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    fecharDashboard
}) {
    return (
        <div className="dashboard-container">

            {/* =========================
                BARRA SUPERIOR
            ========================= */}

            <header className="dashboard-header">

                {/* LOGO */}
                <div className="dashboard-logo">
                    <div className="logo-circulo">
                        <span>GM</span>
                    </div>
                </div>


                {/* MENU */}
                <nav className="dashboard-menu">

                    <button onClick={abrirDashboard}>
                        Dashboard
                    </button>

                    <button onClick={abrirNovoPedido}>
                        Novo Pedido
                    </button>

                    <button onClick={abrirConsultarPedido}>
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


                {/* NOTIFICAÇÃO */}
                <button className="botao-notificacao">
                    🔔
                </button>


                {/* FECHAR */}
                <button
                    className="botao-fechar-dashboard"
                    onClick={fecharDashboard}
                >
                    ×
                </button>

            </header>


            {/* =========================
                CONTEÚDO
            ========================= */}

            <main className="dashboard-main">

                <h1>Alertas</h1>


                {/* =========================
                    RESUMO
                ========================= */}

                <section className="resumo-alertas">

                    <h2>Resumo</h2>

                    <div className="cards-resumo">

                        <div className="card-resumo hoje">
                            <span>⚠ Hoje</span>
                        </div>

                        <div className="card-resumo amanha">
                            <span>⚠ Amanhã</span>
                        </div>

                        <div className="card-resumo proximos">
                            <span>◷ Próximos 3 dias</span>
                        </div>

                    </div>

                </section>


                {/* =========================
                    VENCE HOJE
                ========================= */}

                <section className="grupo-alertas">

                    <h3 className="titulo-hoje">
                        Vence Hoje
                    </h3>

                    <div className="alerta-pedido">

                        <span>
                            #003 Ana Costa – Bolo chocolate 2kg – R$ 200,00 – Entrega
                        </span>

                        <button>
                            Ver pedido
                        </button>

                    </div>

                </section>


                {/* =========================
                    VENCE AMANHÃ
                ========================= */}

                <section className="grupo-alertas">

                    <h3 className="titulo-amanha">
                        Vence Amanhã
                    </h3>

                    <div className="alerta-pedido">

                        <span>
                            #000 Nome_Cliente - Descrição_Pedido - ValorTotal_Pedido - TipoEntrega
                        </span>

                        <button>
                            Ver pedido
                        </button>

                    </div>

                </section>


                {/* =========================
                    PRÓXIMOS 3 DIAS
                ========================= */}

                <section className="grupo-alertas">

                    <h3 className="titulo-proximos">
                        Próximos 3 Dias
                    </h3>

                    <div className="alerta-pedido">

                        <span>
                            #000 Nome_Cliente - Descrição_Pedido - ValorTotal_Pedido - TipoEntrega
                        </span>

                        <button>
                            Ver pedido
                        </button>

                    </div>

                </section>


                {/* =========================
                    MARCAR COMO LIDOS
                ========================= */}

                <button className="botao-marcar-lidos">
                    Marcar Todos Como
                    <br />
                    Lidos
                </button>

            </main>

        </div>
    );
}

export default Dashboard;