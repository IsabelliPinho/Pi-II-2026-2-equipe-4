package com.telas;

import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class DetalhesPedidoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#F0CFD7";
    private final String FUNDO = "#FAF8F7";
    private final String AZUL = "#A7F3F3";

    public DetalhesPedidoView(Main main) {

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
                44
        );

        barra.setFill(
                Color.web(MARROM)
        );

        getChildren().add(barra);

        // =========================================================
        // LOGO
        // =========================================================

        Label logo = new Label("GM");

        logo.setLayoutX(4);
        logo.setLayoutY(5);

        logo.setPrefSize(34, 34);

        logo.setAlignment(
                javafx.geometry.Pos.CENTER
        );

        logo.setTextFill(
                Color.WHITE
        );

        logo.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        16
                )
        );

        logo.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-background-radius: 30;"
        );

        getChildren().add(logo);

        // =========================================================
        // MENU
        // =========================================================

        adicionarMenu(
                "Dashboard",
                187
        );

        adicionarMenu(
                "Novo Pedido",
                281
        );

        adicionarMenu(
                "Consultar Pedido",
                383
        );

        adicionarMenu(
                "Pendentes",
                512
        );

        adicionarMenu(
                "Controle Financeiro",
                598
        );

        adicionarMenu(
                "Clientes",
                742
        );

        // =========================================================
        // SINO
        // =========================================================

        Text sino = new Text(
                808,
                36,
                "●"
        );

        sino.setFill(
                Color.web("#FFD34E")
        );

        sino.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        27
                )
        );

        getChildren().add(sino);

        // =========================================================
        // X
        // =========================================================

        Text fechar = new Text(
                872,
                23,
                "×"
        );

        fechar.setFill(
                Color.WHITE
        );

        fechar.setFont(
                Font.font(
                        "Arial",
                        23
                )
        );

        fechar.setStyle(
                "-fx-cursor: hand;"
        );

        getChildren().add(fechar);

        // =========================================================
        // TÍTULO
        // =========================================================

        Label titulo = criarTitulo(
                "Detalhes do Pedido"
        );

        titulo.setLayoutX(369);
        titulo.setLayoutY(81);

        getChildren().add(titulo);

        // =========================================================
        // NÚMERO DO PEDIDO
        // =========================================================

        Label numeroPedido = new Label(
                "Pedido #003"
        );

        numeroPedido.setLayoutX(57);
        numeroPedido.setLayoutY(127);

        numeroPedido.setTextFill(
                Color.BLACK
        );

        numeroPedido.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        14
                )
        );

        getChildren().add(numeroPedido);

        // =========================================================
        // BOTÃO EDITAR
        // =========================================================

        Button editar = new Button(
                "Editar"
        );

        editar.setLayoutX(714);
        editar.setLayoutY(107);

        editar.setPrefWidth(125);
        editar.setPrefHeight(38);

        editar.setStyle(
                "-fx-background-color: " + AZUL + ";" +
                "-fx-text-fill: " + MARROM + ";" +
                "-fx-border-color: #777777;" +
                "-fx-border-width: 1;" +
                "-fx-background-radius: 6;" +
                "-fx-border-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(editar);

        // =========================================================
        // CARD CLIENTE
        // =========================================================

        Pane cliente = criarCard(
                125,
                168,
                289,
                97
        );

        getChildren().add(cliente);

        adicionarCardTitulo(
                cliente,
                "Cliente",
                8,
                20
        );

        adicionarTexto(
                cliente,
                "Ana Costa",
                22,
                38
        );

        adicionarTexto(
                cliente,
                "(xx) xxxxx-xxxx",
                22,
                57
        );

        adicionarTexto(
                cliente,
                "anacosta@gmail.com",
                22,
                76
        );

        Button verCliente = new Button(
                "Ver\nCliente"
        );

        verCliente.setLayoutX(168);
        verCliente.setLayoutY(32);

        verCliente.setPrefWidth(92);
        verCliente.setPrefHeight(35);

        verCliente.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        cliente.getChildren().add(
                verCliente
        );

        // =========================================================
        // CARD STATUS
        // =========================================================

        Pane status = criarCard(
                473,
                168,
                287,
                97
        );

        getChildren().add(status);

        adicionarCardTitulo(
                status,
                "Status",
                10,
                20
        );

        adicionarTexto(
                status,
                "Pendente",
                24,
                39,
                Color.RED
        );

        adicionarTexto(
                status,
                "Vence: 12/10",
                24,
                61
        );

        adicionarTexto(
                status,
                "Pedido: 15/09",
                137,
                39
        );

        adicionarTexto(
                status,
                "Entrega: 12/10",
                137,
                61
        );

        // =========================================================
        // CARD DESCRIÇÃO
        // =========================================================

        Pane descricao = criarCard(
                125,
                287,
                289,
                131
        );

        getChildren().add(descricao);

        adicionarCardTitulo(
                descricao,
                "Descrição do Pedido",
                10,
                17
        );

        adicionarTexto(
                descricao,
                "Bolo de chocolate com morango, 2 kg",
                19,
                41
        );

        adicionarTexto(
                descricao,
                "Recheio: Brigadeiro",
                19,
                59
        );

        adicionarTexto(
                descricao,
                "Cobertura: Chantilly com morangos",
                19,
                77
        );

        // =========================================================
        // CARD OBSERVAÇÕES
        // =========================================================

        Pane observacoes = criarCard(
                473,
                282,
                287,
                136
        );

        getChildren().add(observacoes);

        adicionarCardTitulo(
                observacoes,
                "Observações",
                10,
                20
        );

        adicionarTexto(
                observacoes,
                "Sem lactose, escrever: “Parabéns Ana”",
                13,
                54
        );

        adicionarTexto(
                observacoes,
                "em cima",
                79,
                72
        );

        // =========================================================
        // CARD TIPO
        // =========================================================

        Pane tipo = criarCard(
                164,
                439,
                222,
                98
        );

        getChildren().add(tipo);

        adicionarCardTitulo(
                tipo,
                "Tipo",
                8,
                18
        );

        adicionarTexto(
                tipo,
                "Entrega",
                17,
                45
        );

        adicionarTexto(
                tipo,
                "Rua X, Nº Y - Bairro Z",
                17,
                70
        );
    }

    // =============================================================
    // CRIAR TÍTULO
    // =============================================================

    private Label criarTitulo(
            String texto
    ) {

        Label titulo = new Label(
                texto
        );

        titulo.setTextFill(
                Color.web(MARROM)
        );

        titulo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        16
                )
        );

        return titulo;
    }

    // =============================================================
    // MENU
    // =============================================================

    private void adicionarMenu(
            String texto,
            double x
    ) {

        Label menu = new Label(
                texto
        );

        menu.setLayoutX(x);
        menu.setLayoutY(27);

        menu.setTextFill(
                Color.WHITE
        );

        menu.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        12
                )
        );

        menu.setStyle(
                "-fx-cursor: hand;"
        );

        getChildren().add(menu);
    }

    // =============================================================
    // CARD
    // =============================================================

    private Pane criarCard(
            double x,
            double y,
            double largura,
            double altura
    ) {

        Pane card = new Pane();

        card.setLayoutX(x);
        card.setLayoutY(y);

        card.setPrefWidth(
                largura
        );

        card.setPrefHeight(
                altura
        );

        card.setStyle(
                "-fx-background-color: " + ROSA + ";" +
                "-fx-background-radius: 6;"
        );

        return card;
    }

    // =============================================================
    // TÍTULO DO CARD
    // =============================================================

    private void adicionarCardTitulo(
            Pane card,
            String texto,
            double x,
            double y
    ) {

        Label titulo = new Label(
                texto
        );

        titulo.setLayoutX(x);
        titulo.setLayoutY(y);

        titulo.setTextFill(
                Color.web("#6D5559")
        );

        titulo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        11
                )
        );

        card.getChildren().add(
                titulo
        );
    }

    // =============================================================
    // TEXTO DO CARD
    // =============================================================

    private void adicionarTexto(
            Pane card,
            String texto,
            double x,
            double y
    ) {

        adicionarTexto(
                card,
                texto,
                x,
                y,
                Color.BLACK
        );
    }

    private void adicionarTexto(
            Pane card,
            String texto,
            double x,
            double y,
            Color cor
    ) {

        Text textoLabel = new Text(
                x,
                y,
                texto
        );

        textoLabel.setFill(
                cor
        );

        textoLabel.setFont(
                Font.font(
                        "Arial",
                        11
                )
        );

        card.getChildren().add(
                textoLabel
        );
    }
}