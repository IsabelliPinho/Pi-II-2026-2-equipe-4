package com.telas;

import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class AlterarPedidoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#E9A6B8";
    private final String FUNDO = "#FAF8F7";
    private final String AZUL = "#A7F3F3";

    public AlterarPedidoView(Main main) {

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
                40
        );

        barra.setFill(
                Color.web(MARROM)
        );

        getChildren().add(barra);

        // X
        Text fechar = new Text(
                872,
                22,
                "×"
        );

        fechar.setFill(Color.WHITE);

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
        // TÍTULO PEDIDOS PENDENTES
        // =========================================================

        Label tituloPendentes = criarTitulo(
                "Pedidos Pendentes"
        );

        tituloPendentes.setLayoutX(73);
        tituloPendentes.setLayoutY(91);

        getChildren().add(
                tituloPendentes
        );

        // =========================================================
        // TÍTULO DETALHES
        // =========================================================

        Label tituloDetalhes = criarTitulo(
                "Detalhes"
        );

        tituloDetalhes.setLayoutX(495);
        tituloDetalhes.setLayoutY(91);

        getChildren().add(
                tituloDetalhes
        );

        // =========================================================
        // RESUMO
        // =========================================================

        Pane resumo = new Pane();

        resumo.setLayoutX(73);
        resumo.setLayoutY(124);

        resumo.setPrefSize(
                275,
                94
        );

        resumo.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #777777;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;" +
                "-fx-background-radius: 6;"
        );

        getChildren().add(
                resumo
        );

        Label resumoTitulo = new Label(
                "Resumo"
        );

        resumoTitulo.setLayoutX(6);
        resumoTitulo.setLayoutY(14);

        resumoTitulo.setTextFill(
                Color.web("#555555")
        );

        resumoTitulo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        13
                )
        );

        resumo.getChildren().add(
                resumoTitulo
        );

        // =========================================================
        // CARDS DO RESUMO
        // =========================================================

        criarCardResumo(
                resumo,
                "Pendentes",
                5
        );

        criarCardResumo(
                resumo,
                "Urgentes",
                96
        );

        criarCardResumo(
                resumo,
                "Prox. Entrega",
                184
        );

        // =========================================================
        // TABELA DE PEDIDOS
        // =========================================================

        Pane tabela = new Pane();

        tabela.setLayoutX(73);
        tabela.setLayoutY(244);

        tabela.setPrefSize(
                275,
                125
        );

        tabela.setStyle(
                "-fx-background-color: white;" +
                "-fx-background-radius: 6;"
        );

        getChildren().add(
                tabela
        );

        // Cabeçalho

        Rectangle cabecalho = new Rectangle(
                0,
                0,
                275,
                27
        );

        cabecalho.setFill(
                Color.web("#F0CBD4")
        );

        tabela.getChildren().add(
                cabecalho
        );

        adicionarCabecalho(
                tabela,
                "#",
                12
        );

        adicionarCabecalho(
                tabela,
                "Cliente",
                63
        );

        adicionarCabecalho(
                tabela,
                "Data",
                165
        );

        adicionarCabecalho(
                tabela,
                "Prazo",
                226
        );

        // =========================================================
        // PEDIDOS
        // =========================================================

        adicionarPedido(
                tabela,
                "002",
                "João Souza",
                "19/09",
                "Amanhã",
                39,
                true
        );

        adicionarPedido(
                tabela,
                "003",
                "Ana Costa",
                "12/10",
                "",
                64,
                false
        );

        adicionarPedido(
                tabela,
                "004",
                "Carlos Lima",
                "14/10",
                "",
                89,
                false
        );

        adicionarPedido(
                tabela,
                "005",
                "Beatriz Alves",
                "25/10",
                "",
                114,
                false
        );

        // =========================================================
        // DETALHES - CLIENTE
        // =========================================================

        Label clienteLabel = criarLabel(
                "Cliente"
        );

        clienteLabel.setLayoutX(495);
        clienteLabel.setLayoutY(125);

        getChildren().add(
                clienteLabel
        );

        TextField cliente = criarCampo();

        cliente.setText(
                "João Souza"
        );

        cliente.setLayoutX(495);
        cliente.setLayoutY(142);

        getChildren().add(
                cliente
        );

        // =========================================================
        // TELEFONE
        // =========================================================

        Label telefoneLabel = criarLabel(
                "Telefone"
        );

        telefoneLabel.setLayoutX(495);
        telefoneLabel.setLayoutY(184);

        getChildren().add(
                telefoneLabel
        );

        TextField telefone = criarCampo();

        telefone.setText(
                "(88) 99999-9999"
        );

        telefone.setLayoutX(495);
        telefone.setLayoutY(201);

        getChildren().add(
                telefone
        );

        // =========================================================
        // DATA DO PEDIDO
        // =========================================================

        Label dataPedidoLabel = criarLabel(
                "Data do Pedido"
        );

        dataPedidoLabel.setLayoutX(495);
        dataPedidoLabel.setLayoutY(243);

        getChildren().add(
                dataPedidoLabel
        );

        DatePicker dataPedido =
                criarDatePicker();

        dataPedido.setLayoutX(495);
        dataPedido.setLayoutY(261);

        getChildren().add(
                dataPedido
        );

        // =========================================================
        // ENTREGA / RETIRADA
        // =========================================================

        Label entregaLabel = criarLabel(
                "Entrega/Retirada"
        );

        entregaLabel.setLayoutX(495);
        entregaLabel.setLayoutY(303);

        getChildren().add(
                entregaLabel
        );

        DatePicker entrega =
                criarDatePicker();

        entrega.setLayoutX(495);
        entrega.setLayoutY(321);

        getChildren().add(
                entrega
        );

        // =========================================================
        // PEDIDO
        // =========================================================

        Label pedidoLabel = criarLabel(
                "Pedido"
        );

        pedidoLabel.setLayoutX(495);
        pedidoLabel.setLayoutY(363);

        getChildren().add(
                pedidoLabel
        );

        TextArea pedido = criarArea();

        pedido.setText(
                "Bolo de 1kg - Brigadeiro"
        );

        pedido.setLayoutX(495);
        pedido.setLayoutY(380);

        getChildren().add(
                pedido
        );

        // =========================================================
        // OBSERVAÇÕES
        // =========================================================

        Label observacoesLabel = criarLabel(
                "Observações"
        );

        observacoesLabel.setLayoutX(495);
        observacoesLabel.setLayoutY(440);

        getChildren().add(
                observacoesLabel
        );

        TextArea observacoes = criarArea();

        observacoes.setLayoutX(495);
        observacoes.setLayoutY(461);

        getChildren().add(
                observacoes
        );

        // =========================================================
        // CHECKBOX
        // =========================================================

        CheckBox atendido = new CheckBox(
                "Marcar como atendida?"
        );

        atendido.setLayoutX(495);
        atendido.setLayoutY(535);

        atendido.setTextFill(
                Color.BLACK
        );

        atendido.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        10
                )
        );

        atendido.setStyle(
                "-fx-cursor: hand;"
        );

        getChildren().add(
                atendido
        );

        // =========================================================
        // BOTÃO EDITAR
        // =========================================================

        Button editar = new Button(
                "Editar"
        );

        editar.setLayoutX(666);
        editar.setLayoutY(528);

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

        getChildren().add(
                editar
        );
    }

    // =============================================================
    // TÍTULO
    // =============================================================

    private Label criarTitulo(String texto) {

        Label label = new Label(
                texto
        );

        label.setTextFill(
                Color.web(MARROM)
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        16
                )
        );

        return label;
    }

    // =============================================================
    // LABEL
    // =============================================================

    private Label criarLabel(String texto) {

        Label label = new Label(
                texto
        );

        label.setTextFill(
                Color.BLACK
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        13
                )
        );

        return label;
    }

    // =============================================================
    // CARDS DO RESUMO
    // =============================================================

    private void criarCardResumo(
            Pane painel,
            String texto,
            double x
    ) {

        Rectangle card = new Rectangle(
                x,
                44,
                82,
                35
        );

        card.setArcWidth(7);
        card.setArcHeight(7);

        card.setFill(
                Color.web(ROSA)
        );

        painel.getChildren().add(
                card
        );

        Label label = new Label(
                texto
        );

        label.setLayoutX(x + 5);
        label.setLayoutY(47);

        label.setTextFill(
                Color.web("#555555")
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        10
                )
        );

        painel.getChildren().add(
                label
        );

        if (texto.equals("Prox. Entrega")) {

            Label data = new Label(
                    "/    /"
            );

            data.setLayoutX(
                    x + 28
            );

            data.setLayoutY(62);

            data.setFont(
                    Font.font(
                            "Arial",
                            FontWeight.BOLD,
                            12
                    )
            );

            painel.getChildren().add(
                    data
            );
        }
    }

    // =============================================================
    // CABEÇALHO
    // =============================================================

    private void adicionarCabecalho(
            Pane tabela,
            String texto,
            double x
    ) {

        Text label = new Text(
                x,
                18,
                texto
        );

        label.setFill(
                Color.BLACK
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        9
                )
        );

        tabela.getChildren().add(
                label
        );
    }

    // =============================================================
    // PEDIDO
    // =============================================================

    private void adicionarPedido(
            Pane tabela,
            String numero,
            String cliente,
            String data,
            String prazo,
            double y,
            boolean urgente
    ) {

        adicionarTexto(
                tabela,
                numero,
                13,
                y
        );

        adicionarTexto(
                tabela,
                cliente,
                64,
                y
        );

        adicionarTexto(
                tabela,
                data,
                165,
                y
        );

        if (!prazo.isEmpty()) {

            Text prazoText = new Text(
                    221,
                    y,
                    prazo
            );

            prazoText.setFill(
                    Color.RED
            );

            prazoText.setFont(
                    Font.font(
                            "Arial",
                            FontWeight.BOLD,
                            9
                    )
            );

            tabela.getChildren().add(
                    prazoText
            );

        } else {

            Text calendario = new Text(
                    235,
                    y,
                    "▦"
            );

            calendario.setFill(
                    Color.BLUE
            );

            calendario.setFont(
                    Font.font(
                            "Arial",
                            16
                    )
            );

            tabela.getChildren().add(
                    calendario
            );
        }
    }

    // =============================================================
    // TEXTO
    // =============================================================

    private void adicionarTexto(
            Pane painel,
            String texto,
            double x,
            double y
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
                        9
                )
        );

        painel.getChildren().add(
                label
        );
    }

    // =============================================================
    // CAMPO
    // =============================================================

    private TextField criarCampo() {

        TextField campo = new TextField();

        campo.setPrefWidth(308);
        campo.setPrefHeight(30);

        campo.setStyle(
                "-fx-background-color: transparent;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 10px;"
        );

        return campo;
    }

    // =============================================================
    // DATE PICKER
    // =============================================================

    private DatePicker criarDatePicker() {

        DatePicker data = new DatePicker();

        data.setPrefWidth(308);
        data.setPrefHeight(30);

        data.setPromptText("");

        data.setStyle(
                "-fx-background-color: transparent;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 10px;"
        );

        return data;
    }

    // =============================================================
    // TEXTAREA
    // =============================================================

    private TextArea criarArea() {

        TextArea area = new TextArea();

        area.setPrefWidth(308);
        area.setPrefHeight(49);

        area.setWrapText(true);

        area.setStyle(
                "-fx-background-color: transparent;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 10px;" +
                "-fx-padding: 5;"
        );

        return area;
    }
}