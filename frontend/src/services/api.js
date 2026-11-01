// Módulo único de chamadas ao backend
import { obterToken, sessaoExpirou } from "./auth.js";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
    constructor(status, codigo, message){
        super(message)
        this.status = status;
        this.codigo = codigo;
    }
}

async function request(path, { semToken = false, headers, ...options } = {}){
    let resposta;

    const cabecalhos = { "Content-Type": "application/json", ...headers };
    const token = obterToken();
    if (token && !semToken) cabecalhos.Authorization = `Bearer ${token}`;

    try{
        resposta = await fetch(`${BASE_URL}${path}`,{ ...options, headers: cabecalhos });
    }catch{
        throw new ApiError(0, "REDE", "Não foi possível conectar ao servidor. Tente novamente.");
    }

    if(!resposta.ok){
         // Formato de erro do backend: { error, message }
        const corpo = await resposta.json().catch(() => ({}));

        // 401 em rota protegida = sessão expirada ou token inválido
        if (resposta.status === 401 && !semToken) sessaoExpirou();

        throw new ApiError(
            resposta.status,
            corpo.error ?? "ERRO",
            corpo.message ?? "Não foi possível concluir a operação."
        );
    }
    return resposta.status === 204 ? null : resposta.json();
}

/* Autenticação - POST /auth/login -> { token, perfil, nome } */
export const login = (usuario, senha) =>
    LOGIN_FAKE
        ? loginFake(usuario, senha)
        : request("/auth/login", { method: "POST", semToken: true, body: JSON.stringify({ usuario, senha }) });

// ---------------------------------------------------------------
// APENAS DESENVOLVIMENTO: login sem backend (VITE_LOGIN_FAKE=true no .env.local).
// REMOVER quando o POST /auth/login do backend estiver pronto.
// ---------------------------------------------------------------
const LOGIN_FAKE = import.meta.env.VITE_LOGIN_FAKE === "true";

async function loginFake(usuario, senha) {
    const gerentes = [
        "Gabriela Almeida",
        "Rafael Monteiro",
        "Camila Duarte",
        "Lucas Ferreira",
        "Beatriz Nogueira"
    ];

    if (!gerentes.includes(usuario) || senha !== "Senha@123") {
        throw new ApiError(401, "CREDENCIAIS_INVALIDAS", "Usuário ou senha inválidos.");
    }

    return { token: "token-fake-dev", perfil: "GERENTE", nome: usuario };
}

/* Recuperação de senha - POST /auth/recuperar-senha { usuario } (resposta sempre genérica) */
export const recuperarSenha = (usuario) =>
    request("/auth/recuperar-senha", { method: "POST", semToken: true, body: JSON.stringify({ usuario }) });

/*RF002 - busca clientes*/
export const buscarClientes = (busca = "") =>
    request(`/clientes/busca?busca=${encodeURIComponent(busca)}`);

/*RF001 cadastro clientes*/
export const cadastrarCliente = (cliente) =>
    request("/clientes/cadastro", { method: "POST", body: JSON.stringify(cliente) });

/*RF003 consulta pedidos */
export const consultarPedidos = ({ status, inicio, fim } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (inicio) params.set("inicio", inicio);
    if (fim) params.set("fim", fim);
    const qs = params.toString();
    return request(`/pedidos/consulta${qs ? `?${qs}` : ""}`);
};

//RF003
export const buscarPedido = (id) => request(`/pedidos/${id}`);

//RF004, RF007, RF009
export const atualizarPedido = (id, alteracoes) =>
    request(`/pedidos/${id}`, { method: "PATCH", body: JSON.stringify(alteracoes) });

//RF003
export const listarProdutos = () => request("/listar/produtos");

//RF003
export const cadastrarPedido = (pedido) =>
    request("/pedidos/cadastro", { method: "POST", body: JSON.stringify(pedido) });