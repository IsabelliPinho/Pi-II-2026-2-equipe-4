import { useEffect, useState } from "react";
import "../styles/Clientes.css";
import { buscarClientes, consultarPedidos } from "../services/api";

function Clientes({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    abrirAlertas,
    fecharClientes
}) {

    const [termo, setTermo] = useState("");
    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [contagem, setContagem] = useState(null);

    useEffect(() => {
        consultarPedidos()
            .then((pedidos) => {
                const conta = {};
                pedidos.forEach((p) => {
                    conta[p.idCliente] = (conta[p.idCliente] ?? 0) + 1;
                });
                setContagem(conta);
            })
            .catch(() => setContagem(null));
    }, []);

    const termoCurto = termo.trim().length > 0 && termo.trim().length < 3;

    // RF002: só busca com 3+ caracteres; campo vazio lista todos.
    useEffect(() => {
        const t = termo.trim();
        if (t.length > 0 && t.length < 3) return;

        let cancelado = false;
        setCarregando(true);
        setErro("");

        const espera = setTimeout(() => {
            buscarClientes(t)
                .then((dados) => !cancelado && setClientes(dados))
                .catch((e) => !cancelado && setErro(e.message))
                .finally(() => !cancelado && setCarregando(false));
        }, 300);

        return () => {
            cancelado = true;
            clearTimeout(espera);
        };
    }, [termo]);

    return (
        <div className="clientes-container">

            {/* BARRA SUPERIOR */}
            <header className="clientes-header">

                <div className="clientes-logo">
                    <div className="logo-circulo-clientes">
                        <span>GM</span>
                    </div>
                </div>

                <nav className="clientes-menu">

                    <button onClick={abrirDashboard}>
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

                    <button onClick={abrirFinanceiro}>
                        Controle Financeiro
                    </button>

                    <button
                        className="menu-ativo"
                        onClick={abrirClientes}
                    >
                        Clientes
                    </button>

                </nav>

                {/* SINO */}
                <button className="clientes-notificacao" onClick={abrirAlertas}>
                    🔔
                </button>

                {/* FECHAR */}
                <button
                    className="botao-fechar-clientes"
                    onClick={fecharClientes}
                >
                    ×
                </button>

            </header>


            {/* CONTEÚDO */}
            <main className="clientes-main">

                <h1>Clientes</h1>


                {/* PESQUISA + CADASTRAR */}
                <div className="clientes-acoes">

                    <div className="campo-pesquisa">

                        {/* ÍCONE DE PESQUISA */}
                        <svg
                            className="icone-pesquisa"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="16.5" y1="16.5" x2="21" y2="21" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Busque por nome ou telefone"
                            value={termo}
                            onChange={(e) => setTermo(e.target.value)}
                        />

                    </div>


                    {/* CADASTRAR */}
                    <button className="botao-cadastrar">

                        <span>
                            Cadastrar
                        </span>

                        {/* CONTORNO DE PESSOA */}
                        <svg
                            className="icone-pessoa"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="8" r="3.5" />
                            <path d="M2.5 20c.8-3.4 3-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />

                            {/* Sinal de + */}
                            <line x1="18" y1="9" x2="18" y2="16" />
                            <line x1="14.5" y1="12.5" x2="21.5" y2="12.5" />
                        </svg>

                    </button>

                </div>


                {/* TABELA */}
                <div className="tabela-clientes">

                    {/* CABEÇALHO */}
                    <div className="tabela-header">

                        <div className="coluna-numero">
                            #
                        </div>

                        <div className="coluna-cliente">
                            Cliente
                        </div>

                        <div className="coluna-contato">
                            Contato
                        </div>

                        <div className="coluna-pedidos">
                            Nº
                            <br />
                            Pedidos
                        </div>

                        <div className="coluna-acoes">
                        </div>

                    </div>


                    {termoCurto && (
                        <p className="cliente-estado">Digite ao menos 3 caracteres para buscar.</p>
                    )}
 
                    {carregando && <p className="cliente-estado">Carregando...</p>}
 
                    {!carregando && erro && <p className="cliente-estado">{erro}</p>}
 
                    {!carregando && !erro && clientes.length === 0 && (
                        <p className="cliente-estado">Nenhum cliente encontrado.</p>
                    )}

   {!carregando && !erro && clientes.map((cliente) => (
 
                        <div
                            className="cliente-linha"
                            key={cliente.id ?? cliente.numero}
                        >
 
                            <div className="coluna-numero">
                                {String(cliente.id ?? cliente.numero).padStart(3, "0")}

                            </div>
 
                            <div className="coluna-cliente">
                                {cliente.nome}
                            </div>
 
                            <div className="coluna-contato">
                                {cliente.telefones ? cliente.telefones[0] : (cliente.contato ?? "—")}
                            </div>
 
                            <div className="coluna-pedidos">
                                {contagem ? (contagem[cliente.id] ?? 0) : "—"}
                            </div>
 
                            <div className="coluna-acoes">
 
                                {/* OLHO */}
                                <button
                                    className="botao-visualizar"
                                    title="Visualizar cliente"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                                        <circle cx="12" cy="12" r="2.8" />
                                    </svg>
                                </button>
 
 
                                {/* LIXEIRA */}
                                <button
                                    className="botao-excluir"
                                    title="Excluir cliente"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="4 7 20 7" />
                                        <path d="M9 7V4h6v3" />
                                        <path d="M6 7l1 14h10l1-14" />
                                        <line x1="10" y1="11" x2="10" y2="18" />
                                        <line x1="14" y1="11" x2="14" y2="18" />
                                    </svg>
                                </button>
 
                            </div>
 
                        </div>
 
                    ))}
 
                </div>
 
            </main>
 
        </div>
    );
}
 
export default Clientes;
