import { useState } from "react";
import "../styles/DadosCliente.css";

function DadosCliente({ voltarCarrinho, confirmarContato }) {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function cadastrarCliente() {
        if (!nome || !telefone || !endereco) {
            alert("Preencha todos os campos.");
            return;
        }

        setEnviando(true);

        try {
            const resposta = await fetch("http://localhost:8080/clientes/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    telefones: [telefone],
                    bairro: "",
                    rua: endereco,
                    numCasa: "",
                    cep: ""
                })
            });

            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar cliente");
            }

            const cliente = await resposta.json();

            console.log("Cliente cadastrado:", cliente);

            confirmarContato(cliente);

        } catch (erro) {
            console.error("Erro ao cadastrar cliente:", erro);
            alert("Não foi possível cadastrar o cliente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="dados-container">

            {/* BARRA SUPERIOR */}
            <header className="dados-header">

                <button
                    className="botao-fechar-dados"
                    onClick={voltarCarrinho}
                >
                    ×
                </button>

            </header>


            {/* BARRA VERDE */}
            <div className="barra-quase-la">
                Quase lá...
            </div>


            {/* CONTEÚDO */}
            <main className="dados-conteudo">

                {/* TÍTULO */}
                <div className="titulo-dados">

                    <div className="icone-usuario-dados">

                        <div className="cabeca-dados"></div>

                        <div className="corpo-dados"></div>

                    </div>

                    <h1>Dados pra contato</h1>

                </div>


                {/* FORMULÁRIO */}
                <div className="formulario-dados">

                    {/* NOME */}
                    <div className="campo-dados">

                        <label>Nome</label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                    </div>


                    {/* TELEFONE */}
                    <div className="campo-dados">

                        <label>Telefone</label>

                        <input
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />

                    </div>


                    {/* ENDEREÇO */}
                    <div className="campo-dados">

                        <label>Endereço</label>

                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                    </div>


                    {/* CONFIRMAR */}
                    <button
                        className="botao-confirmar-contato"
                        onClick={cadastrarCliente}
                        disabled={enviando}
                    >
                        {enviando ? "Cadastrando..." : "Confirmar Contato"}
                    </button>

                </div>

            </main>

        </div>
    );
}

export default DadosCliente;