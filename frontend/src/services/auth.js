// Sessão do usuário: token e perfil guardados no navegador
const CHAVE = "gabicake.sessao";

export const EVENTO_SESSAO_EXPIRADA = "gabicake:sessao-expirada";

export function salvarSessao({ token = null, id, nome, login, perfis = []}) {
    localStorage.setItem(CHAVE, JSON.stringify({ token, id, nome, login, perfis}));
}

export function obterSessao() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE));
    } catch {
        return null;
    }
}

export const obterToken = () => obterSessao()?.token ?? null;
export const obterPerfil = () => obterSessao()?.perfil ?? null;
export const estaAutenticado = () => Boolean(obterSessao()?.id);

export function limparSessao() {
    localStorage.removeItem(CHAVE);
}

// Chamado pelo api.js quando o backend responde 401 numa rota protegida
export function sessaoExpirou() {
    limparSessao();
    window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
}