import { useState } from "react";
import { login, recuperarSenha } from "../services/api";
import { salvarSessao } from "../services/auth";
import "../styles/Login.css";

function Login({ entrar, aviso }) {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [recuperando, setRecuperando] = useState(false);
    const [mensagemRecuperacao, setMensagemRecuperacao] = useState("");

    function abrirRecuperacao() {
        setErro("");
        setMensagemRecuperacao("");
        setRecuperando(true);
    }

    function voltarAoLogin() {
        setErro("");
        setMensagemRecuperacao("");
        setRecuperando(false);
    }

    async function enviarRecuperacao(e) {
        e.preventDefault();

        if (!usuario.trim()) {
            setErro("Informe o usuário.");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            await recuperarSenha(usuario.trim());
            // Mesma mensagem exista ou não o usuário
            setMensagemRecuperacao(
                "Se o usuário existir, enviaremos as instruções para redefinir a senha."
            );
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    async function enviar(e) {
        e.preventDefault();

        if (!usuario.trim() || !senha) {
            setErro("Informe usuário e senha.");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            const sessao = await login(usuario.trim(), senha);
            salvarSessao(sessao);
            entrar(sessao);
        } catch (err) {
            // Não revela qual dos dois está errado
            setErro(
                err.status === 401
                    ? "Usuário ou senha inválidos."
                    : err.message
            );
        } finally {
            setCarregando(false);
        }
    }

    if (recuperando) {
        return (
            <div className="login-container">
                <form className="login-card" onSubmit={enviarRecuperacao}>
                    <h2 className="login-titulo">Recuperar senha</h2>

                    <div className="campo">
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    {mensagemRecuperacao && (
                        <p className="login-aviso">{mensagemRecuperacao}</p>
                    )}
                    {erro && <p className="login-erro" role="alert">{erro}</p>}

                    <button
                        type="submit"
                        className="botao-entrar"
                        disabled={carregando}
                    >
                        {carregando ? "ENVIANDO..." : "ENVIAR"}
                    </button>

                    <div className="links-login">
                        <button
                            type="button"
                            className="link-cadastro"
                            onClick={voltarAoLogin}
                        >
                            Voltar ao login
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="login-container">

            {/* CARD DE LOGIN */}
            <form className="login-card" onSubmit={enviar}>

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
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        autoComplete="username"
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
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoComplete="current-password"
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

                {aviso && <p className="login-aviso">{aviso}</p>}
                {erro && <p className="login-erro" role="alert">{erro}</p>}

                {/* LINKS */}
                <div className="links-login">
                    <button
                        type="button"
                        className="link-cadastro"
                        onClick={abrirRecuperacao}
                    >
                        Esqueceu a senha?
                    </button>
                </div>

                {/* BOTÃO ENTRAR */}
                <button
                    type="submit"
                    className="botao-entrar"
                    disabled={carregando}
                >
                    {carregando ? "ENTRANDO..." : "ENTRAR"}
                </button>

            </form>

        </div>
    );
}

export default Login;