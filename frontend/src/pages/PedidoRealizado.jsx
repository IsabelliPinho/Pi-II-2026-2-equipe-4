import "../styles/PedidoRealizado.css";

function PedidoRealizado({ voltarPedido }) {
    return (
        <div className="pedido-realizado-container">

            {/* BARRA SUPERIOR */}
            <header className="pedido-realizado-header">

                <button
                    className="botao-fechar-realizado"
                    onClick={voltarPedido}
                >
                    ×
                </button>

            </header>


            {/* CONTEÚDO */}
            <main className="pedido-realizado-conteudo">

                <div className="circulo-pedido-realizado">

                    <h1>Pedido Realizado!</h1>

                    <h2>Aguardar Confirmação</h2>

                </div>

            </main>

        </div>
    );
}

export default PedidoRealizado;