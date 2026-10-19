import { useState } from "react";

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

function App() {
    const [tela, setTela] = useState("dashboard");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [idPedidoAberto, setIdPedidoAberto] = useState(null);

    function abrirDetalhe(id) {
        setIdPedidoAberto(id);
        setTela("detalhePedido");
    }

    async function finalizarPedido(clienteCadastrado) {
        try {
            // data prevista = daqui a 7 dias, às 15h (o backend rejeita datas passadas)
            const prevista = new Date();
            prevista.setDate(prevista.getDate() + 7);
            const dataPrevista =
                `${prevista.getFullYear()}-` +
                `${String(prevista.getMonth() + 1).padStart(2, "0")}-` +
                `${String(prevista.getDate()).padStart(2, "0")}T15:00:00`;

            const itens = carrinho.map((item) => ({
                idProduto: item.idProduto ?? item.id,
                quantidade: item.quantidade || 1
            }));

            const resposta = await fetch("/api/pedidos/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCliente: clienteCadastrado.id,
                    nomeGerente: "Gabriela",
                    dataPrevista: dataPrevista,
                    formaEntrega: "RETIRADA",
                    itens: itens
                })
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error("Erro ao criar pedido:", erro);
                let motivo = "";
                try {
                    motivo = JSON.parse(erro).message ?? "";
                } catch {
                    // resposta não era JSON
                }
                alert(`Não foi possível criar o pedido. ${motivo}`);
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

    if (tela === "login") {
        return (
            <Login
                abrirCadastro={() => setTela("cadastro")}
                entrar={() => setTela("dashboard")}
            />
        );
    }

    if (tela === "cadastro") {
        return <Cadastro voltarLogin={() => setTela("login")} />;
    }

    if (tela === "pedido") {
        return (
            <Pedido
                voltarDashboard={() => setTela("dashboard")}
                adicionarCarrinho={(produto) => {
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
                abrirFinanceiro={() => abrirDetalhe(null)}
                abrirClientes={() => setTela("clientes")}
                abrirAlertas={() => setTela("alertas")}
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
            fecharDashboard={() => setTela("login")}
        />
    );
}

export default App;