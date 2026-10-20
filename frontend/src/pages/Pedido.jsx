
import { useEffect, useState } from "react";
import "../styles/Pedido.css";
import { listarProdutos } from "../services/api";

function Pedido({ adicionarCarrinho }) {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarProdutos() {
            try {
                setCarregando(true);
                setErro("");

                const dados = await listarProdutos();

                setProdutos(dados);

                if (dados.length > 0) {
                    setProdutoSelecionado(String(dados[0].id));
                } else {
                    setProdutoSelecionado("");
                }
            } catch (erro) {
                console.error("Erro ao carregar produtos:", erro);
                setErro(
                    erro.message ||
                    "Não foi possível carregar os produtos."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarProdutos();
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

                        {carregando && (
                            <p role="status">
                                Carregando produtos...
                            </p>
                        )}

                        {erro && (
                            <div role="alert">
                                <p>{erro}</p>

                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        )}

                        {!carregando &&
                            !erro &&
                            produtos.length === 0 && (
                                <p role="status">
                                    Nenhum produto disponível no momento.
                                </p>
                            )}

                        {!carregando &&
                            !erro &&
                            produtos.length > 0 && (
                                <div className="campo-pedido">
                                    <label htmlFor="produto">
                                        Produto disponível <span>*</span>
                                    </label>

                                    <select
                                        id="produto"
                                        value={produtoSelecionado}
                                        onChange={(evento) =>
                                            setProdutoSelecionado(
                                                evento.target.value
                                            )
                                        }
                                    >
                                        {produtos.map((produto) => (
                                            <option
                                                key={produto.id}
                                                value={String(produto.id)}
                                            >
                                                {produto.nome} — R${" "}
                                                {Number(produto.preco)
                                                    .toFixed(2)
                                                    .replace(".", ",")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        <div className="campo-pedido">
                            <label>
                                Tamanho <span>*</span>
                            </label>

                            <select defaultValue="1kg">
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

                        <div className="campo-pedido">
                            <label>
                                1º Recheio <span>*</span>
                            </label>

                            <select defaultValue="Brigadeiro">
                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>
                            </select>
                        </div>

                        <div className="campo-pedido">
                            <label>2º Recheio</label>

                            <select defaultValue="Brigadeiro">
                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>
                            </select>
                        </div>

                        <div className="campo-pedido">
                            <label>
                                Andar <span>*</span>
                            </label>

                            <select defaultValue="Andar único">
                                <option>Andar único</option>
                                <option>2 andares</option>
                                <option>3 andares</option>
                            </select>
                        </div>

                        <div className="campo-textarea">
                            <label>
                                Tema <span>*</span>
                            </label>

                            <textarea
                                placeholder="Descreva aqui as características do seu pedido"
                            />
                        </div>
                    </section>

                    <section className="acabamento-bolo">
                        <h2>Acabamento do Bolo</h2>

                        <div className="campo-pedido">
                            <label>
                                Cobertura <span>*</span>
                            </label>

                            <select defaultValue="Ninho">
                                <option>Ninho</option>
                                <option>Chantilly</option>
                                <option>Ganache</option>
                                <option>Buttercream</option>
                            </select>
                        </div>

                        <div className="campo-textarea">
                            <label>
                                Topo &amp;
                                <br />
                                Decoração
                            </label>

                            <textarea
                                placeholder="Descreva a decoração do bolo"
                            />
                        </div>

                        <div className="campo-pedido">
                            <label>
                                Massa <span>*</span>
                            </label>

                            <select defaultValue="Branca">
                                <option>Branca</option>
                                <option>Chocolate</option>
                                <option>Red Velvet</option>
                            </select>
                        </div>

                        <div className="campo-textarea">
                            <label>
                                Restrições
                                <br />
                                Alimentares
                            </label>

                            <textarea
                                placeholder="Descreva se houver alguma restrição"
                            />
                        </div>
                    </section>

                    <button
                        className="botao-carrinho"
                        onClick={adicionarProdutoAoCarrinho}
                        disabled={
                            carregando ||
                            !!erro ||
                            produtos.length === 0 ||
                            !produtoSelecionado
                        }
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
