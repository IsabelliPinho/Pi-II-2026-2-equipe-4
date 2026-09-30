import "../styles/DetalhePedido.css";

function DetalhePedido({
    voltarDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    editarPedido
}) {
    return (
        <div className="detalhe-pedido-container">

            {/* CABEÇALHO */}

            <header className="detalhe-pedido-header">

                <div className="detalhe-logo">
                    <div className="detalhe-logo-circulo">
                        <span>GM</span>
                    </div>
                </div>

                <nav className="detalhe-menu">

                    <button onClick={voltarDashboard}>
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

                    <button
                        className="menu-ativo"
                        onClick={abrirFinanceiro}
                    >
                        Controle Financeiro
                    </button>

                    <button onClick={abrirClientes}>
                        Clientes
                    </button>

                </nav>

                {/* NOTIFICAÇÃO */}

                <button
                    className="detalhe-notificacao"
                    aria-label="Notificações"
                >
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
                    className="detalhe-fechar"
                    onClick={voltarDashboard}
                    aria-label="Fechar"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    >
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                </button>

            </header>


            {/* CONTEÚDO */}

            <main className="detalhe-pedido-main">

                <h1>Detalhes do Pedido</h1>

                <div className="titulo-pedido">
                    Pedido #003
                </div>

                <button
                    className="botao-editar-pedido"
                    onClick={editarPedido}
                >
                    Editar
                </button>


                {/* PRIMEIRA LINHA */}

                <div className="linha-cards">

                    {/* CLIENTE */}

                    <section className="card-detalhe card-cliente">

                        <h2>Cliente</h2>

                        <div className="cliente-conteudo">

                            <div className="cliente-informacoes">
                                <p>Ana Costa</p>
                                <p>(xx) xxxxx-xxxx</p>
                                <p>anacosta@gmail.com</p>
                            </div>

                            <button className="botao-ver-cliente">
                                Ver
                                <br />
                                Cliente
                            </button>

                        </div>

                    </section>


                    {/* STATUS */}

                    <section className="card-detalhe card-status">

                        <h2>Status</h2>

                        <div className="status-conteudo">

                            <div className="status-esquerda">

                                <p className="status-pendente">
                                    Pendente
                                </p>

                                <p>
                                    Vence: 12/10
                                </p>

                            </div>

                            <div className="status-direita">

                                <p>
                                    Pedido: 15/09
                                </p>

                                <p>
                                    Entrega: 12/10
                                </p>

                            </div>

                        </div>

                    </section>

                </div>


                {/* SEGUNDA LINHA */}

                <div className="linha-cards">

                    {/* DESCRIÇÃO */}

                    <section className="card-detalhe card-descricao">

                        <h2>Descrição do Pedido</h2>

                        <div className="descricao-conteudo">

                            <p>
                                Bolo de chocolate com morango, 2 kg
                            </p>

                            <p>
                                Recheio: Brigadeiro
                            </p>

                            <p>
                                Cobertura: Chantilly com morangos
                            </p>

                        </div>

                    </section>


                    {/* OBSERVAÇÕES */}

                    <section className="card-detalhe card-observacoes">

                        <h2>Observações</h2>

                        <div className="observacoes-conteudo">

                            <p>
                                Sem lactose, escrever: “Parabéns Ana”
                            </p>

                            <p>
                                em cima
                            </p>

                        </div>

                    </section>

                </div>


                {/* TERCEIRA LINHA */}

                <section className="card-detalhe card-tipo">

                    <h2>Tipo</h2>

                    <p className="tipo-titulo">
                        Entrega
                    </p>

                    <p>
                        Rua X, Nº X - Bairro Z
                    </p>

                </section>

            </main>

        </div>
    );
}

export default DetalhePedido;