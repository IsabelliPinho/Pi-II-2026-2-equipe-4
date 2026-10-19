import { useEffect, useState } from "react";
import "../styles/Pedido.css";

function Pedido({ adicionarCarrinho }) {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");

    // Estados visuais (Critérios de Aceite)
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [erroApi, setErroApi] = useState(null);
    const [statusModal, setStatusModal] = useState("idle"); // 'idle' | 'processing' | 'success' | 'error'
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        setCarregandoProdutos(true);
        setErroApi(null);

        fetch("http://localhost:8080/listar/produtos")
            .then((resposta) => {
                if (!resposta.ok) {
                    throw new Error("Erro ao buscar produtos");
                }
                return resposta.json();
            })
            .then((dados) => {
                // Normaliza o ID para evitar discrepâncias entre id e idProduto
                const produtosNormalizados = dados.map((item) => ({
                    ...item,
                    id: item.id ?? item.idProduto ?? item.codigo
                }));

                setProdutos(produtosNormalizados);

                if (produtosNormalizados.length > 0) {
                    setProdutoSelecionado(String(produtosNormalizados[0].id));
                }
                setCarregandoProdutos(false);
            })
            .catch((erro) => {
                console.error("Erro ao carregar produtos:", erro);
                setErroApi("Não foi possível carregar o catálogo de produtos. Verifique a conexão com o servidor.");
                setCarregandoProdutos(false);
            });
    }, []);

    function adicionarProdutoAoCarrinho() {
        if (produtos.length === 0) {
            setMensagemErro("Nenhum produto disponível no catálogo.");
            return;
        }

        const idParaBuscar = produtoSelecionado || (produtos.length > 0 ? String(produtos[0].id) : "");
        const produto = produtos.find(
            (item) => String(item.id ?? item.idProduto) === String(idParaBuscar)
        );

        if (!produto) {
            setMensagemErro("Por favor, selecione um produto válido.");
            return;
        }

        setMensagemErro("");

        // 1. Ativa o estado de Loading (Processing Modal)
        setStatusModal("processing");

        // Simulação do processamento do pedido
        setTimeout(() => {
            adicionarCarrinho({
                idProduto: produto.id ?? produto.idProduto,
                nome: produto.nome,
                preco: produto.preco
            });

            // 2. Transiciona para o estado de Sucesso (Pedido Aprovado)
            setStatusModal("success");
        }, 1200);
    }

    return (
        <div className="pedido-container">
            <header className="pedido-header">
                <h1>Faça seu Pedido</h1>
            </header>

            <main className="pedido-main">
                <div className="pedido-card">

                    {/* MENSAGEM DE ERRO AO CARREGAR A API */}
                    {erroApi && (
                        <div className="alerta-erro-api">
                            ⚠️ {erroApi}
                        </div>
                    )}

                    <section className="estrutura-bolo">
                        <h2>Estrutura do Bolo</h2>

                        {/* SELECIONAR PRODUTO DA API */}
                        <div className="campo-pedido">
                            <label>
                                Produto do Catálogo <span>*</span>
                            </label>
                            <select
                                value={produtoSelecionado}
                                onChange={(e) => setProdutoSelecionado(e.target.value)}
                                disabled={carregandoProdutos || produtos.length === 0}
                            >
                                {carregandoProdutos ? (
                                    <option value="">⏳ Carregando produtos...</option>
                                ) : produtos.length === 0 ? (
                                    <option value="">📦 Nenhum produto disponível</option>
                                ) : (
                                    produtos.map((p) => (
                                        <option key={p.id} value={String(p.id)}>
                                            {p.nome} - R$ {Number(p.preco || 0).toFixed(2)}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {mensagemErro && (
                            <span className="mensagem-validacao-erro">{mensagemErro}</span>
                        )}

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
                        disabled={statusModal === "processing" || carregandoProdutos}
                    >
                        <span className="icone-carrinho">
                            🛒
                        </span>
                        Adicionar ao carrinho
                    </button>
                </div>
            </main>

            {/* MODAL 1: PROCESSING (Not-Loading) */}
            {statusModal === "processing" && (
                <div className="modal-overlay">
                    <div className="card-modal card-loading">
                        <button className="btn-fechar-modal" onClick={() => setStatusModal("idle")}>×</button>
                        <div className="reticencias">...</div>
                        <div className="spinner-modal"></div>
                        <p className="texto-processing">Processando Pedido...</p>
                    </div>
                </div>
            )}

            {/* MODAL 2: PEDIDO APROVADO (Not-Pedido aprovado) */}
            {statusModal === "success" && (
                <div className="modal-overlay">
                    <div className="card-modal card-sucesso">
                        <button className="btn-fechar-modal" onClick={() => setStatusModal("idle")}>×</button>
                        <div className="icone-check">✓</div>
                        <h3 className="titulo-aprovado">Pedido Aprovado!</h3>
                        <p className="subtitulo-confirmacao">Aguardar Confirmação</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pedido;