import { useEffect, useState } from "react";

import { cadastrarPedido } from "./services/api";
import {
    EVENTO_SESSAO_EXPIRADA,
    estaAutenticado,
    limparSessao
} from "./services/auth";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Carrinho from "./pages/Carrinho";
import DadosCliente from "./pages/DadosCliente";
import CarrinhoVazio from "./pages/CarrinhoVazio";
import PedidoRealizado from "./pages/PedidoRealizado";
import Pedido from "./pages/Pedido";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ConsultarPedido from "./pages/ConsultarPedido";
import Pendentes from "./pages/Pendentes";
import DetalhePedido from "./pages/DetalhePedido";
import Alertas from "./pages/Alertas";
import AprovarPedido from "./pages/AprovarPedido";
import BarraNavegacao from "./components/BarraNavegacao";

// Telas do painel que mostram a barra fixa (Novo Pedido e Detalhe ficam só com o X)
const TELAS_COM_BARRA = [
    "dashboard",
    "clientes",
    "consultarPedido",
    "pendentes",
    "alertas",
    "aprovarPedido"
];

function App() {
    const [tela, setTela] = useState(
        estaAutenticado() ? "dashboard" : "login"
    );
    const [avisoLogin, setAvisoLogin] = useState("");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [idPedidoAberto, setIdPedidoAberto] = useState(null);

    // 401 em qualquer requisição: volta para o login
    useEffect(() => {
        function aoExpirar() {
            setAvisoLogin("Sua sessão expirou. Entre novamente.");
            setCarrinho([]);
            setTela("login");
        }

        window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
        return () =>
            window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    }, []);

    function sair() {
        limparSessao();
        setAvisoLogin("");
        setCarrinho([]);
        setTela("login");
    }

    function abrirAprovar(id) {
        setIdPedidoAberto(id);
        setTela("aprovarPedido");
    }

    function abrirDetalhe(id) {
        setIdPedidoAberto(id);
        setTela("detalhePedido");
    }

    function calcularDataPrevista() {
        const data = new Date();

        data.setDate(data.getDate() + 7);
        data.setHours(15, 0, 0, 0);

        const ajustar = (numero) => String(numero).padStart(2, "0");

        return (
            `${data.getFullYear()}-` +
            `${ajustar(data.getMonth() + 1)}-` +
            `${ajustar(data.getDate())}T15:00:00`
        );
    }

    async function finalizarPedido(clienteCadastrado) {
        try {
            if (!clienteCadastrado?.id) {
                alert("Não foi possível identificar o cliente cadastrado.");
                return;
            }

            if (carrinho.length === 0) {
                alert("Adicione pelo menos um produto ao carrinho.");
                return;
            }

            const itens = carrinho.map((produto) => ({
                idProduto: produto.idProduto ?? produto.id,
                quantidade: produto.quantidade || 1
            }));

            const dadosPedido = {
                idCliente: clienteCadastrado.id,
                nomeGerente: "Gabriela",
                dataPrevista: calcularDataPrevista(),
                formaEntrega: "RETIRADA",
                itens
            };

            console.log("Dados enviados para criar pedido:", dadosPedido);

            await cadastrarPedido(dadosPedido);

            setCliente(clienteCadastrado);
            setCarrinho([]);
            setTela("pedidoRealizado");
        } catch (erro) {
            console.error("Erro ao criar pedido:", erro);

            // 401 já redireciona para o login; os demais mostram a mensagem da API
            if (erro.status !== 401) {
                alert(
                    erro.message ||
                    "Não foi possível criar o pedido."
                );
            }
        }
    }

    function renderTela() {
    // Sem login só abre a tela de login (Matriz de Autorização, T010)
    if (tela === "login" || !estaAutenticado()) {
        return (
            <Login
                aviso={avisoLogin}
                entrar={() => {
                    setAvisoLogin("");
                    setTela("dashboard");
                }}
            />
        );
    }

    if (tela === "cadastro") {
        return <Cadastro voltarLogin={() => setTela("dashboard")} />;
    }

    if (tela === "pedido") {
        return (
            <Pedido
                voltarDashboard={() => setTela("dashboard")}
                adicionarCarrinho={(produto) => {
                    const produtoNormalizado = {
                        ...produto,
                        idProduto: produto.idProduto ?? produto.id
                    };

                    setCarrinho((carrinhoAtual) => [
                        ...carrinhoAtual,
                        produtoNormalizado
                    ]);

                    setTela("carrinho");
                }}
            />
        );
    }

    if (tela === "carrinho") {
        return (
            <Carrinho
                carrinho={carrinho}
                adicionarProduto={() => setTela("pedido")}
                realizarPedido={() => setTela("dados")}
                fecharCarrinho={() => setTela("pedido")}
                esvaziarCarrinho={() => {
                    setCarrinho([]);
                    setTela("carrinhoVazio");
                }}
            />
        );
    }

    if (tela === "carrinhoVazio") {
        return <CarrinhoVazio voltarCarrinho={() => setTela("carrinho")} />;
    }

    if (tela === "dados") {
        return (
            <DadosCliente
                voltarCarrinho={() => setTela("carrinho")}
                confirmarContato={finalizarPedido}
            />
        );
    }

    if (tela === "pedidoRealizado") {
        return (
            <PedidoRealizado voltarPedido={() => setTela("pedido")} />
        );
    }

    if (tela === "dashboard") {
        return (
            <Dashboard
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                fecharDashboard={sair}
            />
        );
    }

    if (tela === "clientes") {
        return (
            <Clientes
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                fecharClientes={() => setTela("dashboard")}
            />
        );
    }

    if (tela === "consultarPedido") {
        return (
            <ConsultarPedido
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                abrirDetalhe={abrirDetalhe}
                fecharConsultarPedido={() => setTela("dashboard")}
            />
        );
    }

    if (tela === "pendentes") {
        return (
            <Pendentes
                voltarDashboard={() => setTela("dashboard")}
                abrirDetalhe={abrirDetalhe}
                abrirAprovar={abrirAprovar}
            />
        );
    }

    if (tela === "alertas") {
        return (
            <Alertas
                voltarDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirDetalhe={abrirDetalhe}
            />
        );
    }

    if (tela === "aprovarPedido") {
        return (
            <AprovarPedido
                idPedido={idPedidoAberto}
                voltar={() => setTela("pendentes")}
            />
        );
    }

    if (tela === "detalhePedido") {
        return (
            <DetalhePedido
                idPedido={idPedidoAberto}
                voltarDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                editarPedido={() => {}}
            />
        );
    }

    return (
        <Dashboard
            abrirDashboard={() => setTela("dashboard")}
            abrirNovoPedido={() => setTela("pedido")}
            abrirConsultarPedido={() => setTela("consultarPedido")}
            abrirPendentes={() => setTela("pendentes")}
            abrirFinanceiro={() => abrirDetalhe(null)}
            abrirClientes={() => setTela("clientes")}
            abrirAlertas={() => setTela("alertas")}
            fecharDashboard={sair}
        />
    );
    }

    const mostrarBarra = estaAutenticado() && TELAS_COM_BARRA.includes(tela);

    if (!mostrarBarra) return renderTela();

    return (
        <>
            <BarraNavegacao
                telaAtiva={tela === "aprovarPedido" ? "pendentes" : tela}
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                fechar={tela === "dashboard" ? sair : () => setTela("dashboard")}
            />
            {renderTela()}
        </>
    );
}

export default App;