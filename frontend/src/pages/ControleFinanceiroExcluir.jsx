import { useState } from "react";
import "../styles/ControleFinanceiroExcluir.css";

const ORDEM_CATEGORIAS = [
    "Ingredientes",
    "Energia",
    "Entregas",
    "Gás",
    "Embalagens"
];

function ControleFinanceiroExcluir({
    categorias,
    aoFechar,
    aoExcluir
}) {
    // Inicialmente seleciona Energia e Embalagens,
    // conforme o estado mostrado na referência.
    const [selecionadas, setSelecionadas] = useState(
        () =>
            new Set(
                categorias
                    .filter((categoria) =>
                        ["Energia", "Embalagens"].includes(categoria.nome)
                    )
                    .map((categoria) => categoria.id)
            )
    );

    const categoriasOrdenadas = [...categorias].sort((a, b) => {
        const posicaoA = ORDEM_CATEGORIAS.indexOf(a.nome);
        const posicaoB = ORDEM_CATEGORIAS.indexOf(b.nome);

        return (posicaoA === -1 ? 999 : posicaoA) -
               (posicaoB === -1 ? 999 : posicaoB);
    });

    function alternarSelecao(id) {
        setSelecionadas((atuais) => {
            const novasSelecionadas = new Set(atuais);

            if (novasSelecionadas.has(id)) {
                novasSelecionadas.delete(id);
            } else {
                novasSelecionadas.add(id);
            }

            return novasSelecionadas;
        });
    }

    function deletarCategorias() {
        if (selecionadas.size === 0) {
            alert("Selecione pelo menos uma categoria.");
            return;
        }

        const nomes = categorias
            .filter((categoria) => selecionadas.has(categoria.id))
            .map((categoria) => categoria.nome);

        const confirmar = window.confirm(
            `Deseja excluir as categorias: ${nomes.join(", ")}?`
        );

        if (!confirmar) return;

        aoExcluir([...selecionadas]);
        aoFechar();
    }

    return (
        <div className="financeiro-excluir-container">

            {/* BARRA SUPERIOR */}
            <header className="financeiro-excluir-header">

                <div className="financeiro-excluir-logo">
                    <div className="financeiro-excluir-logo-circulo">
                        <span>GM</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="financeiro-excluir-fechar"
                    onClick={aoFechar}
                    aria-label="Fechar"
                >
                    ×
                </button>

            </header>

            {/* PAINEL */}
            <main className="financeiro-excluir-painel">

                <button
                    type="button"
                    className="financeiro-excluir-fechar-painel"
                    onClick={aoFechar}
                    aria-label="Fechar painel"
                >
                    ×
                </button>

                <h2>Qual categoria deseja excluir?</h2>

                <div className="financeiro-excluir-lista">

                    {categoriasOrdenadas.map((categoria) => (
                        <label
                            key={categoria.id}
                            className="financeiro-excluir-opcao"
                        >
                            <input
                                type="checkbox"
                                checked={selecionadas.has(categoria.id)}
                                onChange={() =>
                                    alternarSelecao(categoria.id)
                                }
                            />

                            <span>{categoria.nome}</span>
                        </label>
                    ))}

                </div>

                <button
                    type="button"
                    className="financeiro-excluir-deletar"
                    onClick={deletarCategorias}
                >
                    Deletar
                </button>

            </main>

        </div>
    );
}

export default ControleFinanceiroExcluir;