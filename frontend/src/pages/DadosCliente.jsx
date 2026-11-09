import { useState } from "react";
import "../styles/DadosCliente.css";
import { cadastrarCliente } from "../services/api";

function DadosCliente({ voltarCarrinho, confirmarContato }) {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [rua, setRua] = useState("");
    const [numCasa, setNumCasa] = useState("");
    const [bairro, setBairro] = useState("");
    const [cep, setCep] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <= 2) {
            return numeros.length ? `(${numeros}` : "";
        }

        if (numeros.length <= 6) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        }

        if (numeros.length <= 10) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
        }

        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }

    function formatarCep(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 8);

        if (numeros.length > 5) {
            return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
        }

        return numeros;
    }

    async function handleConfirmar(event) {
        event.preventDefault();

        if (carregando) return;

        setErro("");

        const telefoneNumeros = telefone.replace(/\D/g, "");
        const cepFormatado = formatarCep(cep);

        if (!nome.trim()) {
            setErro("Informe seu nome completo.");
            return;
        }

        if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
            setErro("Informe um telefone com DDD válido.");
            return;
        }

        if (!rua.trim()) {
            setErro("Informe o nome da rua.");
            return;
        }

        if (!numCasa.trim()) {
            setErro("Informe o número da casa.");
            return;
        }

        if (!bairro.trim()) {
            setErro("Informe seu bairro.");
            return;
        }

        if (!/^\d{5}-\d{3}$/.test(cepFormatado)) {
            setErro("Informe um CEP válido no formato 00000-000.");
            return;
        }

        if (typeof confirmarContato !== "function") {
            setErro("A função de confirmação não foi configurada.");
            return;
        }

        const dadosCliente = {
            nome: nome.trim(),
            telefones: [formatarTelefone(telefone)],
            rua: rua.trim(),
            numCasa: numCasa.trim(),
            bairro: bairro.trim(),
            cep: cepFormatado,
        };

        try {
            setCarregando(true);

            const resultado = await cadastrarCliente(dadosCliente);

            if (!resultado?.id) {
                throw new Error(
                    "A API não retornou o ID do cliente cadastrado."
                );
            }

            await confirmarContato(resultado);
        } catch (error) {
            console.error("Erro ao confirmar contato:", error);

            setErro(
                error.message ||
                "Não foi possível concluir a operação. Tente novamente."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="dados-cliente">
            <header className="dados-cliente-header">
                <button
                    type="button"
                    className="dados-cliente-fechar"
                    onClick={voltarCarrinho}
                    aria-label="Fechar"
                    disabled={carregando}
                >
                    ×
                </button>
            </header>

            <div className="dados-cliente-progresso">
                Quase lá...
            </div>

            <main className="dados-cliente-conteudo">
                <div className="dados-cliente-titulo">
                    <div className="dados-cliente-icone">
                        <span className="dados-cliente-cabeca" />
                        <span className="dados-cliente-corpo" />
                    </div>

                    <h1>Dados pra contato</h1>
                </div>

                <form
                    className="dados-cliente-formulario"
                    onSubmit={handleConfirmar}
                >
                    <div className="dados-cliente-campo">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="dados-cliente-campo">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={(e) =>
                                setTelefone(formatarTelefone(e.target.value))
                            }
                            maxLength={16}
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="dados-cliente-campo">
                        <label htmlFor="rua">Endereço</label>
                        <input
                            id="rua"
                            type="text"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="dados-cliente-campo dados-cliente-campo-extra">
                        <label htmlFor="numCasa">Número</label>
                        <input
                            id="numCasa"
                            type="text"
                            value={numCasa}
                            onChange={(e) => setNumCasa(e.target.value)}
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="dados-cliente-campo dados-cliente-campo-extra">
                        <label htmlFor="bairro">Bairro</label>
                        <input
                            id="bairro"
                            type="text"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="dados-cliente-campo dados-cliente-campo-extra">
                        <label htmlFor="cep">CEP</label>
                        <input
                            id="cep"
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(formatarCep(e.target.value))}
                            maxLength={9}
                            required
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <p className="dados-cliente-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="dados-cliente-confirmar"
                        disabled={carregando}
                    >
                        {carregando ? "Processando..." : "Confirmar Contato"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default DadosCliente;