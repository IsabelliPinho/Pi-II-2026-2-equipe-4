import "../styles/Carrinho.css";

function Carrinho({adicionarProduto, realizarPedido, fecharCarrinho, esvaziarCarrinho}) {
    return (
        <div className="carrinho-container">

            {/* BARRA SUPERIOR */}
            <header className="carrinho-header">

                <button
                    className="botao-fechar"
                    onClick={fecharCarrinho}
                >
                    ×
                </button>

            </header>


            {/* CONTEÚDO */}
            <main className="carrinho-conteudo">

                {/* CLIENTE */}
                <div className="cliente">

                    <div className="icone-cliente">

                        <div className="cabeca-cliente"></div>

                        <div className="corpo-cliente"></div>

                    </div>

                    <strong>Ana</strong>

                </div>


                {/* BOLOS */}
                <div className="lista-bolos">

                    <p>1 bolo de brigadeiro 1kg</p>

                    <p>1 bolo de ninho 2kg</p>

                </div>


                {/* BOTÃO REALIZAR PEDIDO */}
                <button
                    className="botao-realizar"
                    onClick={realizarPedido}
                >
                    Realizar Pedido
                </button>


                {/* BOTÕES INFERIORES */}
                <div className="botoes-carrinho">

                    <button
                        className="botao-adicionar"
                        onClick={adicionarProduto}
                    >
                        <span className="simbolo-mais">+</span>
                        Adicionar Produto
                    </button>


                    <button
                        className="botao-esvaziar"
                        onClick={esvaziarCarrinho}
                    >
                        <span className="simbolo-x">×</span>
                        Esvaziar Carrinho
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Carrinho;