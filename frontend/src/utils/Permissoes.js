const PERMISSOES = {
    GERENTE: [
        "dashboard",
        "pedido",
        "carrinho",
        "carrinhoVazio",
        "dados",
        "pedidoRealizado",
        "clientes",
        "consultarPedido",
        "pendentes",
        "detalhePedido",
        "aprovarPedido",
        "alertas",
        "financeiro"
    ],

    CLIENTE: [
        "pedido",
        "carrinho",
        "carrinhoVazio",
        "dados",
        "pedidoRealizado"
    ]
};

// Telas que podem ser acessadas sem autenticação
const TELAS_PUBLICAS = ["login", "cadastro"];

// Telas que exibem a barra de navegação administrativa
const TELAS_COM_BARRA = [
    "dashboard",
    "clientes",
    "consultarPedido",
    "pendentes",
    "alertas",
    "aprovarPedido",
    "financeiro"
];

export function normalizarPerfil(perfil) {
    return String(perfil || "").toUpperCase();
}

export function podeAcessarTela(perfil, tela) {
    if (TELAS_PUBLICAS.includes(tela)) {
        return true;
    }

    const perfilNormalizado = normalizarPerfil(perfil);
    const telasPermitidas = PERMISSOES[perfilNormalizado] || [];

    return telasPermitidas.includes(tela);
}

export function obterTelaInicial(perfil) {
    const perfilNormalizado = normalizarPerfil(perfil);

    if (perfilNormalizado === "GERENTE") {
        return "dashboard";
    }

    if (perfilNormalizado === "CLIENTE") {
        return "pedido";
    }

    return "login";
}

export function podeExibirBarra(perfil, tela) {
    return (
        normalizarPerfil(perfil) === "GERENTE" &&
        TELAS_COM_BARRA.includes(tela)
    );
}