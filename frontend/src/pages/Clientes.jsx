import { useEffect, useState } from "react";
import "../styles/Clientes.css";
import { buscarClientes } from "../services/api";

function Clientes({
    abrirDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    fecharClientes
}) {
    const [termo, setTermo] = useState("");
    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        const busca = termo.trim();

        if (busca.length > 0 && busca.length < 3) {
            setCarregando(false);
            setErro("");
            setClientes([]);
            return;
        }

        let cancelado = false;

        async function carregarClientes() {
            setCarregando(true);
            setErro("");

            try {
                const dados = await buscarClientes(busca);

                if (!cancelado) {
                    setClientes(Array.isArray(dados) ? dados : []);
                }
            } catch (e) {
                if (!cancelado) {
                    setClientes([]);
                    setErro(
                        e.message ||
                        "Não foi possível carregar os clientes."
                    );
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        const espera = setTimeout(carregarClientes, 300);

        return () => {
            cancelado = true;
            clearTimeout(espera);
        };
    }, [termo, tentativa]);

    function tentarNovamente() {
        setTentativa((atual) => atual + 1);
    }

    return (
        <div className="clientes-container">
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

                <button
                    className="clientes-notificacao"
                    type="button"
                    aria-label="Notificações"
                >
                    🔔
                </button>

                <button
                    className="botao-fechar-clientes"
                    onClick={fecharClientes}
                    type="button"
                    aria-label="Fechar tela de clientes"
                >
                    ×
                </button>
            </header>

            <main className="clientes-main">
                <h1>Clientes</h1>

                <div className="clientes-acoes">
                    <div className="campo-pesquisa">
                        <svg
                            className="icone-pesquisa"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line
                                x1="16.5"
                                y1="16.5"
                                x2="21"
                                y2="21"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Busque por nome ou telefone"
                            value={termo}
                            onChange={(e) => setTermo(e.target.value)}
                            aria-label="Buscar clientes por nome ou telefone"
                        />
                    </div>

                    <button
                        className="botao-cadastrar"
                        type="button"
                        onClick={() => {
                            alert(
                                "A tela de cadastro de clientes ainda não está conectada."
                            );
                        }}
                    >
                        <span>Cadastrar</span>

                        <svg
                            className="icone-pessoa"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="8" r="3.5" />
                            <path d="M2.5 20c.8-3.4 3-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
                            <line x1="18" y1="9" x2="18" y2="16" />
                            <line x1="14.5" y1="12.5" x2="21.5" y2="12.5" />
                        </svg>
                    </button>
                </div>

                <div className="tabela-clientes">
                    <div className="tabela-header">
                        <div className="coluna-numero">#</div>
                        <div className="coluna-cliente">Cliente</div>
                        <div className="coluna-contato">Contato</div>

                        <div className="coluna-pedidos">
                            Nº
                            <br />
                            Pedidos
                        </div>

                        <div className="coluna-acoes"></div>
                    </div>

                    {!carregando &&
                        !erro &&
                        termo.trim().length > 0 &&
                        termo.trim().length < 3 && (
                            <p className="estado-clientes" role="status">
                                Digite pelo menos 3 caracteres para pesquisar.
                            </p>
                        )}

                    {carregando && (
                        <p className="estado-clientes" role="status">
                            Carregando clientes...
                        </p>
                    )}

                    {!carregando && erro && (
                        <div
                            className="estado-clientes estado-clientes-erro"
                            role="alert"
                        >
                            <p>{erro}</p>

                            <button
                                type="button"
                                onClick={tentarNovamente}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {!carregando &&
                        !erro &&
                        !(
                            termo.trim().length > 0 &&
                            termo.trim().length < 3
                        ) &&
                        clientes.length === 0 && (
                            <p className="estado-clientes" role="status">
                                Nenhum cliente encontrado.
                            </p>
                        )}

                    {!carregando &&
                        !erro &&
                        clientes.map((cliente) => (
                            <div
                                className="cliente-linha"
                                key={cliente.id}
                            >
                                <div className="coluna-numero">
                                    {cliente.id}
                                </div>

                                <div className="coluna-cliente">
                                    {cliente.nome}
                                </div>

                                <div className="coluna-contato">
                                    {cliente.telefones?.[0] ?? "—"}
                                </div>

                                <div className="coluna-pedidos">
                                    —
                                </div>

                                <div className="coluna-acoes">
                                    <button
                                        className="botao-visualizar"
                                        type="button"
                                        title="Visualizar cliente"
                                        aria-label={`Visualizar cliente ${cliente.nome}`}
                                        onClick={() => {
                                            alert(
                                                "A visualização de detalhes do cliente ainda não está conectada."
                                            );
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                                            <circle cx="12" cy="12" r="2.8" />
                                        </svg>
                                    </button>

                                    <button
                                        className="botao-excluir"
                                        type="button"
                                        title="Excluir cliente"
                                        aria-label={`Excluir cliente ${cliente.nome}`}
                                        onClick={() => {
                                            alert(
                                                "A exclusão de clientes ainda não está conectada ao backend."
                                            );
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
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