import "../styles/CarrinhoVazio.css";

function CarrinhoVazio({ voltarCarrinho }) {
    return (
        <div className="carrinho-vazio-container">

            {/* BARRA SUPERIOR */}
            <header className="carrinho-vazio-header">

                <button
                    className="botao-fechar-vazio"
                    onClick={voltarCarrinho}
                >
                    ×
                </button>

            </header>


            {/* CONTEÚDO */}
            <main className="carrinho-vazio-conteudo">

                <div className="circulo-carrinho-vazio">

                    {/* ÍCONE DO CARRINHO */}
                    <div className="icone-carrinho-vazio">

                        <svg
                            width="58"
                            height="58"
                            viewBox="0 0 58 58"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 10H15L19 35H43L48 18H19"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle
                                cx="23"
                                cy="44"
                                r="3.5"
                                fill="white"
                            />

                            <circle
                                cx="40"
                                cy="44"
                                r="3.5"
                                fill="white"
                            />
                        </svg>

                    </div>


                    {/* TEXTO */}
                    <h1>Carrinho vazio</h1>

                </div>

            </main>

        </div>
    );
}

export default CarrinhoVazio;