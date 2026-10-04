import "../styles/Pendentes.css";

function Pendentes({ voltarDashboard }) {

    const pedidos = [
        {
            numero: "002",
            cliente: "João Souza",
            data: "19/09",
            prazo: "Amanhã"
        },
        {
            numero: "003",
            cliente: "Ana Costa",
            data: "12/10",
            prazo: ""
        },
        {
            numero: "004",
            cliente: "Carlos Lima",
            data: "14/10",
            prazo: ""
        },
        {
            numero: "005",
            cliente: "Beatriz Alves",
            data: "25/10",
            prazo: ""
        }
    ];

    return (
        <div className="pendentes-container">

            <header className="pendentes-header">

                <button
                    className="pendentes-fechar"
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

            <main className="pendentes-main">

                <section className="pendentes-esquerda">

                    <h1>Pedidos Pendentes</h1>

                    <div className="resumo-pendentes">

                        <h2>Resumo</h2>

                        <div className="resumo-cards">

                            <div className="resumo-card">
                                <span>Pendentes</span>
                            </div>

                            <div className="resumo-card">
                                <span>Urgentes</span>
                            </div>

                            <div className="resumo-card resumo-entrega">
                                <span>Prox. Entrega</span>

                                <div className="data-resumo">
                                    <span>/</span>
                                    <span>/</span>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="tabela-pendentes">

                        <div className="tabela-pendentes-header">
                            <div>#</div>
                            <div>Cliente</div>
                            <div>Data</div>
                            <div>Prazo</div>
                        </div>

                        {pedidos.map((pedido) => (

                            <div
                                className="linha-pendente"
                                key={pedido.numero}
                            >

                                <div>{pedido.numero}</div>

                                <div>{pedido.cliente}</div>

                                <div>{pedido.data}</div>

                                <div className="prazo-pedido">

                                    {pedido.prazo ? (
                                        <span className="prazo-urgente">
                                            {pedido.prazo}
                                        </span>
                                    ) : (
                                        <button
                                            className="botao-calendario"
                                            aria-label="Selecionar data"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="3"
                                                    y="5"
                                                    width="18"
                                                    height="16"
                                                    rx="2"
                                                />
                                                <line
                                                    x1="3"
                                                    y1="10"
                                                    x2="21"
                                                    y2="10"
                                                />
                                                <line
                                                    x1="8"
                                                    y1="3"
                                                    x2="8"
                                                    y2="7"
                                                />
                                                <line
                                                    x1="16"
                                                    y1="3"
                                                    x2="16"
                                                    y2="7"
                                                />
                                                <circle
                                                    cx="8"
                                                    cy="14"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="14"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                                <circle
                                                    cx="16"
                                                    cy="14"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                                <circle
                                                    cx="8"
                                                    cy="18"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="18"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                                <circle
                                                    cx="16"
                                                    cy="18"
                                                    r=".5"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                <section className="detalhes-pendente">

                    <h1>Detalhes</h1>

                    <div className="campo-detalhe">
                        <label>Cliente</label>
                        <input type="text" />
                    </div>

                    <div className="campo-detalhe">
                        <label>Telefone</label>
                        <input type="text" />
                    </div>

                    <div className="campo-detalhe campo-data-detalhe">
                        <label>Data do Pedido</label>

                        <div className="input-data">
                            <span>/</span>
                            <span>/</span>
                        </div>
                    </div>

                    <div className="campo-detalhe campo-data-detalhe">
                        <label>Entrega/Retirada</label>

                        <div className="input-data">
                            <span>/</span>
                            <span>/</span>
                        </div>
                    </div>

                    <div className="campo-detalhe">
                        <label>Pedido</label>
                        <textarea></textarea>
                    </div>

                    <div className="campo-detalhe">
                        <label>Observações</label>
                        <textarea className="campo-observacoes"></textarea>
                    </div>

                    <div className="acoes-detalhe">

                        <label className="marcar-atendida">

                            <input type="checkbox" />

                            <span className="checkbox-personalizado"></span>

                            <span>Marcar como atendida?</span>

                        </label>

                        <button className="botao-editar">
                            Editar
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Pendentes;