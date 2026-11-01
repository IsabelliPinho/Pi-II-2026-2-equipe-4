import { useEffect, useState } from "react";
import "../styles/Alertas.css";
import { buscarClientes, consultarPedidos } from "../services/api";
import { diasAte, estaPendente, formatarDia } from "../utils/Pedidos";

const CHAVE_LIDOS = "gabicake.alertasLidos";

function lerLidos() {
    try {
        return new Set(JSON.parse(localStorage.getItem(CHAVE_LIDOS) ?? "[]"));
    } catch {
        return new Set();
    }
}

function salvarLidos(conjunto) {
    try {
        localStorage.setItem(CHAVE_LIDOS, JSON.stringify([...conjunto]));
    } catch {
        // sem localStorage: os lidos valem só até recarregar a página
    }
}

function Alertas({
    voltarDashboard,
    abrirNovoPedido,
    abrirConsultarPedido,
    abrirPendentes,
    abrirFinanceiro,
    abrirClientes,
    abrirDetalhe
}) {
    const [pedidos, setPedidos] = useState([]);
    const [clientesPorId, setClientesPorId] = useState({});
    const [lidos, setLidos] = useState(lerLidos);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // RF008: pedidos ainda não atendidos e perto do prazo
    useEffect(() => {
        consultarPedidos()
            .then((dados) =>
                setPedidos(
                    dados
                        .filter((p) => estaPendente(p.statusPedido) && p.dataPrevista)
                        .map((p) => ({ ...p, dias: diasAte(p.dataPrevista) }))
                        .filter((p) => p.dias <= 3)
                        .sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista))
                )
            )
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));

        buscarClientes("")
            .then((lista) => {
                const mapa = {};
                lista.forEach((c) => {
                    mapa[c.id] = c;
                });
                setClientesPorId(mapa);
            })
            .catch(() => {});
    }, []);

    const naoLidos = pedidos.filter((p) => !lidos.has(p.id));

    const grupos = [
        { chave: "atrasados", titulo: "Atrasados", classe: "titulo-atrasado", itens: naoLidos.filter((p) => p.dias < 0) },
        { chave: "hoje", titulo: "Vence Hoje", classe: "titulo-hoje", itens: naoLidos.filter((p) => p.dias === 0) },
        { chave: "amanha", titulo: "Vence Amanhã", classe: "titulo-amanha", itens: naoLidos.filter((p) => p.dias === 1) },
        { chave: "proximos", titulo: "Próximos 3 Dias", classe: "titulo-proximos", itens: naoLidos.filter((p) => p.dias >= 2 && p.dias <= 3) }
    ];

    const contar = (chave) => grupos.find((g) => g.chave === chave).itens.length;

    function marcarTodosComoLidos() {
        const novo = new Set(lidos);
        naoLidos.forEach((p) => novo.add(p.id));
        setLidos(novo);
        salvarLidos(novo);
    }

    return (
        <div className="alertas-container">


            <main className="alertas-main">

                <h1>Alertas</h1>

                <section className="alertas-resumo">

                    <h2>Resumo</h2>

                    <div className="alertas-cards">

                        <div className="alerta-card alerta-card-hoje">
                            <span>Hoje</span>
                            <strong>{contar("hoje")}</strong>
                        </div>

                        <div className="alerta-card alerta-card-amanha">
                            <span>Amanhã</span>
                            <strong>{contar("amanha")}</strong>
                        </div>

                        <div className="alerta-card alerta-card-proximos">
                            <span>Próximos 3 dias</span>
                            <strong>{contar("proximos")}</strong>
                        </div>

                    </div>

                </section>

                {carregando && <p className="alertas-estado">Carregando...</p>}

                {!carregando && erro && <p className="alertas-estado">{erro}</p>}

                {!carregando && !erro && naoLidos.length === 0 && (
                    <p className="alertas-estado">Nenhum alerta no momento.</p>
                )}

                {!carregando && !erro && grupos.map((grupo) =>
                    grupo.itens.length === 0 ? null : (
                        <section className="alertas-grupo" key={grupo.chave}>

                            <h3 className={grupo.classe}>{grupo.titulo}</h3>

                            {grupo.itens.map((p) => (
                                <div className="alerta-linha" key={p.id}>

                                    <span>
                                        #{String(p.id).padStart(3, "0")}{" "}
                                        {p.nomeCliente ?? clientesPorId[p.idCliente]?.nome ?? "—"}
                                        {" — "}
                                        {p.formaEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
                                        {" — "}
                                        {formatarDia(p.dataPrevista)}
                                    </span>

                                    <button
                                        className="alerta-ver"
                                        onClick={() => abrirDetalhe?.(p.id)}
                                    >
                                        Ver pedido
                                    </button>

                                </div>
                            ))}

                        </section>
                    )
                )}

                {naoLidos.length > 0 && (
                    <button
                        className="alertas-marcar-lidos"
                        onClick={marcarTodosComoLidos}
                    >
                        Marcar Todos Como Lidos
                    </button>
                )}

            </main>

        </div>
    );
}

export default Alertas;