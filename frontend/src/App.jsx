
import { useState } from "react";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pedido from "./pages/Pedido";
import Carrinho from "./pages/Carrinho";
import DadosCliente from "./pages/DadosCliente";
import CarrinhoVazio from "./pages/CarrinhoVazio";
import PedidoRealizado from "./pages/PedidoRealizado";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ConsultarPedido from "./pages/ConsultarPedido";
import Pendentes from "./pages/Pendentes";
import DetalhePedido from "./pages/DetalhePedido";

function App() {
    const [tela, setTela] = useState("dashboard");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);

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
                idProduto: produto.idProduto,
                quantidade: 1
            }));

            const dadosPedido = {
                idCliente: clienteCadastrado.id,
                nomeGerente: "Gabriela",
                dataPrevista: calcularDataPrevista(),
                formaEntrega: "RETIRADA",
                itens: itens
            };

            console.log("Dados enviados para criar pedido:", dadosPedido);

            const resposta = await fetch(
                "http://localhost:8080/pedidos/cadastro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosPedido)
                }
            );

            if (!resposta.ok) {
                const erro = await resposta.text();

                console.error("Erro ao criar pedido:", erro);

                alert(
                    "O cliente foi cadastrado, mas não foi possível criar o pedido. Verifique o console."
                );

                return;
            }

            const pedidoCriado = await resposta.json();

            console.log("Pedido criado:", pedidoCriado);

            setCliente(clienteCadastrado);
            setCarrinho([]);
            setTela("pedidoRealizado");
        } catch (erro) {
            console.error("Erro ao criar pedido:", erro);

            alert("Erro de conexão ao tentar criar o pedido.");
        }
    }

    if (tela === "cadastro") {
        return (
            <Cadastro
                voltarLogin={() => setTela("login")}
            />
        );
    }

    if (tela === "pedido") {
        return (
            <Pedido
                adicionarCarrinho={(produto) => {
                    setCarrinho((carrinhoAtual) => [
                        ...carrinhoAtual,
                        produto
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
        return (
            <CarrinhoVazio
                voltarCarrinho={() => setTela("carrinho")}
            />
        );
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
            <PedidoRealizado
                voltarPedido={() => setTela("pedido")}
            />
        );
    }

    if (tela === "dashboard") {
        return (
            <Dashboard
                abrirDashboard={() => setTela("dashboard")}
                abrirNovoPedido={() => setTela("pedido")}
                abrirConsultarPedido={() => setTela("consultarPedido")}
                abrirPendentes={() => setTela("pendentes")}
                abrirFinanceiro={() => setTela("detalhePedido")}
                abrirClientes={() => setTela("clientes")}
                fecharDashboard={() => setTela("login")}
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
                abrirFinanceiro={() => setTela("detalhePedido")}
                abrirClientes={() => setTela("clientes")}
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
                abrirFinanceiro={() => setTela("detalhePedido")}
                abrirClientes={() => setTela("clientes")}
                fecharConsultarPedido={() => setTela("dashboard")}
            />
        );
    }

    if (tela === "pendentes") {
        return (
            <Pendentes
                voltarDashboard={() => setTela("dashboard")}
            />
        );
    }

    if (tela === "detalhePedido") {
        return (
            <DetalhePedido
                voltarDashboard={() => setTela("dashboard")}
                editarPedido={() => {}}
            />
        );
    }

    if (tela === "login") {
        return (
            <Login
                abrirCadastro={() => setTela("cadastro")}
                entrar={() => setTela("dashboard")}
            />
        );
    }

    return (
        <Dashboard
            abrirDashboard={() => setTela("dashboard")}
            abrirNovoPedido={() => setTela("pedido")}
            abrirConsultarPedido={() => setTela("consultarPedido")}
            abrirPendentes={() => setTela("pendentes")}
            abrirFinanceiro={() => setTela("detalhePedido")}
            abrirClientes={() => setTela("clientes")}
            fecharDashboard={() => setTela("login")}
        />
    );
}

export default App;
