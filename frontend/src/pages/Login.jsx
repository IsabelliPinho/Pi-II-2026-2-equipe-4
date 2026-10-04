import { useState } from "react";
import "../styles/Login.css";

function Login({ abrirCadastro, entrar }) {
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    return (
        <div className="login-container">

            {/* CARD DE LOGIN */}
            <div className="login-card">

                {/* ÍCONE GRANDE DE USUÁRIO */}
                <div className="usuario-icon">
                    <div className="cabeca"></div>
                    <div className="corpo"></div>
                </div>

                {/* CAMPO USUÁRIO */}
                <div className="campo">
                    <span className="icone">

                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                                stroke="#5B292B"
                                strokeWidth="2"
                            />

                            <path
                                d="M4 21C4 16.6 7.6 14 12 14C16.4 14 20 16.6 20 21"
                                stroke="#5B292B"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                    </span>

                    <input
                        type="text"
                        placeholder="Usuário"
                    />
                </div>

                {/* CAMPO SENHA */}
                <div className="campo">
                    <span className="icone">

                        <svg
                            width="24"
                            height="24"
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
                                strokeWidth="2"
                            />

                            <path
                                d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                                stroke="#5B292B"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                    </span>

                    <input
                        type={senhaVisivel ? "text" : "password"}
                        placeholder="Senha"
                    />

                    <button
                        type="button"
                        className="mostrar-senha"
                        onClick={() =>
                            setSenhaVisivel(!senhaVisivel)
                        }
                    >
                        {senhaVisivel ? "◉" : "○"}
                    </button>
                </div>

                {/* LINKS */}
                <div className="links-login">

                    {/* IR PARA CADASTRO */}
                    <button
                        className="link-cadastro"
                        onClick={abrirCadastro}
                    >
                        Não possui Cadastro?
                    </button>

                    <a href="#">
                        Esqueceu a senha?
                    </a>

                </div>

                {/* BOTÃO ENTRAR */}
                <button
                    className="botao-entrar"
                    onClick={entrar}
                >
                    ENTRAR
                </button>

            </div>

        </div>
    );
}

export default Login;