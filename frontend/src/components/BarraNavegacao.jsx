import "../styles/BarraNavegacao.css";

const ITENS = [
    { tela: "dashboard", rotulo: "Dashboard", acao: "abrirDashboard" },
    { tela: "pedido", rotulo: "Novo Pedido", acao: "abrirNovoPedido" },
    { tela: "consultarPedido", rotulo: "Consultar Pedido", acao: "abrirConsultarPedido" },
    { tela: "pendentes", rotulo: "Pendentes", acao: "abrirPendentes" },
    { tela: "financeiro", rotulo: "Controle Financeiro", acao: "abrirFinanceiro" },
    { tela: "clientes", rotulo: "Clientes", acao: "abrirClientes" }
];

// Barra fixa no topo, compartilhada pelas telas do painel
function BarraNavegacao({ telaAtiva, fechar, ...acoes }) {
    return (
        <header className="barra-nav">
            <div className="barra-nav-logo">
                <div className="barra-nav-logo-circulo">
                    <span>GM</span>
                </div>
            </div>

            <nav className="barra-nav-menu">
                {ITENS.map((item) => (
                    <button
                        key={item.tela}
                        type="button"
                        className={item.tela === telaAtiva ? "menu-ativo" : ""}
                        onClick={acoes[item.acao]}
                    >
                        {item.rotulo}
                    </button>
                ))}
            </nav>

            <button
                type="button"
                className="barra-nav-sino"
                onClick={acoes.abrirAlertas}
                aria-label="Alertas"
            >
                🔔
            </button>

            <button
                type="button"
                className="barra-nav-fechar"
                onClick={fechar}
                aria-label="Fechar"
            >
                ×
            </button>
        </header>
    );
}

export default BarraNavegacao;