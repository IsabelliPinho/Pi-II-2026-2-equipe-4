import { useEffect, useMemo, useState } from "react";
import { obterAcessoFinanceiro } from "../services/api";

import ControleFinanceiroExcluir from "./ControleFinanceiroExcluir";
import ControleFinanceiroEditar from "./ControleFinanceiroEditar";

import "../styles/ControleFinanceiro.css";

const CATEGORIAS_INICIAIS = [
    { id: 1, nome: "Ingredientes", valor: 0, data: "" },
    { id: 2, nome: "Energia", valor: 0, data: "" },
    { id: 3, nome: "Embalagens", valor: 0, data: "" },
    { id: 4, nome: "Entregas", valor: 0, data: "" },
    { id: 5, nome: "Gás", valor: 0, data: "" }
];

const CORES = [
    "#a9f5f5",
    "#f16c70",
    "#ffefad",
    "#7194ed",
    "#51d47e",
    "#b98bd8",
    "#f5ae67"
];

const FORMATADOR_MOEDA = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function ControleFinanceiro() {
    const [categorias, setCategorias] = useState(CATEGORIAS_INICIAIS);

    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const [nome, setNome] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");

    const [editando, setEditando] = useState(false);
    const [periodo, setPeriodo] = useState("mes");

    const [urlPlanilha, setUrlPlanilha] = useState("");
    const [erroApi, setErroApi] = useState("");
    const [carregandoApi, setCarregandoApi] = useState(true);

    const [mostrarTelaExcluir, setMostrarTelaExcluir] = useState(false);
    const [mostrarTelaEditar, setMostrarTelaEditar] = useState(false);

    // Consulta o acesso financeiro no backend
    useEffect(() => {
        async function carregarFinanceiro() {
            try {
                const resposta = await obterAcessoFinanceiro();
                setUrlPlanilha(resposta?.url ?? "");
            } catch (erro) {
                setErroApi(
                    erro.message ||
                    "Não foi possível acessar o financeiro."
                );
            } finally {
                setCarregandoApi(false);
            }
        }

        carregarFinanceiro();
    }, []);

    // Filtra os lançamentos de acordo com o período selecionado
    const categoriasFiltradas = useMemo(() => {
        const hoje = new Date();

        const inicio = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            1
        );

        if (periodo === "mesAnterior") {
            inicio.setMonth(inicio.getMonth() - 1);

            const fim = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                0
            );

            return categorias.filter((categoria) => {
                if (!categoria.data) return false;

                const dataCategoria = new Date(
                    `${categoria.data}T00:00:00`
                );

                return dataCategoria >= inicio &&
                    dataCategoria <= fim;
            });
        }

        if (periodo === "tresMeses") {
            inicio.setMonth(inicio.getMonth() - 2);
        } else if (periodo === "seisMeses") {
            inicio.setMonth(inicio.getMonth() - 5);
        }

        return categorias.filter((categoria) => {
            if (!categoria.data) return false;

            const dataCategoria = new Date(
                `${categoria.data}T00:00:00`
            );

            return dataCategoria >= inicio &&
                dataCategoria <= hoje;
        });
    }, [categorias, periodo]);

    // Calcula o total das saídas do período
    const total = categoriasFiltradas.reduce(
        (soma, categoria) =>
            soma + Number(categoria.valor || 0),
        0
    );

    // Monta as partes coloridas do gráfico
    const gradiente = useMemo(() => {
        if (total === 0) {
            return "#eee5e3";
        }

        let inicio = 0;

        const partes = categoriasFiltradas
            .filter((categoria) => Number(categoria.valor) > 0)
            .map((categoria) => {
                const porcentagem =
                    (Number(categoria.valor) / total) * 100;

                const fim = inicio + porcentagem;

                const indice = categorias.findIndex(
                    (item) => item.id === categoria.id
                );

                const cor = CORES[indice % CORES.length];

                const parte = `${cor} ${inicio}% ${fim}%`;

                inicio = fim;

                return parte;
            });

        return `conic-gradient(${partes.join(", ")})`;
    }, [categoriasFiltradas, categorias, total]);

    // Limpa os campos do formulário
    function limparFormulario() {
        setNome("");
        setValor("");
        setData("");
        setEditando(false);
        setCategoriaSelecionada(null);
    }

    // Adiciona uma categoria ou salva uma edição
    function adicionarCategoria(evento) {
        evento.preventDefault();

        if (!nome.trim() || !valor || !data) {
            alert("Preencha todos os campos.");
            return;
        }

        const valorNumerico = Number(valor);

        if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
            alert("Informe um valor maior que zero.");
            return;
        }

        if (editando && categoriaSelecionada !== null) {
            setCategorias((atuais) =>
                atuais.map((categoria) =>
                    categoria.id === categoriaSelecionada
                        ? {
                            ...categoria,
                            nome: nome.trim(),
                            valor: valorNumerico,
                            data
                        }
                        : categoria
                )
            );
        } else {
            setCategorias((atuais) => [
                ...atuais,
                {
                    id: Date.now(),
                    nome: nome.trim(),
                    valor: valorNumerico,
                    data
                }
            ]);
        }

        limparFormulario();
    }

    // Seleciona uma categoria na legenda
    function selecionarCategoria(categoria) {
        setCategoriaSelecionada(categoria.id);
        setNome(categoria.nome);
        setValor(String(categoria.valor || ""));
        setData(categoria.data || "");
        setEditando(false);
    }

    // Abre a tela de edição
    function editarCategoria() {
        if (categorias.length === 0) {
            alert("Não existem categorias para editar.");
            return;
        }

        setMostrarTelaEditar(true);
    }

    // Abre a tela de exclusão
    function excluirCategoria() {
        if (categorias.length === 0) {
            alert("Não existem categorias para excluir.");
            return;
        }

        setMostrarTelaExcluir(true);
    }

    // Remove as categorias selecionadas na tela de exclusão
    function confirmarExclusao(ids) {
        setCategorias((atuais) =>
            atuais.filter(
                (categoria) => !ids.includes(categoria.id)
            )
        );

        setCategoriaSelecionada(null);
        limparFormulario();
    }

    // Recebe a categoria escolhida na tela de edição
    function confirmarEdicao(categoriasEscolhidas) {
        const categoria = categoriasEscolhidas[0];

        if (categoria) {
            setCategoriaSelecionada(categoria.id);
            setNome(categoria.nome);
            setValor(String(categoria.valor || ""));
            setData(categoria.data || "");
            setEditando(true);
        }

        setMostrarTelaEditar(false);
    }

    // Filtros disponíveis
    const filtros = [
        { id: "mes", texto: "Este Mês" },
        { id: "mesAnterior", texto: "Mês Ant." },
        { id: "tresMeses", texto: "Últim. 3 meses" },
        { id: "seisMeses", texto: "Últim. 6 meses" }
    ];

    // TELA DE EXCLUSÃO
    if (mostrarTelaExcluir) {
        return (
            <ControleFinanceiroExcluir
                categorias={categorias}
                aoFechar={() => setMostrarTelaExcluir(false)}
                aoExcluir={confirmarExclusao}
            />
        );
    }

    // TELA DE EDIÇÃO
    if (mostrarTelaEditar) {
        return (
            <ControleFinanceiroEditar
                categorias={categorias}
                aoFechar={() => setMostrarTelaEditar(false)}
                aoSalvar={confirmarEdicao}
            />
        );
    }

    // TELA PRINCIPAL
    return (
        <main className="controle-financeiro">

            {/* FILTROS DE PERÍODO */}
            <div className="financeiro-filtros">
                {filtros.map((filtro) => (
                    <button
                        key={filtro.id}
                        type="button"
                        className={`filtro-financeiro ${filtro.id} ${
                            periodo === filtro.id ? "filtro-ativo" : ""
                        }`}
                        onClick={() => setPeriodo(filtro.id)}
                    >
                        {filtro.texto}
                    </button>
                ))}
            </div>

            <div className="financeiro-conteudo">

                {/* PRINCIPAIS SAÍDAS */}
                <section className="painel-financeiro painel-saidas">

                    <h2>Principais Saídas</h2>

                    {/* GRÁFICO */}
                    <div className="grafico-area">
                        <div
                            className="grafico-rosca"
                            style={{ background: gradiente }}
                        >
                            <div className="grafico-centro">
                                <strong>
                                    {FORMATADOR_MOEDA.format(total)}
                                </strong>

                                <span>Total de custo</span>
                                <span>mensal</span>
                            </div>
                        </div>
                    </div>

                    {/* LEGENDA */}
                    <div className="financeiro-legenda">
                        {categorias.map((categoria, indice) => (
                            <button
                                key={categoria.id}
                                type="button"
                                className={`item-legenda ${
                                    categoriaSelecionada === categoria.id
                                        ? "legenda-selecionada"
                                        : ""
                                }`}
                                onClick={() =>
                                    selecionarCategoria(categoria)
                                }
                            >
                                <span
                                    className="legenda-cor"
                                    style={{
                                        backgroundColor:
                                            CORES[indice % CORES.length]
                                    }}
                                />

                                <span>{categoria.nome}</span>
                            </button>
                        ))}
                    </div>

                    {/* BOTÕES EDITAR E EXCLUIR */}
                    <div className="financeiro-acoes">

                        <button
                            type="button"
                            className="botao-editar"
                            onClick={editarCategoria}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="botao-excluir"
                            onClick={excluirCategoria}
                        >
                            Excluir
                        </button>

                    </div>

                </section>

                {/* NOVA CATEGORIA */}
                <section className="painel-financeiro painel-nova-categoria">

                    <h2>Nova Categoria</h2>

                    <form onSubmit={adicionarCategoria}>

                        {/* NOME */}
                        <div className="campo-financeiro">
                            <label htmlFor="nome-categoria">
                                Nome da Categoria
                            </label>

                            <input
                                id="nome-categoria"
                                type="text"
                                value={nome}
                                onChange={(evento) =>
                                    setNome(evento.target.value)
                                }
                            />
                        </div>

                        {/* VALOR */}
                        <div className="campo-financeiro">
                            <label htmlFor="valor-categoria">
                                Valor
                            </label>

                            <input
                                id="valor-categoria"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={valor}
                                onChange={(evento) =>
                                    setValor(evento.target.value)
                                }
                            />
                        </div>

                        {/* DATA */}
                        <div className="campo-financeiro">
                            <label htmlFor="data-categoria">
                                Data
                            </label>

                            <input
                                id="data-categoria"
                                type="date"
                                value={data}
                                onChange={(evento) =>
                                    setData(evento.target.value)
                                }
                            />
                        </div>

                        {/* ADICIONAR OU SALVAR */}
                        <button
                            type="submit"
                            className="botao-adicionar"
                        >
                            {editando
                                ? "Salvar Alteração"
                                : "Adicionar"}
                        </button>

                        {editando && (
                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar edição
                            </button>
                        )}

                    </form>

                    {/* MENSAGENS DA API */}
                    {carregandoApi && (
                        <p className="mensagem-financeiro">
                            Consultando acesso financeiro...
                        </p>
                    )}

                    {erroApi && (
                        <p className="erro-financeiro">
                            {erroApi}
                        </p>
                    )}

                    {urlPlanilha && (
                        <a
                            className="link-planilha"
                            href={urlPlanilha}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Abrir planilha financeira
                        </a>
                    )}

                </section>

            </div>
        </main>
    );
}

export default ControleFinanceiro;