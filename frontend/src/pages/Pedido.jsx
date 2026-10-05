import { useEffect, useState } from "react";
import "../styles/Pedido.css";

function Pedido({ adicionarCarrinho }) {

    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/listar/produtos")
            .then((resposta) => {
                if (!resposta.ok) {
                    throw new Error("Erro ao buscar produtos");
                }

                return resposta.json();
            })
            .then((dados) => {
                setProdutos(dados);

                if (dados.length > 0) {
                    setProdutoSelecionado(String(dados[0].id));
                }
            })
            .catch((erro) => {
                console.error("Erro ao carregar produtos:", erro);
            });
    }, []);


    function adicionarProdutoAoCarrinho() {

        const produto = produtos.find(
            (item) => String(item.id) === produtoSelecionado
        );

        if (!produto) {
            alert("Selecione um produto.");
            return;
        }

        adicionarCarrinho({
            idProduto: produto.id,
            nome: produto.nome,
            preco: produto.preco
        });
    }


    return (
        <div className="pedido-container">

            <header className="pedido-header">
                <h1>Faça seu Pedido</h1>
            </header>


            <main className="pedido-main">

                <div className="pedido-card">

                    <section className="estrutura-bolo">

                        <h2>Estrutura do Bolo</h2>


                        {/* PRODUTO */}

                        <div className="campo-pedido">

                            <label>
                                Produto <span>*</span>
                            </label>

                            <select
                                value={produtoSelecionado}
                                onChange={(e) =>
                                    setProdutoSelecionado(e.target.value)
                                }
                            >

                                {produtos.length === 0 ? (

                                    <option value="">
                                        Carregando...
                                    </option>

                                ) : (

                                    produtos.map((produto) => (

                                        <option
                                            key={produto.id}
                                            value={produto.id}
                                        >
                                            {produto.nome}
                                        </option>

                                    ))

                                )}

                            </select>

                        </div>


                        {/* TAMANHO */}

                        <div className="campo-pedido">

                            <label>
                                Tamanho <span>*</span>
                            </label>

                            <select>

                                <option>1kg</option>
                                <option>2kg</option>
                                <option>3kg</option>
                                <option>4kg</option>
                                <option>5kg</option>

                            </select>

                        </div>


                        <p className="observacao">
                            1kg serve aprox. 20 pessoas
                        </p>


                        {/* 1º RECHEIO */}

                        <div className="campo-pedido">

                            <label>
                                1º Recheio <span>*</span>
                            </label>

                            <select>

                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>

                            </select>

                        </div>


                        {/* 2º RECHEIO */}

                        <div className="campo-pedido">

                            <label>
                                2º Recheio
                            </label>

                            <select>

                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>

                            </select>

                        </div>


                        {/* ANDAR */}

                        <div className="campo-pedido">

                            <label>
                                Andar <span>*</span>
                            </label>

                            <select>

                                <option>Andar único</option>
                                <option>2 andares</option>
                                <option>3 andares</option>

                            </select>

                        </div>


                        {/* TEMA */}

                        <div className="campo-textarea">

                            <label>
                                Tema <span>*</span>
                            </label>

                            <textarea
                                placeholder="Descreva aqui as características do seu pedido"
                            ></textarea>

                        </div>

                    </section>


                    <section className="acabamento-bolo">

                        <h2>Acabamento do Bolo</h2>


                        {/* COBERTURA */}

                        <div className="campo-pedido">

                            <label>
                                Cobertura <span>*</span>
                            </label>

                            <select>

                                <option>Ninho</option>
                                <option>Chantilly</option>
                                <option>Ganache</option>
                                <option>Buttercream</option>

                            </select>

                        </div>


                        {/* TOPO */}

                        <div className="campo-textarea">

                            <label>
                                Topo &<br />
                                Decoração
                            </label>

                            <textarea
                                placeholder="Descreva a decoração do bolo"
                            ></textarea>

                        </div>


                        {/* MASSA */}

                        <div className="campo-pedido">

                            <label>
                                Massa <span>*</span>
                            </label>

                            <select>

                                <option>Branca</option>
                                <option>Chocolate</option>
                                <option>Red Velvet</option>

                            </select>

                        </div>


                        {/* RESTRIÇÕES */}

                        <div className="campo-textarea">

                            <label>
                                Restrições<br />
                                Alimentares
                            </label>

                            <textarea
                                placeholder="Descreva se houver alguma restrição"
                            ></textarea>

                        </div>

                    </section>


                    {/* BOTÃO */}

                    <button
                        className="botao-carrinho"
                        onClick={adicionarProdutoAoCarrinho}
                    >

                        <span className="icone-carrinho">
                            🛒
                        </span>

                        Adicionar ao carrinho

                    </button>

                </div>

            </main>

        </div>
    );
}

export default Pedido;