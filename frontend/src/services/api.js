// Módulo único de chamadas ao backend

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
    constructor(status, codigo, message){
        super(message)
        this.status = status;
        this.codigo = codigo;
    }
}

async function request(path, options = {}){
    let resposta;

    try{
        resposta = await fetch('${BASE_URL}${path}',{
            headers: {"Content-Type": "application/json"},
            ...options,
        });
    }catch{
        throw new ApiError(0, "REDE", "Não foi possível conectar ao servidor. Tente novamente.");
    }

    if(!resposta.ok){
         // Formato de erro do backend: { error, message }
        const corpo = await resposta.json().catch(() => ({}));
        throw new ApiError(
            resposta.status,
            corpo.error ?? "ERRO",
            corpo.message ?? "Não foi possível concluir a operação."
        );
    }
    return resposta.status === 204 ? null : resposta.json();
}

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