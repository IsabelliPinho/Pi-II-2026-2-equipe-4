import "../styles/DadosCliente.css";

function DadosCliente({ voltarCarrinho, confirmarContato }) {
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
                        />

                    </div>


                    {/* TELEFONE */}
                    <div className="campo-dados">

                        <label>Telefone</label>

                        <input
                            type="tel"
                        />

                    </div>


                    {/* ENDEREÇO */}
                    <div className="campo-dados">

                        <label>Endereço</label>

                        <input
                            type="text"
                        />

                    </div>


                    {/* CONFIRMAR */}
                    <button
                        className="botao-confirmar-contato"
                        onClick={confirmarContato}
                    >
                        Confirmar Contato
                    </button>

                </div>

            </main>

        </div>
    );
}

export default DadosCliente;