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


    /* =========================
       CADASTRO
    ========================= */

    if (tela === "cadastro") {
        return (
            <Cadastro
                voltarLogin={() => setTela("login")}
            />
        );
    }


    /* =========================
       PEDIDO
    ========================= */

    if (tela === "pedido") {
        return (
            <Pedido
                adicionarCarrinho={() => setTela("carrinho")}
            />
        );
    }


    /* =========================
       CARRINHO
    ========================= */

    if (tela === "carrinho") {
        return (
            <Carrinho
                adicionarProduto={() => setTela("pedido")}
                realizarPedido={() => setTela("dados")}
                fecharCarrinho={() => setTela("pedido")}
                esvaziarCarrinho={() => setTela("carrinhoVazio")}
            />
        );
    }


    /* =========================
       CARRINHO VAZIO
    ========================= */

    if (tela === "carrinhoVazio") {
        return (
            <CarrinhoVazio
                voltarCarrinho={() => setTela("carrinho")}
            />
        );
    }


    /* =========================
       DADOS DO CLIENTE
    ========================= */

    if (tela === "dados") {
        return (
            <DadosCliente
                voltarPedido={() => setTela("pedido")}
                realizarPedido={() => setTela("pedidoRealizado")}
            />
        );
    }


    /* =========================
       PEDIDO REALIZADO
    ========================= */

    if (tela === "pedidoRealizado") {
        return (
            <PedidoRealizado
                voltarPedido={() => setTela("pedido")}
            />
        );
    }


    /* =========================
       DASHBOARD
    ========================= */

    if (tela === "dashboard") {
        return (
            <Dashboard
                abrirDashboard={() => setTela("dashboard")}

                abrirNovoPedido={() => setTela("pedido")}

                abrirConsultarPedido={() =>
                    setTela("consultarPedido")
                }

                abrirPendentes={() =>
                    setTela("pendentes")
                }

                abrirFinanceiro={() =>
                    setTela("detalhePedido")
                }

                abrirClientes={() =>
                    setTela("clientes")
                }

                fecharDashboard={() =>
                    setTela("login")
                }
            />
        );
    }


    /* =========================
       CLIENTES
    ========================= */

    if (tela === "clientes") {
        return (
            <Clientes
                abrirDashboard={() =>
                    setTela("dashboard")
                }

                abrirNovoPedido={() =>
                    setTela("pedido")
                }

                abrirConsultarPedido={() =>
                    setTela("consultarPedido")
                }

                abrirPendentes={() =>
                    setTela("pendentes")
                }

                abrirFinanceiro={() =>
                    setTela("detalhePedido")
                }

                abrirClientes={() =>
                    setTela("clientes")
                }

                fecharClientes={() =>
                    setTela("dashboard")
                }
            />
        );
    }


    /* =========================
       CONSULTAR PEDIDO
    ========================= */

    if (tela === "consultarPedido") {
        return (
            <ConsultarPedido
                abrirDashboard={() =>
                    setTela("dashboard")
                }

                abrirNovoPedido={() =>
                    setTela("pedido")
                }

                abrirConsultarPedido={() =>
                    setTela("consultarPedido")
                }

                abrirPendentes={() =>
                    setTela("pendentes")
                }

                abrirFinanceiro={() =>
                    setTela("detalhePedido")
                }

                abrirClientes={() =>
                    setTela("clientes")
                }

                fecharConsultarPedido={() =>
                    setTela("dashboard")
                }
            />
        );
    }


    /* =========================
       PENDENTES
    ========================= */

    if (tela === "pendentes") {
        return (
            <Pendentes
                voltarDashboard={() =>
                    setTela("dashboard")
                }
            />
        );
    }


    /* =========================
       DETALHE DO PEDIDO
    ========================= */

    if (tela === "detalhePedido") {
        return (
            <DetalhePedido
                voltarDashboard={() =>
                    setTela("dashboard")
                }

                editarPedido={() => {}}
            />
        );
    }


    /* =========================
       LOGIN
    ========================= */

    if (tela === "login") {
        return (
            <Login
                abrirCadastro={() =>
                    setTela("cadastro")
                }

                entrar={() =>
                    setTela("dashboard")
                }
            />
        );
    }


    /* =========================
       PADRÃO
    ========================= */

    return (
        <Dashboard
            abrirDashboard={() =>
                setTela("dashboard")
            }

            abrirNovoPedido={() =>
                setTela("pedido")
            }

            abrirConsultarPedido={() =>
                setTela("consultarPedido")
            }

            abrirPendentes={() =>
                setTela("pendentes")
            }

            abrirFinanceiro={() =>
                setTela("detalhePedido")
            }

            abrirClientes={() =>
                setTela("clientes")
            }

            fecharDashboard={() =>
                setTela("login")
            }
        />
    );
}

export default App;