package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class CadastroView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#E39AAF";
    private final String BRANCO = "#FFFFFF";

    public CadastroView(Main main) {

        setPrefSize(970, 700);

        setStyle(
                "-fx-background-color: white;"
        );

        // =========================================================
        // FUNDO - LISTRAS VERTICAIS
        // =========================================================

        for (int x = 0; x < 970; x += 40) {

            Rectangle faixa = new Rectangle(
                    x,
                    0,
                    20,
                    700
            );

            faixa.setFill(
                    Color.web(MARROM)
            );

            getChildren().add(faixa);
        }

        // =========================================================
        // LOGO
        // =========================================================

        Pane logo = new Pane();

        logo.setLayoutX(58);
        logo.setLayoutY(164);

        // Círculo marrom
        Circle circulo = new Circle(
                180,
                180,
                175
        );

        circulo.setFill(
                Color.web(MARROM)
        );

        // Borda branca
        Circle borda = new Circle(
                180,
                180,
                166
        );

        borda.setFill(
                Color.TRANSPARENT
        );

        borda.setStroke(
                Color.WHITE
        );

        borda.setStrokeWidth(8);

        // =========================================================
        // GM
        // =========================================================

        Text gm = new Text(
                85,
                230,
                "GM"
        );

        gm.setFill(
                Color.WHITE
        );

        gm.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        125
                )
        );

        // =========================================================
        // CAKE DESIGNER
        // =========================================================

        Text cake = new Text(
                170,
                105,
                "CAKE DESIGNER"
        );

        cake.setFill(
                Color.WHITE
        );

        cake.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        10
                )
        );

        cake.setRotate(-12);

        // =========================================================
        // DESENHO DO BOLO
        // =========================================================

        Text bolo = new Text(
                174,
                145,
                "♨"
        );

        bolo.setFill(
                Color.WHITE
        );

        bolo.setFont(
                Font.font(
                        "Georgia",
                        FontWeight.BOLD,
                        35
                )
        );

        // =========================================================
        // NOME
        // =========================================================

        Text nome = new Text(
                112,
                274,
                "GABRIELA MOREIRA"
        );

        nome.setFill(
                Color.web(ROSA)
        );

        nome.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        11
                )
        );

        logo.getChildren().addAll(
                circulo,
                borda,
                gm,
                cake,
                bolo,
                nome
        );

        getChildren().add(
                logo
        );

        // =========================================================
        // PAINEL DE CADASTRO
        // =========================================================

        Pane painel = new Pane();

        painel.setLayoutX(472);
        painel.setLayoutY(101);

        painel.setPrefSize(
                440,
                411
        );

        painel.setStyle(
                "-fx-background-color: " + ROSA + ";" +
                "-fx-background-radius: 10;" +
                "-fx-effect: dropshadow(" +
                "gaussian, rgba(0,0,0,0.25), 7, 0.2, 2, 4);"
        );

        // =========================================================
        // CAMPO NOME
        // =========================================================

        HBox campoNome = criarCampo(
                "♙",
                "Nome",
                false
        );

        campoNome.setLayoutX(61);
        campoNome.setLayoutY(75);

        painel.getChildren().add(
                campoNome
        );

        // =========================================================
        // CAMPO E-MAIL
        // =========================================================

        HBox campoEmail = criarCampo(
                "✉",
                "E-mail",
                false
        );

        campoEmail.setLayoutX(61);
        campoEmail.setLayoutY(133);

        painel.getChildren().add(
                campoEmail
        );

        // =========================================================
        // CAMPO SENHA
        // =========================================================

        HBox campoSenha = criarCampo(
                "♙",
                "Senha",
                true
        );

        campoSenha.setLayoutX(61);
        campoSenha.setLayoutY(197);

        painel.getChildren().add(
                campoSenha
        );

        // =========================================================
        // CAMPO REPETIR SENHA
        // =========================================================

        HBox campoRepetirSenha = criarCampo(
                "♙",
                "Repita a Senha",
                true
        );

        campoRepetirSenha.setLayoutX(61);
        campoRepetirSenha.setLayoutY(261);

        painel.getChildren().add(
                campoRepetirSenha
        );

        // =========================================================
        // BOTÃO CADASTRAR
        // =========================================================

        Button cadastrar = new Button(
                "CADASTRAR"
        );

        cadastrar.setLayoutX(126);
        cadastrar.setLayoutY(352);

        cadastrar.setPrefWidth(177);
        cadastrar.setPrefHeight(43);

        cadastrar.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        painel.getChildren().add(
                cadastrar
        );

        // =========================================================
        // ADICIONA O PAINEL
        // =========================================================

        getChildren().add(
                painel
        );
    }

    // =============================================================
    // CRIAÇÃO DOS CAMPOS
    // =============================================================

    private HBox criarCampo(
            String icone,
            String texto,
            boolean senha
    ) {

        HBox campo = new HBox(8);

        campo.setAlignment(
                Pos.CENTER_LEFT
        );

        campo.setPrefWidth(320);
        campo.setPrefHeight(45);

        campo.setPadding(
                new javafx.geometry.Insets(
                        0,
                        14,
                        0,
                        14
                )
        );

        campo.setStyle(
                "-fx-background-color: white;" +
                "-fx-background-radius: 6;"
        );

        // =========================================================
        // ÍCONE
        // =========================================================

        Label iconeLabel = new Label(
                icone
        );

        iconeLabel.setTextFill(
                Color.web(MARROM)
        );

        iconeLabel.setFont(
                Font.font(
                        "Arial",
                        18
                )
        );

        // =========================================================
        // CAMPO DE SENHA
        // =========================================================

        if (senha) {

            PasswordField campoSenha =
                    new PasswordField();

            campoSenha.setPromptText(
                    texto
            );

            campoSenha.setPrefWidth(245);
            campoSenha.setPrefHeight(40);

            campoSenha.setStyle(
                    "-fx-background-color: transparent;" +
                    "-fx-border-color: transparent;" +
                    "-fx-font-family: 'Arial';" +
                    "-fx-font-size: 10px;"
            );

            campo.getChildren().addAll(
                    iconeLabel,
                    campoSenha
            );

            // Olho
            Label olho = new Label(
                    "◉"
            );

            olho.setTextFill(
                    Color.web("#B97A83")
            );

            olho.setFont(
                    Font.font(
                            "Arial",
                            16
                    )
            );

            campo.getChildren().add(
                    olho
            );

        }

        // =========================================================
        // CAMPO DE TEXTO
        // =========================================================

        else {

            TextField campoTexto =
                    new TextField();

            campoTexto.setPromptText(
                    texto
            );

            campoTexto.setPrefWidth(245);
            campoTexto.setPrefHeight(40);

            campoTexto.setStyle(
                    "-fx-background-color: transparent;" +
                    "-fx-border-color: transparent;" +
                    "-fx-font-family: 'Arial';" +
                    "-fx-font-size: 10px;"
            );

            campo.getChildren().addAll(
                    iconeLabel,
                    campoTexto
            );
        }

        return campo;
    }
}