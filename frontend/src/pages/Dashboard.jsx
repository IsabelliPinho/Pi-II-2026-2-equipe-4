import { useEffect, useMemo, useState } from "react";
import "../styles/PainelDashboard.css";
import { buscarClientes, consultarPedidos } from "../services/api";
import { estaPendente, formatarDia } from "../utils/Pedidos";

const FILTROS = [
    { id: "hoje", rotulo: "Hoje" },
    { id: "semana", rotulo: "Nesta semana" },
    { id: "proxima", rotulo: "Próx. semana" }
];

// ATENÇÃO: dados de EXEMPLO. As saídas ficam na planilha externa (Google Sheets)
// e ainda não há rota que devolva esses valores. Trocar quando existir.
const SAIDAS_EXEMPLO = [
    { nome: "Ingredientes", valor: 1100, cor: "#b8f5ff" },
    { nome: "Embalagens", valor: 900, cor: "#fdf2b0" },
    { nome: "Energia", valor: 500, cor: "#f27c7c" },
    { nome: "Entregas", valor: 300, cor: "#6b8fe8" },
    { nome: "Gás", valor: 200, cor: "#5dd27c" }
];

const moeda = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Data local como "AAAA-MM-DD" (mesmo formato de dataPrevista)
function paraIso(d) {
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
}

// Semana de segunda a domingo
function intervalo(filtro) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diasDesdeSegunda = (hoje.getDay() + 6) % 7;
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() + (6 - diasDesdeSegunda));

    if (filtro === "hoje") return [paraIso(hoje), paraIso(hoje)];
    if (filtro === "semana") return [paraIso(hoje), paraIso(domingo)];

    const segundaSeguinte = new Date(domingo);
    segundaSeguinte.setDate(domingo.getDate() + 1);
    const domingoSeguinte = new Date(segundaSeguinte);
    domingoSeguinte.setDate(segundaSeguinte.getDate() + 6);
    return [paraIso(segundaSeguinte), paraIso(domingoSeguinte)];
}

function tituloDoDia(iso) {
    if (iso === paraIso(new Date())) return "HOJE";
    const dia = new Date(`${iso}T00:00:00`)
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "");
    return `${dia} ${formatarDia(iso)}`.toUpperCase();
}

function GraficoSaidas({ dados }) {
    const total = dados.reduce((soma, d) => soma + d.valor, 0);
    const raio = 70;
    const circunferencia = 2 * Math.PI * raio;
    let acumulado = 0;

    return (
        <div className="painel-donut">
            <svg viewBox="0 0 200 200" role="img" aria-label="Principais saídas">
                {dados.map((d) => {
                    const tamanho = (d.valor / total) * circunferencia;
                    const fatia = (
                        <circle
                            key={d.nome}
                            cx="100"
                            cy="100"
                            r={raio}
                            fill="none"
                            stroke={d.cor}
                            strokeWidth="24"
                            strokeDasharray={`${tamanho} ${circunferencia - tamanho}`}
                            strokeDashoffset={-acumulado}
                            transform="rotate(-90 100 100)"
                        />
                    );
                    acumulado += tamanho;
                    return fatia;
                })}
            </svg>

            <div className="painel-donut-centro">
                <strong>{moeda(total)}</strong>
                <span>Total do custo mensal</span>
            </div>
        </div>
    );
}

function Dashboard({ abrirPendentes, abrirFinanceiro, abrirDetalhe }) {
    const [filtro, setFiltro] = useState("hoje");
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        Promise.all([consultarPedidos(), buscarClientes("")])
            .then(([listaPedidos, listaClientes]) => {
                setPedidos(listaPedidos);
                setClientes(listaClientes);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregando(false));
    }, []);

    const aguardandoAprovacao = pedidos.filter(
        (p) => p.statusPedido === "PENDENTE"
    ).length;

    // Pedidos ainda não entregues/cancelados dentro do período, agrupados por dia
    const grupos = useMemo(() => {
        const [inicio, fim] = intervalo(filtro);

        const doPeriodo = pedidos
            .filter((p) => estaPendente(p.statusPedido) && p.dataPrevista)
            .filter((p) => {
                const dia = p.dataPrevista.slice(0, 10);
                return dia >= inicio && dia <= fim;
            })
            .sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista));

        const porDia = new Map();
        doPeriodo.forEach((p) => {
            const dia = p.dataPrevista.slice(0, 10);
            if (!porDia.has(dia)) porDia.set(dia, []);
            porDia.get(dia).push(p);
        });
        return [...porDia.entries()];
    }, [pedidos, filtro]);

    const clientePorId = (id) => clientes.find((c) => c.id === id);

    return (
        <main className="painel-main">
            <div className="painel-grade">
                {/* ===== PEDIDOS ===== */}
                <section className="painel-card painel-pedidos">
                    <h1>Pedidos</h1>

                    <div className="painel-filtros">
                        {FILTROS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={`painel-filtro painel-filtro-${f.id} ${
                                    filtro === f.id ? "ativo" : ""
                                }`}
                                onClick={() => setFiltro(f.id)}
                            >
                                {f.rotulo}
                            </button>
                        ))}
                    </div>

                    <div className="painel-lista">
                        {carregando && <p className="painel-aviso">Carregando pedidos...</p>}
                        {erro && (
                            <p className="painel-erro" role="alert">
                                {erro}
                            </p>
                        )}
                        {!carregando && !erro && grupos.length === 0 && (
                            <p className="painel-aviso">Nenhum pedido para este período.</p>
                        )}

                        {grupos.map(([dia, lista]) => (
                            <div key={dia} className="painel-dia">
                                <h2>{tituloDoDia(dia)}</h2>

                                {lista.map((pedido) => {
                                    const cliente = clientePorId(pedido.idCliente);
                                    return (
                                        <article key={pedido.id} className="painel-pedido">
                                            <div>
                                                <strong>Cliente</strong>
                                                <p>{cliente?.nome ?? `Cliente ${pedido.idCliente}`}</p>
                                                <p>{cliente?.telefones?.[0] ?? "Sem telefone"}</p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => abrirDetalhe?.(pedido.id)}
                                            >
                                                Ver Pedido
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="painel-coluna">
                    {/* ===== PENDENTES ===== */}
                    <section className="painel-card painel-pendentes">
                        <h1>
                            Pedidos Pendentes <span aria-hidden="true">🔔</span>
                        </h1>

                        <p>
                            {aguardandoAprovacao === 0
                                ? "Nenhum pedido aguardando sua confirmação"
                                : aguardandoAprovacao === 1
                                ? "Há 1 pedido aguardando sua confirmação"
                                : `Há ${aguardandoAprovacao} pedidos aguardando sua confirmação`}
                        </p>

                        <button type="button" onClick={abrirPendentes}>
                            Ver Pendências
                        </button>
                    </section>

                    {/* ===== SAÍDAS ===== */}
                    <section className="painel-card painel-saidas">
                        <h1>Principais Saídas</h1>

                        <GraficoSaidas dados={SAIDAS_EXEMPLO} />
                        <p className="painel-exemplo">dados de exemplo</p>

                        <button
                            type="button"
                            className="painel-link"
                            onClick={abrirFinanceiro}
                        >
                            Ver controle financeiro
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;