
import "../styles/Carrinho.css";

function Carrinho({
    carrinho = [],
    adicionarProduto,
    realizarPedido,
    fecharCarrinho,
    esvaziarCarrinho
}) {
    const total = carrinho.reduce(
        (soma, produto) => soma + Number(produto.preco || 0),
        0
    );

    return (
        <div className="carrinho-container">
            <header className="carrinho-header">
                <button
                    className="botao-fechar"
                    onClick={fecharCarrinho}
                    aria-label="Fechar carrinho"
                >
                    ×
                </button>
            </header>

            <main className="carrinho-conteudo">
                <div className="cliente">
                    <div className="icone-cliente">
                        <div className="cabeca-cliente"></div>
                        <div className="corpo-cliente"></div>
                    </div>

                    <strong>Cliente</strong>
                </div>

                <div className="lista-bolos">
                    {carrinho.length > 0 ? (
                        carrinho.map((produto, index) => (
                            <div key={`${produto.idProduto}-${index}`}>
                                <p>{produto.nome}</p>
                                <p>
                                    {Number(produto.preco).toLocaleString(
                                        "pt-BR",
                                        {
                                            style: "currency",
                                            currency: "BRL"
                                        }
                                    )}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>Seu carrinho está vazio.</p>
                    )}
                </div>

                <p className="total-carrinho">
                    <strong>
                        Total:{" "}
                        {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </strong>
                </p>

                <button
                    className="botao-realizar"
                    onClick={realizarPedido}
                    disabled={carrinho.length === 0}
                >
                    Realizar Pedido
                </button>

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
                        disabled={carrinho.length === 0}
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
