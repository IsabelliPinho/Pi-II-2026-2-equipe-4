import { useState } from "react";
import "../styles/Cadastro.css";

function Cadastro({ voltarLogin }) {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [repetirSenhaVisivel, setRepetirSenhaVisivel] = useState(false);

    return (
        <div className="cadastro-container">

            <div className="cadastro-card">

                {/* CAMPO NOME */}
                <div className="campo-cadastro">

                    <span className="icone-cadastro">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M4 21C4 16.8 7.6 14 12 14C16.4 14 20 16.8 20 21"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>

                    <input
                        type="text"
                        placeholder="Nome"
                    />

                </div>


                {/* CAMPO E-MAIL */}
                <div className="campo-cadastro">

                    <span className="icone-cadastro">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="14"
                                rx="2"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M4 7L12 13L20 7"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                    <input
                        type="email"
                        placeholder="E-mail"
                    />

                </div>


                {/* CAMPO SENHA */}
                <div className="campo-cadastro">

                    <span className="icone-cadastro">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="11"
                                rx="2"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>

                    <input
                        type={senhaVisivel ? "text" : "password"}
                        placeholder="Senha"
                    />

                </div>


                {/* REPETIR SENHA */}
                <div className="campo-cadastro">

                    <span className="icone-cadastro">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="11"
                                rx="2"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                                stroke="#5B292B"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>

                    <input
                        type={
                            repetirSenhaVisivel
                                ? "text"
                                : "password"
                        }
                        placeholder="Repita a Senha"
                    />

                    <button
                        type="button"
                        className="olho-cadastro"
                        onClick={() =>
                            setRepetirSenhaVisivel(
                                !repetirSenhaVisivel
                            )
                        }
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                                stroke="#B77C89"
                                strokeWidth="1.6"
                            />

                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="#B77C89"
                                strokeWidth="1.6"
                            />
                        </svg>
                    </button>

                </div>


                {/* BOTÃO CADASTRAR */}
                <button className="botao-cadastrar">
                    Cadastrar
                </button>


                {/* VOLTAR */}
                <button
                    className="voltar-login"
                    onClick={voltarLogin}
                >
                    Já possui cadastro? Entrar
                </button>

            </div>

        </div>
    );
}

export default Cadastro;