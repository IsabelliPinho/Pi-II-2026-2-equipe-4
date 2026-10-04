import "../styles/Pedido.css";

function Pedido({ adicionarCarrinho }) {
    return (
        <div className="pedido-container">

            {/* CABEÇALHO */}
            <header className="pedido-header">
                <h1>Faça seu Pedido</h1>
            </header>

            {/* ÁREA PRINCIPAL */}
            <main className="pedido-main">

                <div className="pedido-card">

                    {/* ESTRUTURA DO BOLO */}
                    <section className="estrutura-bolo">

                        <h2>Estrutura do Bolo</h2>

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

                        {/* PRIMEIRO RECHEIO */}
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

                        {/* SEGUNDO RECHEIO */}
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


                    {/* ACABAMENTO DO BOLO */}
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

                        {/* TOPO E DECORAÇÃO */}
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
                        onClick={adicionarCarrinho}
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