package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class DadosClienteView extends Pane {

    private final String MARROM = "#5B292B";
    private final String VERDE = "#A7F3B8";
    private final String VERDE_BOTAO = "#2F753D";
    private final String FUNDO = "#FAF8F7";
    private final String BORDA = "#9C696B";

    public DadosClienteView(Main main) {

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
        // X
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
        // BARRA VERDE "QUASE LÁ..."
        // =========================================================

        Rectangle progresso = new Rectangle(
                0,
                41,
                900,
                24
        );

        progresso.setFill(
                Color.web(VERDE)
        );

        getChildren().add(progresso);

        Label quaseLa = new Label(
                "Quase lá..."
        );

        quaseLa.setLayoutX(9);
        quaseLa.setLayoutY(48);

        quaseLa.setTextFill(
                Color.web(VERDE_BOTAO)
        );

        quaseLa.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        10
                )
        );

        getChildren().add(quaseLa);

        // =========================================================
        // ÍCONE DO USUÁRIO
        // =========================================================

        Circle circulo = new Circle(
                15
        );

        circulo.setCenterX(200);
        circulo.setCenterY(118);

        circulo.setFill(
                Color.TRANSPARENT
        );

        circulo.setStroke(
                Color.web("#B97883")
        );

        circulo.setStrokeWidth(1.5);

        getChildren().add(circulo);

        // Cabeça

        Circle cabeca = new Circle(
                6
        );

        cabeca.setCenterX(200);
        cabeca.setCenterY(113);

        cabeca.setFill(
                Color.TRANSPARENT
        );

        cabeca.setStroke(
                Color.web("#B97883")
        );

        cabeca.setStrokeWidth(1.5);

        getChildren().add(cabeca);

        // Corpo

        javafx.scene.shape.Arc corpo =
                new javafx.scene.shape.Arc(
                        200,
                        124,
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

        getChildren().add(corpo);

        // =========================================================
        // TÍTULO
        // =========================================================

        Label titulo = new Label(
                "Dados pra contato"
        );

        titulo.setLayoutX(237);
        titulo.setLayoutY(106);

        titulo.setTextFill(
                Color.web(MARROM)
        );

        titulo.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        23
                )
        );

        getChildren().add(titulo);

        // =========================================================
        // NOME
        // =========================================================

        Label nomeLabel = criarLabel(
                "Nome"
        );

        nomeLabel.setLayoutX(214);
        nomeLabel.setLayoutY(170);

        getChildren().add(nomeLabel);

        TextField nome = criarCampo();

        nome.setLayoutX(270);
        nome.setLayoutY(166);

        getChildren().add(nome);

        // =========================================================
        // TELEFONE
        // =========================================================

        Label telefoneLabel = criarLabel(
                "Telefone"
        );

        telefoneLabel.setLayoutX(214);
        telefoneLabel.setLayoutY(219);

        getChildren().add(telefoneLabel);

        TextField telefone = criarCampo();

        telefone.setLayoutX(270);
        telefone.setLayoutY(215);

        getChildren().add(telefone);

        // =========================================================
        // ENDEREÇO
        // =========================================================

        Label enderecoLabel = criarLabel(
                "Endereço"
        );

        enderecoLabel.setLayoutX(214);
        enderecoLabel.setLayoutY(268);

        getChildren().add(enderecoLabel);

        TextField endereco = criarCampo();

        endereco.setLayoutX(270);
        endereco.setLayoutY(264);

        getChildren().add(endereco);

        // =========================================================
        // BOTÃO CONFIRMAR
        // =========================================================

        Button confirmar = new Button(
                "Confirmar Contato"
        );

        confirmar.setLayoutX(216);
        confirmar.setLayoutY(312);

        confirmar.setPrefWidth(216);
        confirmar.setPrefHeight(40);

        confirmar.setAlignment(
                Pos.CENTER
        );

        confirmar.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #70A77A;" +
                "-fx-border-width: 1;" +
                "-fx-background-radius: 5;" +
                "-fx-border-radius: 5;" +
                "-fx-text-fill: " + VERDE_BOTAO + ";" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(confirmar);
    }

    // =============================================================
    // LABEL
    // =============================================================

    private Label criarLabel(
            String texto
    ) {

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
                        11
                )
        );

        return label;
    }

    // =============================================================
    // CAMPO
    // =============================================================

    private TextField criarCampo() {

        TextField campo = new TextField();

        campo.setPrefWidth(143);
        campo.setPrefHeight(19);

        campo.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: " + BORDA + ";" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 10px;" +
                "-fx-padding: 3 7 3 7;"
        );

        return campo;
    }
}