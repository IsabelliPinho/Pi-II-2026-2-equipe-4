import { useEffect, useState } from "react";
import "../styles/Pedido.css";
import { listarProdutos } from "../services/api";

function Pedido({ adicionarCarrinho, voltarDashboard }) {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [statusModal, setStatusModal] = useState("idle");

    // Carrega os produtos do backend
    async function carregarProdutos() {
        try {
            setCarregando(true);
            setErro("");
            setMensagemErro("");

            const dados = await listarProdutos();

            const produtosNormalizados = Array.isArray(dados)
                ? dados.map((item) => ({
                    ...item,
                    id: item.id ?? item.idProduto ?? item.codigo
                }))
                : [];

            setProdutos(produtosNormalizados);

            if (produtosNormalizados.length > 0) {
                setProdutoSelecionado(
                    String(produtosNormalizados[0].id)
                );
            } else {
                setProdutoSelecionado("");
            }

        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);

            // Mensagens específicas para cada situação
            if (erro.status === 401 || erro.status === 403) {
                setErro(
                    "Não foi possível acessar o catálogo de produtos. Verifique a autorização da rota no backend."
                );
            } else if (erro.status === 0) {
                setErro(
                    "Servidor indisponível. Verifique se o backend está funcionando."
                );
            } else {
                setErro(
                    "Não foi possível carregar os produtos. Tente novamente."
                );
            }

            setProdutos([]);
            setProdutoSelecionado("");

        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    // Adiciona o produto selecionado ao carrinho
    function adicionarProdutoAoCarrinho() {
        setMensagemErro("");

        if (carregando || erro) {
            return;
        }

        if (produtos.length === 0) {
            setMensagemErro(
                "Nenhum produto disponível no catálogo."
            );
            return;
        }

        const produto = produtos.find(
            (item) => String(item.id) === produtoSelecionado
        );

        if (!produto) {
            setMensagemErro(
                "Por favor, selecione um produto válido."
            );
            return;
        }

        if (!adicionarCarrinho) {
            setMensagemErro(
                "Não foi possível adicionar o produto ao carrinho."
            );
            return;
        }

        setStatusModal("processing");

        try {
            adicionarCarrinho({
                idProduto: produto.id,
                nome: produto.nome,
                preco: produto.preco
            });

            setStatusModal("success");

        } catch (erro) {
            console.error(
                "Erro ao adicionar ao carrinho:",
                erro
            );

            setStatusModal("idle");

            setMensagemErro(
                "Não foi possível adicionar o produto ao carrinho."
            );
        }
    }

    return (
        <div className="pedido-container">

            <header className="pedido-header">
                <h1>Faça seu Pedido</h1>

                {voltarDashboard && (
                    <button
                        type="button"
                        className="botao-voltar-painel"
                        onClick={voltarDashboard}
                        aria-label="Voltar ao painel"
                    >
                        ×
                    </button>
                )}
            </header>

            <main className="pedido-main">

                <div className="pedido-card">

                    {/* ESTRUTURA DO BOLO */}
                    <section className="estrutura-bolo">

                        <h2>Estrutura do Bolo</h2>

                        {carregando && (
                            <p role="status">
                                Carregando produtos...
                            </p>
                        )}

                        {!carregando && erro && (
                            <div
                                role="alert"
                                className="alerta-erro-api"
                            >
                                <p>{erro}</p>

                                <button
                                    type="button"
                                    onClick={carregarProdutos}
                                    disabled={carregando}
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
                                        Produto do catálogo <span>*</span>
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
                                                {Number(produto.preco || 0)
                                                    .toFixed(2)
                                                    .replace(".", ",")}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            )}

                        {mensagemErro && (
                            <p
                                className="mensagem-validacao-erro"
                                role="alert"
                            >
                                {mensagemErro}
                            </p>
                        )}

                        {/* TAMANHO */}
                        <div className="campo-pedido">

                            <label htmlFor="tamanho">
                                Tamanho <span>*</span>
                            </label>

                            <select
                                id="tamanho"
                                defaultValue="1kg"
                            >
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

                            <label htmlFor="recheio1">
                                1º Recheio <span>*</span>
                            </label>

                            <select
                                id="recheio1"
                                defaultValue="Brigadeiro"
                            >
                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>
                            </select>

                        </div>

                        {/* SEGUNDO RECHEIO */}
                        <div className="campo-pedido">

                            <label htmlFor="recheio2">
                                2º Recheio
                            </label>

                            <select
                                id="recheio2"
                                defaultValue="Brigadeiro"
                            >
                                <option>Brigadeiro</option>
                                <option>Beijinho</option>
                                <option>Ninho</option>
                                <option>Doce de leite</option>
                            </select>

                        </div>

                        {/* ANDAR */}
                        <div className="campo-pedido">

                            <label htmlFor="andar">
                                Andar <span>*</span>
                            </label>

                            <select
                                id="andar"
                                defaultValue="Andar único"
                            >
                                <option>Andar único</option>
                                <option>2 andares</option>
                                <option>3 andares</option>
                            </select>

                        </div>

                        {/* TEMA */}
                        <div className="campo-textarea">

                            <label htmlFor="tema">
                                Tema <span>*</span>
                            </label>

                            <textarea
                                id="tema"
                                placeholder="Descreva aqui as características do seu pedido"
                            />

                        </div>

                    </section>

                    {/* ACABAMENTO DO BOLO */}
                    <section className="acabamento-bolo">

                        <h2>Acabamento do Bolo</h2>

                        {/* COBERTURA */}
                        <div className="campo-pedido">

                            <label htmlFor="cobertura">
                                Cobertura <span>*</span>
                            </label>

                            <select
                                id="cobertura"
                                defaultValue="Ninho"
                            >
                                <option>Ninho</option>
                                <option>Chantilly</option>
                                <option>Ganache</option>
                                <option>Buttercream</option>
                            </select>

                        </div>

                        {/* DECORAÇÃO */}
                        <div className="campo-textarea">

                            <label htmlFor="decoracao">
                                Topo &amp;
                                <br />
                                Decoração
                            </label>

                            <textarea
                                id="decoracao"
                                placeholder="Descreva a decoração do bolo"
                            />

                        </div>

                        {/* MASSA */}
                        <div className="campo-pedido">

                            <label htmlFor="massa">
                                Massa <span>*</span>
                            </label>

                            <select
                                id="massa"
                                defaultValue="Branca"
                            >
                                <option>Branca</option>
                                <option>Chocolate</option>
                                <option>Red Velvet</option>
                            </select>

                        </div>

                        {/* RESTRIÇÕES ALIMENTARES */}
                        <div className="campo-textarea">

                            <label htmlFor="restricoes">
                                Restrições
                                <br />
                                Alimentares
                            </label>

                            <textarea
                                id="restricoes"
                                placeholder="Descreva se houver alguma restrição"
                            />

                        </div>

                    </section>

                    {/* ADICIONAR AO CARRINHO */}
                    <button
                        type="button"
                        className="botao-carrinho"
                        onClick={adicionarProdutoAoCarrinho}
                        disabled={
                            carregando ||
                            !!erro ||
                            produtos.length === 0 ||
                            !produtoSelecionado ||
                            statusModal === "processing"
                        }
                    >
                        <span className="icone-carrinho">
                            🛒
                        </span>

                        Adicionar ao carrinho
                    </button>

                </div>

            </main>

            {/* MODAL DE PROCESSAMENTO */}
            {statusModal === "processing" && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Adicionando produto ao carrinho"
                >
                    <div className="card-modal card-loading">

                        <div className="spinner-modal"></div>

                        <p className="texto-processing">
                            Adicionando produto ao carrinho...
                        </p>

                    </div>
                </div>
            )}

            {/* MODAL DE SUCESSO */}
            {statusModal === "success" && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Produto adicionado ao carrinho"
                >
                    <div className="card-modal card-sucesso">

                        <button
                            type="button"
                            className="btn-fechar-modal"
                            onClick={() => setStatusModal("idle")}
                            aria-label="Fechar mensagem"
                        >
                            ×
                        </button>

                        <div className="icone-check">
                            ✓
                        </div>

                        <h3 className="titulo-aprovado">
                            Produto adicionado!
                        </h3>

                        <p className="subtitulo-confirmacao">
                            O produto foi adicionado ao carrinho.
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Pedido;