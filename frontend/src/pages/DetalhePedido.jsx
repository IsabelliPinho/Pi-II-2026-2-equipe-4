import { useEffect, useState } from "react";
import "../styles/DetalhePedido.css";
import { buscarClientes, buscarPedido, listarProdutos } from "../services/api";
import { STATUS, diasAte, formatarData, formatarDia } from "../utils/Pedidos";

function DetalhePedido({
    idPedido,
    voltarDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    editarPedido
}) {
    const [pedido, setPedido] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [produtos, setProdutos] = useState({});
    const [carregando, setCarregando] = useState(Boolean(idPedido));
    const [erro, setErro] = useState("");

    // RF003: GET /pedidos/{id}
    useEffect(() => {
        if (!idPedido) return;

        setCarregando(true);
        setErro("");

        Promise.all([buscarPedido(idPedido), buscarClientes(""), listarProdutos()])
            .then(([ped, clientes, lista]) => {
                setPedido(ped);
                setCliente(clientes.find((c) => c.id === ped.idCliente) ?? null);
                const mapa = {};
                lista.forEach((p) => {
                    mapa[p.id ?? p.idProduto] = p.nome;
                });
                setProdutos(mapa);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, [idPedido]);

    const status = pedido ? STATUS[pedido.statusPedido] : null;
    const dias = pedido?.dataPrevista ? diasAte(pedido.dataPrevista) : null;
    const venceTexto =
        dias === null
            ? "—"
            : dias < 0
              ? "Atrasado"
              : dias === 0
                ? "Vence hoje"
                : `Vence em ${dias} dia(s)`;

    return (
        <div className="detalhe-pedido-container">

            {/* CABEÇALHO */}

            <header className="detalhe-pedido-header">

                <div className="detalhe-logo">
                    <div className="detalhe-logo-circulo">
                        <span>GM</span>
                    </div>
                </div>

                <nav className="detalhe-menu">

                    <button onClick={voltarDashboard}>
                        Dashboard
                    </button>

                    <button onClick={abrirNovoPedido}>
                        Novo Pedido
                    </button>

                    <button onClick={abrirConsultarPedido}>
                        Consultar Pedido
                    </button>

                    <button onClick={abrirPendentes}>
                        Pendentes
                    </button>

                    <button
                        className="menu-ativo"
                        onClick={abrirFinanceiro}
                    >
                        Controle Financeiro
                    </button>

                    <button onClick={abrirClientes}>
                        Clientes
                    </button>

                </nav>

                {/* NOTIFICAÇÃO */}

                <button
                    className="detalhe-notificacao"
                    aria-label="Notificações"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>
                </button>

                {/* FECHAR */}

                <button
                    className="detalhe-fechar"
                    onClick={voltarDashboard}
                    aria-label="Fechar"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    >
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                </button>

            </header>


            {/* CONTEÚDO */}

            <main className="detalhe-pedido-main">

                <h1>Detalhes do Pedido</h1>

                <div className="titulo-pedido">
                    {pedido ? `Pedido #${String(pedido.id).padStart(3, "0")}` : "Pedido"}
                </div>

                {!idPedido && (
                    <p className="detalhe-estado">
                        Nenhum pedido selecionado. Abra um pedido pela tela Pendentes
                        ou Consultar Pedido.
                    </p>
                )}

                {idPedido && carregando && <p className="detalhe-estado">Carregando...</p>}

                {idPedido && !carregando && erro && <p className="detalhe-estado">{erro}</p>}

                <button
                    className="botao-editar-pedido"
                    onClick={editarPedido}
                >
                    Editar
                </button>


                {pedido && (<>

                {/* PRIMEIRA LINHA */}

                <div className="linha-cards">

                    {/* CLIENTE */}

                    <section className="card-detalhe card-cliente">

                        <h2>Cliente</h2>

                        <div className="cliente-conteudo">

                            <div className="cliente-informacoes">
                                <p>{cliente?.nome ?? "—"}</p>
                                <p>{cliente?.telefones?.[0] ?? "—"}</p>
                            </div>

                            <button className="botao-ver-cliente" onClick={abrirClientes}>
                                Ver
                                <br />
                                Cliente
                            </button>

                        </div>

                    </section>


                    {/* STATUS */}

                    <section className="card-detalhe card-status">

                        <h2>Status</h2>

                        <div className="status-conteudo">

                            <div className="status-esquerda">

                                <p className={status?.classe}>
                                    {status?.rotulo ?? pedido.statusPedido}
                                </p>
                                <p>
                                    {venceTexto}
                                </p>

                            </div>

                            <div className="status-direita">

                                <p>
                                    Pedido: {formatarDia(pedido.dataPedido)}
                                </p>
                                <p>
                                    Entrega: {formatarDia(pedido.dataPrevista)}
                                </p>

                            </div>

                        </div>

                    </section>

                </div>


                {/* SEGUNDA LINHA */}

                <div className="linha-cards">

                    {/* DESCRIÇÃO */}

                    <section className="card-detalhe card-descricao">

                        <h2>Descrição do Pedido</h2>

                        <div className="descricao-conteudo">

                            {pedido.itens?.map((item, i) => (
                                <p key={i}>
                                    {item.quantidade}x{" "}
                                    {produtos[item.idProduto] ?? `Produto ${item.idProduto}`}
                                    {item.peso ? `, ${item.peso} kg` : ""}
                                    {item.tipoMassa ? ` · massa: ${item.tipoMassa}` : ""}
                                    {item.tipoRecheio ? ` · recheio: ${item.tipoRecheio}` : ""}
                                    {item.tema ? ` · tema: ${item.tema}` : ""}
                                </p>
                            ))}

                        </div>

                    </section>


                    {/* OBSERVAÇÕES */}

                    <section className="card-detalhe card-observacoes">

                        <h2>Observações</h2>

                        <div className="observacoes-conteudo">

                            <p>Sem observações.</p>

                        </div>

                    </section>

                </div>


                {/* TERCEIRA LINHA */}

                <section className="card-detalhe card-tipo">

                    <h2>Tipo</h2>

                    <p className="tipo-titulo">
                        {pedido.formaEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
                        {" · "}
                        {formatarData(pedido.dataPrevista)}
                    </p>
                    {pedido.formaEntrega === "ENTREGA" && (
                        <p>
                            {[pedido.entregaRua, pedido.entregaNumCasa, pedido.entregaBairro]
                                .filter(Boolean)
                                .join(", ") || "Endereço não informado"}
                        </p>
                    )}

                </section>

            </>)}
            </main>

        </div>
    );
}

export default DetalhePedido;