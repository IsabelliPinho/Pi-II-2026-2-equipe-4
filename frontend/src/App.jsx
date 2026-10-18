import { useState } from "react";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Carrinho from "./pages/Carrinho";
import DadosCliente from "./pages/DadosCliente";
import CarrinhoVazio from "./pages/CarrinhoVazio";
import PedidoRealizado from "./pages/PedidoRealizado";

import Dashboard from "./pages/Dashboard";
import { TelaClientes } from "./pages/cliente"; // Ajuste o caminho se necessário
import { TelaPedidos } from "./pages/Pedidos";   // Ajuste o caminho se necessário
import { TelaProdutos } from "./pages/Produtos"; // Ajuste o caminho se necessário
import Pendentes from "./pages/Pendentes";
import DetalhePedido from "./pages/DetalhePedido";

function App() {
    const [tela, setTela] = useState("dashboard");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);

    async function finalizarPedido(clienteCadastrado) {
        try {
            if (tela === "pedido") {
        return (
            <TelaProdutos
                adicionarCarrinho={(produto) => {
                    // Garante que o ID do produto seja capturado corretamente (seja .id ou .idProduto)
                    const produtoNormalizado = {
                        ...produto,
                        idProduto: produto.idProduto || produto.id
                    };
                    setCarrinho([...carrinho, produtoNormalizado]);
                    setTela("carrinho");
                }}
            />
        );
    }

            const resposta = await fetch("http://localhost:8080/pedidos/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCliente: clienteCadastrado.id,
                    nomeGerente: "Gabriela",
                    dataPrevista: "2026-10-05T15:00:00",
                    formaEntrega: "RETIRADA",
                    itens: itens
                })
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error("Erro ao criar pedido:", erro);
                alert("Não foi possível criar o pedido.");
                return;
            }

            const pedidoCriado = await resposta.json();
            console.log("Pedido criado:", pedidoCriado);

            setCliente(clienteCadastrado);
            setCarrinho([]);
            setTela("pedidoRealizado");

        } catch (erro) {
            console.error("Erro ao criar pedido:", erro);
            alert("Erro de conexão com o servidor.");
        }
    }

    if (tela === "cadastro") {
        return <Cadastro voltarLogin={() => setTela("login")} />;
    }

    if (tela === "pedido") {
        return (
            <TelaProdutos
                adicionarCarrinho={(produto) => {
                    setCarrinho([...carrinho, produto]);
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
        return <PedidoRealizado voltarPedido={() => setTela("pedido")} />;
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
        return <TelaClientes />;
    }

    if (tela === "consultarPedido") {
        return <TelaPedidos />;
    }

    if (tela === "pendentes") {
        return <Pendentes voltarDashboard={() => setTela("dashboard")} />;
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