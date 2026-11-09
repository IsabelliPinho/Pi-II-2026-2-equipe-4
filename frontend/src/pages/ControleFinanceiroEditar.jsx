import { useState } from "react";
import "../styles/ControleFinanceiroEditar.css";

const ORDEM_CATEGORIAS = [
    "Ingredientes",
    "Entregas",
    "Embalagens",
    "Gás",
    "Energia"
];

function ControleFinanceiroEditar({
    categorias,
    aoFechar,
    aoSalvar
}) {
    const categoriasOrdenadas = ORDEM_CATEGORIAS
        .map((nome) =>
            categorias.find((categoria) => categoria.nome === nome)
        )
        .filter(Boolean);

    const [selecionadas, setSelecionadas] = useState(
        categoriasOrdenadas.map((categoria) => categoria.id)
    );

    function alterarSelecao(indice, novoId) {
        setSelecionadas((atuais) =>
            atuais.map((id, i) =>
                i === indice ? Number(novoId) : id
            )
        );
    }

    function salvar() {
        const categoriasEscolhidas = selecionadas
            .map((id) =>
                categorias.find((categoria) => categoria.id === id)
            )
            .filter(Boolean);

        if (categoriasEscolhidas.length === 0) {
            alert("Selecione uma categoria.");
            return;
        }

        aoSalvar(categoriasEscolhidas);
    }

    return (
        <div className="financeiro-editar-container">

            {/* BARRA SUPERIOR */}
            <header className="financeiro-editar-header">

                <div className="financeiro-editar-logo">
                    <div className="financeiro-editar-logo-circulo">
                        <span>GM</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="financeiro-editar-fechar"
                    onClick={aoFechar}
                    aria-label="Fechar"
                >
                    ×
                </button>

            </header>

            {/* PAINEL CENTRAL */}
            <main className="financeiro-editar-painel">

                <button
                    type="button"
                    className="financeiro-editar-fechar-painel"
                    onClick={aoFechar}
                    aria-label="Fechar painel"
                >
                    ×
                </button>

                <h2>Qual categoria deseja editar?</h2>

                <div className="financeiro-editar-lista">

                    {categoriasOrdenadas.map((categoria, indice) => (
                        <div
                            className="financeiro-editar-campo"
                            key={categoria.id}
                        >
                            <select
                                value={selecionadas[indice] ?? categoria.id}
                                onChange={(evento) =>
                                    alterarSelecao(
                                        indice,
                                        evento.target.value
                                    )
                                }
                                aria-label={`Categoria ${categoria.nome}`}
                            >
                                {categorias.map((opcao) => (
                                    <option
                                        key={opcao.id}
                                        value={opcao.id}
                                    >
                                        {opcao.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                </div>

                <button
                    type="button"
                    className="financeiro-editar-salvar"
                    onClick={salvar}
                >
                    Salvar
                </button>

            </main>

        </div>
    );
}

export default ControleFinanceiroEditar;