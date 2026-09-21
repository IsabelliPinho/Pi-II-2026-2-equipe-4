package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class PedidoCarrinhoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String VERDE = "#50D47B";
    private final String VERMELHO = "#D9565C";
    private final String FUNDO = "#FAF8F7";

    public PedidoCarrinhoView(Main main) {

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
                41
        );

        barra.setFill(
                Color.web(MARROM)
        );

        getChildren().add(barra);

        // =========================================================
        // BOTÃO X
        // =========================================================

        Text fechar = new Text(
                872,
                25,
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
        // ÍCONE DO USUÁRIO
        // =========================================================

        Circle circuloUsuario = new Circle(
                15
        );

        circuloUsuario.setCenterX(156);
        circuloUsuario.setCenterY(137);

        circuloUsuario.setFill(
                Color.TRANSPARENT
        );

        circuloUsuario.setStroke(
                Color.web("#B97883")
        );

        circuloUsuario.setStrokeWidth(2);

        getChildren().add(
                circuloUsuario
        );

        // Cabeça

        Circle cabeca = new Circle(
                6
        );

        cabeca.setCenterX(156);
        cabeca.setCenterY(132);

        cabeca.setFill(
                Color.TRANSPARENT
        );

        cabeca.setStroke(
                Color.web("#B97883")
        );

        cabeca.setStrokeWidth(1.5);

        getChildren().add(
                cabeca
        );

        // Corpo

        javafx.scene.shape.Arc corpo =
                new javafx.scene.shape.Arc(
                        156,
                        143,
                        10,
                        8,
                        200,
                        140
                );

        corpo.setFill(
                Color.TRANSPARENT
        );

        corpo.setStroke(
                Color.web("#B97883")
        );

        corpo.setStrokeWidth(1.5);

        getChildren().add(
                corpo
        );

        // =========================================================
        // NOME DO CLIENTE
        // =========================================================

        Label nome = new Label(
                "Ana"
        );

        nome.setLayoutX(183);
        nome.setLayoutY(128);

        nome.setTextFill(
                Color.web(MARROM)
        );

        nome.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        11
                )
        );

        getChildren().add(nome);

        // =========================================================
        // PRODUTOS
        // =========================================================

        Label produto1 = criarProduto(
                "1 bolo de brigadeiro 1kg",
                165,
                166
        );

        getChildren().add(produto1);

        Label produto2 = criarProduto(
                "1 bolo de ninho 2kg",
                165,
                193
        );

        getChildren().add(produto2);

        // =========================================================
        // BOTÃO REALIZAR PEDIDO
        // =========================================================

        Button realizarPedido = new Button(
                "Realizar Pedido"
        );

        realizarPedido.setLayoutX(165);
        realizarPedido.setLayoutY(319);

        realizarPedido.setPrefWidth(370);
        realizarPedido.setPrefHeight(41);

        realizarPedido.setAlignment(
                Pos.CENTER
        );

        realizarPedido.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #77A982;" +
                "-fx-border-width: 1;" +
                "-fx-background-radius: 6;" +
                "-fx-border-radius: 6;" +
                "-fx-text-fill: #28733C;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(
                realizarPedido
        );

        // =========================================================
        // BOTÃO ADICIONAR PRODUTO
        // =========================================================

        Button adicionarProduto = new Button(
                "+    Adicionar Produto"
        );

        adicionarProduto.setLayoutX(165);
        adicionarProduto.setLayoutY(377);

        adicionarProduto.setPrefWidth(175);
        adicionarProduto.setPrefHeight(41);

        adicionarProduto.setStyle(
                "-fx-background-color: " + VERDE + ";" +
                "-fx-text-fill: #28733C;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(
                adicionarProduto
        );

        // =========================================================
        // BOTÃO ESVAZIAR CARRINHO
        // =========================================================

        Button esvaziar = new Button(
                "×    Esvaziar Carrinho"
        );

        esvaziar.setLayoutX(360);
        esvaziar.setLayoutY(377);

        esvaziar.setPrefWidth(175);
        esvaziar.setPrefHeight(41);

        esvaziar.setStyle(
                "-fx-background-color: " + VERMELHO + ";" +
                "-fx-text-fill: #713236;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(
                esvaziar
        );
    }

    // =============================================================
    // PRODUTO
    // =============================================================

    private Label criarProduto(
            String texto,
            double x,
            double y
    ) {

        Label produto = new Label(
                texto
        );

        produto.setLayoutX(x);
        produto.setLayoutY(y);

        produto.setTextFill(
                Color.web(MARROM)
        );

        produto.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        11
                )
        );

        return produto;
    }
}