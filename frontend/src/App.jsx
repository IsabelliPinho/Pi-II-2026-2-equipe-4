import { useEffect, useState } from "react";

import { cadastrarPedido } from "./services/api";

import {
    EVENTO_SESSAO_EXPIRADA,
    estaAutenticado,
    limparSessao,
    obterPerfil
} from "./services/auth";

import {
    podeAcessarTela,
    obterTelaInicial,
    podeExibirBarra
} from "./utils/Permissoes";

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
import ControleFinanceiro from "./pages/ControleFinanceiro";

import BarraNavegacao from "./components/BarraNavegacao";

function App() {
    // Sempre inicia na tela de login
    const [tela, setTela] = useState("login");

    const [avisoLogin, setAvisoLogin] = useState("");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [idPedidoAberto, setIdPedidoAberto] = useState(null);

    const perfil = obterPerfil();

    // Impede acesso a telas não permitidas para o perfil
    useEffect(() => {
        if (!estaAutenticado()) {
            if (tela !== "login" && tela !== "cadastro") {
                setTela("login");
            }

            return;
        }

        if (!podeAcessarTela(obterPerfil(), tela)) {
            setTela(obterTelaInicial(obterPerfil()));
        }
    }, [tela]);

    // Trata a expiração da sessão
    useEffect(() => {
        function aoExpirar() {
            setAvisoLogin("Sua sessão expirou. Entre novamente.");
            setCarrinho([]);
            setCliente(null);
            setTela("login");
        }

        window.addEventListener(
            EVENTO_SESSAO_EXPIRADA,
            aoExpirar
        );

        return () => {
            window.removeEventListener(
                EVENTO_SESSAO_EXPIRADA,
                aoExpirar
            );
        };
    }, []);

    function sair() {
        limparSessao();
        setAvisoLogin("");
        setCarrinho([]);
        setCliente(null);
        setTela("login");
    }

    // Direciona o usuário conforme seu perfil
    function entrar(sessao) {
        setAvisoLogin("");
        setCarrinho([]);
        setTela(obterTelaInicial(sessao?.perfil));
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

        const ajustar = (numero) =>
            String(numero).padStart(2, "0");

        return (
            `${data.getFullYear()}-` +
            `${ajustar(data.getMonth() + 1)}-` +
            `${ajustar(data.getDate())}T15:00:00`
        );
    }

    // Finaliza o pedido
    async function finalizarPedido(clienteCadastrado) {
        try {
            if (!clienteCadastrado?.id) {
                alert(
                    "Não foi possível identificar o cliente cadastrado."
                );
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

            console.log(
                "Dados enviados para criar pedido:",
                dadosPedido
            );

            await cadastrarPedido(dadosPedido);

            setCliente(clienteCadastrado);
            setCarrinho([]);
            setTela("pedidoRealizado");

        } catch (erro) {
            console.error("Erro ao criar pedido:", erro);

            if (erro.status !== 401) {
                alert(
                    erro.message ||
                    "Não foi possível criar o pedido."
                );
            }
        }
    }

    // Corrige o acesso à tela antes de renderizá-la
    const telaAtual = estaAutenticado()
        ? (
            podeAcessarTela(perfil, tela)
                ? tela
                : obterTelaInicial(perfil)
        )
        : tela;

    function renderTela() {

        // Cadastro
        if (telaAtual === "cadastro") {
            return (
                <Cadastro
                    voltarLogin={() => setTela("login")}
                />
            );
        }

        // Login
        if (
            telaAtual === "login" ||
            !estaAutenticado()
        ) {
            return (
                <Login
                    aviso={avisoLogin}
                    entrar={entrar}
                    irCadastro={() => setTela("cadastro")}
                />
            );
        }

        // Novo Pedido
        if (telaAtual === "pedido") {
            return (
                <Pedido
                    voltarDashboard={
                        perfil === "GERENTE"
                            ? () => setTela("dashboard")
                            : undefined
                    }
                    adicionarCarrinho={(produto) => {
                        const produtoNormalizado = {
                            ...produto,
                            idProduto:
                                produto.idProduto ?? produto.id
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

        // Carrinho
        if (telaAtual === "carrinho") {
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

        // Carrinho vazio
        if (telaAtual === "carrinhoVazio") {
            return (
                <CarrinhoVazio
                    voltarCarrinho={() => setTela("carrinho")}
                />
            );
        }

        // Dados do cliente
        if (telaAtual === "dados") {
            return (
                <DadosCliente
                    voltarCarrinho={() => setTela("carrinho")}
                    confirmarContato={finalizarPedido}
                />
            );
        }

        // Pedido realizado
        if (telaAtual === "pedidoRealizado") {
            return (
                <PedidoRealizado
                    voltarPedido={() => setTela("pedido")}
                />
            );
        }

        // Dashboard
        if (telaAtual === "dashboard") {
            return (
                <Dashboard
                    abrirDashboard={() => setTela("dashboard")}
                    abrirNovoPedido={() => setTela("pedido")}
                    abrirConsultarPedido={() =>
                        setTela("consultarPedido")
                    }
                    abrirPendentes={() => setTela("pendentes")}
                    abrirFinanceiro={() => setTela("financeiro")}
                    abrirClientes={() => setTela("clientes")}
                    abrirAlertas={() => setTela("alertas")}
                    fecharDashboard={sair}
                />
            );
        }

        // Clientes
        if (telaAtual === "clientes") {
            return (
                <Clientes
                    abrirDashboard={() => setTela("dashboard")}
                    abrirNovoPedido={() => setTela("pedido")}
                    abrirConsultarPedido={() =>
                        setTela("consultarPedido")
                    }
                    abrirPendentes={() => setTela("pendentes")}
                    abrirFinanceiro={() => setTela("financeiro")}
                    abrirClientes={() => setTela("clientes")}
                    abrirAlertas={() => setTela("alertas")}
                    fecharClientes={() => setTela("dashboard")}
                />
            );
        }

        // Consultar pedidos
        if (telaAtual === "consultarPedido") {
            return (
                <ConsultarPedido
                    abrirDashboard={() => setTela("dashboard")}
                    abrirNovoPedido={() => setTela("pedido")}
                    abrirConsultarPedido={() =>
                        setTela("consultarPedido")
                    }
                    abrirPendentes={() => setTela("pendentes")}
                    abrirFinanceiro={() => setTela("financeiro")}
                    abrirClientes={() => setTela("clientes")}
                    abrirAlertas={() => setTela("alertas")}
                    abrirDetalhe={abrirDetalhe}
                    fecharConsultarPedido={() =>
                        setTela("dashboard")
                    }
                />
            );
        }

        // Pedidos pendentes
        if (telaAtual === "pendentes") {
            return (
                <Pendentes
                    voltarDashboard={() => setTela("dashboard")}
                    abrirDetalhe={abrirDetalhe}
                    abrirAprovar={abrirAprovar}
                />
            );
        }

        // Alertas
        if (telaAtual === "alertas") {
            return (
                <Alertas
                    voltarDashboard={() => setTela("dashboard")}
                    abrirNovoPedido={() => setTela("pedido")}
                    abrirConsultarPedido={() =>
                        setTela("consultarPedido")
                    }
                    abrirPendentes={() => setTela("pendentes")}
                    abrirFinanceiro={() => setTela("financeiro")}
                    abrirClientes={() => setTela("clientes")}
                    abrirDetalhe={abrirDetalhe}
                />
            );
        }

        // Aprovar pedido
        if (telaAtual === "aprovarPedido") {
            return (
                <AprovarPedido
                    idPedido={idPedidoAberto}
                    voltar={() => setTela("pendentes")}
                />
            );
        }

        // Detalhes do pedido
        if (telaAtual === "detalhePedido") {
            return (
                <DetalhePedido
                    idPedido={idPedidoAberto}
                    voltarDashboard={() => setTela("dashboard")}
                    abrirNovoPedido={() => setTela("pedido")}
                    abrirConsultarPedido={() =>
                        setTela("consultarPedido")
                    }
                    abrirPendentes={() => setTela("pendentes")}
                    abrirFinanceiro={() => setTela("financeiro")}
                    abrirClientes={() => setTela("clientes")}
                    abrirAlertas={() => setTela("alertas")}
                    editarPedido={() => {}}
                />
            );
        }

        // Controle financeiro
        if (telaAtual === "financeiro") {
            return <ControleFinanceiro />;
        }

        return null;
    }

    // Somente o gerente visualiza a barra administrativa
    const mostrarBarra =
        estaAutenticado() &&
        podeExibirBarra(perfil, telaAtual);

    if (!mostrarBarra) {
        return renderTela();
    }

    return (
        <>
            <BarraNavegacao
                telaAtiva={
                    telaAtual === "aprovarPedido"
                        ? "pendentes"
                        : telaAtual
                }
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() =>
                    setTela("consultarPedido")
                }
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => setTela("financeiro")}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
                fechar={
                    telaAtual === "dashboard"
                        ? sair
                        : () => setTela("dashboard")
                }
            />

            {renderTela()}
        </>
    );
}

export default App;