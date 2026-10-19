// Regras compartilhadas entre as telas de pedidos (Consultar, Pendentes...).

export const STATUS_ATENDIDO = "ENTREGUE";

// Status aceitos pelo banco (ck_pedido_status) -> texto e classe CSS
export const STATUS = {
    PENDENTE: { rotulo: "Pendente", classe: "status-pendente" },
    CONFIRMADO: { rotulo: "Confirmado", classe: "status-pendente" },
    EM_PRODUCAO: { rotulo: "Em produção", classe: "status-pendente" },
    PRONTO: { rotulo: "Pronto", classe: "status-pendente" },
    ENTREGUE: { rotulo: "Entregue", classe: "status-entregue" },
    CANCELADO: { rotulo: "Cancelado", classe: "status-cancelado" }
};

// rf007: pendente = ainda não atendido (nem entregue, nem cancelado)
export const estaPendente = (status) =>
    status !== STATUS_ATENDIDO && status !== "CANCELADO";

// "2026-09-25T15:00:00" -> "25/09"
export const formatarDia = (iso) =>
    iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : "—";

// "2026-09-25T15:00:00" -> "25/09/2026"
export const formatarData = (iso) =>
    iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "—";

// dias de hoje até a data (negativo = atrasado)
export function diasAte(iso) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const alvo = new Date(iso.slice(0, 10) + "T00:00:00");
    return Math.round((alvo - hoje) / 86400000);
}

// rf008: urgente = faltam 2 dias ou menos
export const rotuloPrazo = (dias) => {
    if (dias < 0) return "Atrasado";
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    if (dias === 2) return "2 dias";
    return "";
};