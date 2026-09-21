package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class BuscaView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#EFCBD5";
    private final String FUNDO = "#FAF8F7";
    private final String BRANCO = "#FFFFFF";

    public BuscaView(Main main) {

        setPrefSize(900, 640);

        setStyle(
                "-fx-background-color: " + FUNDO + ";"
        );

        // =========================================================
        // BARRA SUPERIOR
        // =========================================================

        Rectangle barra = new Rectangle(
                0,
                0,
                900,
                52
        );

        barra.setFill(
                Color.web(MARROM)
        );

        getChildren().add(barra);

        // =========================================================
        // LOGO
        // =========================================================

        Circle logoFundo = new Circle(
                25,
                26,
                22
        );

        logoFundo.setFill(
                Color.web(MARROM)
        );

        logoFundo.setStroke(
                Color.WHITE
        );

        logoFundo.setStrokeWidth(1.5);

        Text gm = new Text(
                13,
                34,
                "GM"
        );

        gm.setFill(
                Color.WHITE
        );

        gm.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        17
                )
        );

        getChildren().addAll(
                logoFundo,
                gm
        );

        // =========================================================
        // MENU
        // =========================================================

        adicionarMenu(
                "Dashboard",
                194
        );

        adicionarMenu(
                "Novo Pedido",
                287
        );

        adicionarMenu(
                "Consultar Pedido",
                389
        );

        adicionarMenu(
                "Pendentes",
                518
        );

        adicionarMenu(
                "Controle Financeiro",
                605
        );

        adicionarMenu(
                "Clientes",
                749
        );

        // =========================================================
        // SINO
        // =========================================================

        Text sino = new Text(
                818,
                43,
                "●"
        );

        sino.setFill(
                Color.web("#FFD447")
        );

        sino.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        27
                )
        );

        getChildren().add(
                sino
        );

        // =========================================================
        // BOTÃO FECHAR
        // =========================================================

        Text fechar = new Text(
                876,
                31,
                "×"
        );

        fechar.setFill(
                Color.WHITE
        );

        fechar.setFont(
                Font.font(
                        "Arial",
                        25
                )
        );

        fechar.setStyle(
                "-fx-cursor: hand;"
        );

        getChildren().add(
                fechar
        );

        // =========================================================
        // TÍTULO
        // =========================================================

        Label titulo = new Label(
                "Clientes"
        );

        titulo.setLayoutX(418);
        titulo.setLayoutY(109);

        titulo.setTextFill(
                Color.web(MARROM)
        );

        titulo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        17
                )
        );

        getChildren().add(
                titulo
        );

        // =========================================================
        // CAMPO DE BUSCA
        // =========================================================

        HBox busca = new HBox(10);

        busca.setLayoutX(84);
        busca.setLayoutY(171);

        busca.setPrefWidth(493);
        busca.setPrefHeight(40);

        busca.setAlignment(
                Pos.CENTER_LEFT
        );

        busca.setPadding(
                new javafx.geometry.Insets(
                        0,
                        14,
                        0,
                        14
                )
        );

        busca.setStyle(
                "-fx-background-color: " + ROSA + ";" +
                "-fx-background-radius: 6;"
        );

        // Ícone lupa
        Circle lupaCirculo = new Circle(
                104,
                190,
                5
        );

        lupaCirculo.setFill(
                Color.TRANSPARENT
        );

        lupaCirculo.setStroke(
                Color.BLACK
        );

        lupaCirculo.setStrokeWidth(1.5);

        Line lupaLinha = new Line(
                108,
                194,
                112,
                198
        );

        lupaLinha.setStroke(
                Color.BLACK
        );

        getChildren().addAll(
                lupaCirculo,
                lupaLinha
        );

        TextField campoBusca = new TextField();

        campoBusca.setPromptText(
                "Busque por nome ou telefone"
        );

        campoBusca.setPrefWidth(440);
        campoBusca.setPrefHeight(38);

        campoBusca.setStyle(
                "-fx-background-color: transparent;" +
                "-fx-border-color: transparent;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 12px;"
        );

        busca.getChildren().add(
                campoBusca
        );

        getChildren().add(
                busca
        );

        // =========================================================
        // BOTÃO CADASTRAR
        // =========================================================

        Button cadastrar = new Button(
                "Cadastrar"
        );

        cadastrar.setLayoutX(617);
        cadastrar.setLayoutY(171);

        cadastrar.setPrefWidth(125);
        cadastrar.setPrefHeight(40);

        cadastrar.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 12px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;" +
                "-fx-effect: dropshadow(" +
                "gaussian, rgba(0,0,0,0.30), 4, 0.2, 1, 2);"
        );

        getChildren().add(
                cadastrar
        );

        // Ícone de adicionar pessoa
        Text adicionar = new Text(
                714,
                195,
                "♙"
        );

        adicionar.setFill(
                Color.WHITE
        );

        adicionar.setFont(
                Font.font(
                        "Arial",
                        16
                )
        );

        getChildren().add(
                adicionar
        );

        // =========================================================
        // TABELA
        // =========================================================

        Pane tabela = new Pane();

        tabela.setLayoutX(85);
        tabela.setLayoutY(258);

        tabela.setPrefSize(
                608,
                220
        );

        tabela.setStyle(
                "-fx-background-color: white;" +
                "-fx-background-radius: 6;"
        );

        getChildren().add(
                tabela
        );

        // =========================================================
        // CABEÇALHO DA TABELA
        // =========================================================

        Rectangle cabecalho = new Rectangle(
                0,
                0,
                608,
                44
        );

        cabecalho.setFill(
                Color.web("#EFCBD5")
        );

        tabela.getChildren().add(
                cabecalho
        );

        // =========================================================
        // DIVISÓRIAS DO CABEÇALHO
        // =========================================================

        Line divisoria1 = new Line(
                58,
                0,
                58,
                44
        );

        Line divisoria2 = new Line(
                220,
                0,
                220,
                44
        );

        Line divisoria3 = new Line(
                404,
                0,
                404,
                44
        );

        Line divisoria4 = new Line(
                470,
                0,
                470,
                44
        );

        for (Line linha : new Line[]{
                divisoria1,
                divisoria2,
                divisoria3,
                divisoria4
        }) {

            linha.setStroke(
                    Color.web("#E2BFC9")
            );

            tabela.getChildren().add(
                    linha
            );
        }

        // =========================================================
        // TÍTULOS DAS COLUNAS
        // =========================================================

        adicionarTextoTabela(
                tabela,
                "#",
                28,
                27,
                11
        );

        adicionarTextoTabela(
                tabela,
                "Cliente",
                143,
                27,
                11
        );

        adicionarTextoTabela(
                tabela,
                "Contato",
                296,
                27,
                11
        );

        adicionarTextoTabela(
                tabela,
                "Nº",
                435,
                20,
                11
        );

        adicionarTextoTabela(
                tabela,
                "Pedidos",
                418,
                35,
                10
        );

        // =========================================================
        // CLIENTES
        // =========================================================

        adicionarCliente(
                tabela,
                "010",
                "Ana Clara Lima",
                "(XX) XXXXX-XXXX",
                "5",
                66
        );

        adicionarCliente(
                tabela,
                "003",
                "Ana Costa",
                "(XX) XXXXX-XXXX",
                "2",
                110
        );

        adicionarCliente(
                tabela,
                "008",
                "Ana Paula Souza",
                "(XX) XXXXX-XXXX",
                "1",
                154
        );

        adicionarCliente(
                tabela,
                "005",
                "Ana Rosa Silva",
                "(XX) XXXXX-XXXX",
                "2",
                198
        );
    }

    // =============================================================
    // MENU SUPERIOR
    // =============================================================

    private void adicionarMenu(
            String texto,
            double x
    ) {

        Label menu = new Label(
                texto
        );

        menu.setLayoutX(x);
        menu.setLayoutY(34);

        menu.setTextFill(
                Color.WHITE
        );

        menu.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        11
                )
        );

        menu.setStyle(
                "-fx-cursor: hand;"
        );

        getChildren().add(
                menu
        );
    }

    // =============================================================
    // TEXTO DA TABELA
    // =============================================================

    private void adicionarTextoTabela(
            Pane tabela,
            String texto,
            double x,
            double y,
            double tamanho
    ) {

        Text label = new Text(
                x,
                y,
                texto
        );

        label.setFill(
                Color.BLACK
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        tamanho
                )
        );

        tabela.getChildren().add(
                label
        );
    }

    // =============================================================
    // LINHA DE CLIENTE
    // =============================================================

    private void adicionarCliente(
            Pane tabela,
            String numero,
            String cliente,
            String contato,
            String pedidos,
            double y
    ) {

        Text numeroText = criarTexto(
                numero,
                32,
                y
        );

        Text clienteText = criarTexto(
                cliente,
                128,
                y
        );

        Text contatoText = criarTexto(
                contato,
                241,
                y
        );

        Text pedidosText = criarTexto(
                pedidos,
                432,
                y
        );

        tabela.getChildren().addAll(
                numeroText,
                clienteText,
                contatoText,
                pedidosText
        );

        // Botão visualizar
        Button visualizar = new Button(
                "◎"
        );

        visualizar.setLayoutX(511);
        visualizar.setLayoutY(y - 17);

        visualizar.setPrefWidth(26);
        visualizar.setPrefHeight(23);

        visualizar.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #555555;" +
                "-fx-border-radius: 5;" +
                "-fx-background-radius: 5;" +
                "-fx-font-size: 15px;" +
                "-fx-padding: 0;" +
                "-fx-cursor: hand;"
        );

        tabela.getChildren().add(
                visualizar
        );

        // Botão excluir
        Button excluir = new Button(
                "♜"
        );

        excluir.setLayoutX(563);
        excluir.setLayoutY(y - 17);

        excluir.setPrefWidth(25);
        excluir.setPrefHeight(23);

        excluir.setStyle(
                "-fx-background-color: transparent;" +
                "-fx-text-fill: red;" +
                "-fx-font-size: 17px;" +
                "-fx-padding: 0;" +
                "-fx-cursor: hand;"
        );

        tabela.getChildren().add(
                excluir
        );
    }

    // =============================================================
    // CRIA TEXTO
    // =============================================================

    private Text criarTexto(
            String texto,
            double x,
            double y
    ) {

        Text resultado = new Text(
                x,
                y,
                texto
        );

        resultado.setFill(
                Color.BLACK
        );

        resultado.setFont(
                Font.font(
                        "Arial",
                        FontWeight.NORMAL,
                        11
                )
        );

        return resultado;
    }
}