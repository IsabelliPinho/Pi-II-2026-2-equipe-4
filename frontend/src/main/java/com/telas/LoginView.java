package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Arc;
import javafx.scene.shape.ArcType;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class LoginView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#E39AAF";
    private final String BRANCO = "#FFFFFF";

    public LoginView(Main main) {

        setPrefSize(970, 700);
        setStyle("-fx-background-color: white;");

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

            faixa.setFill(Color.web(MARROM));

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
        // PEQUENO DESENHO DE BOLO
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
        // GABRIELA MOREIRA
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

        getChildren().add(logo);

        // =========================================================
        // PAINEL ROSA
        // =========================================================

        Pane painel = new Pane();

        painel.setLayoutX(472);
        painel.setLayoutY(106);

        painel.setPrefSize(440, 452);

        painel.setStyle(
                "-fx-background-color: " + ROSA + ";" +
                "-fx-background-radius: 10;" +
                "-fx-effect: dropshadow(" +
                "gaussian, rgba(0,0,0,0.25), 7, 0.2, 2, 4);"
        );

        // =========================================================
        // ÍCONE DO USUÁRIO
        // =========================================================

        Circle circuloUsuario = new Circle(
                45,
                68,
                40
        );

        circuloUsuario.setFill(
                Color.TRANSPARENT
        );

        circuloUsuario.setStroke(
                Color.web(MARROM)
        );

        circuloUsuario.setStrokeWidth(1.3);

        // Cabeça
        Circle cabeca = new Circle(
                45,
                65,
                17
        );

        cabeca.setFill(
                Color.TRANSPARENT
        );

        cabeca.setStroke(
                Color.web(MARROM)
        );

        cabeca.setStrokeWidth(1.3);

        // Corpo
        Arc corpo = new Arc(
                45,
                91,
                27,
                23,
                0,
                180
        );

        corpo.setFill(
                Color.TRANSPARENT
        );

        corpo.setStroke(
                Color.web(MARROM)
        );

        corpo.setStrokeWidth(1.3);

        corpo.setType(
                ArcType.OPEN
        );

        painel.getChildren().addAll(
                circuloUsuario,
                cabeca,
                corpo
        );

        // =========================================================
        // CAMPO USUÁRIO
        // =========================================================

        HBox campoUsuario = criarCampo(
                "♙",
                "Usuário",
                false
        );

        campoUsuario.setLayoutX(67);
        campoUsuario.setLayoutY(130);

        painel.getChildren().add(
                campoUsuario
        );

        // =========================================================
        // CAMPO SENHA
        // =========================================================

        HBox campoSenha = criarCampo(
                "♙",
                "Senha",
                true
        );

        campoSenha.setLayoutX(67);
        campoSenha.setLayoutY(216);

        painel.getChildren().add(
                campoSenha
        );

        // =========================================================
        // NÃO POSSUI CADASTRO
        // =========================================================

        Label cadastro = new Label(
                "Não possui Cadastro?"
        );

        cadastro.setLayoutX(67);
        cadastro.setLayoutY(300);

        cadastro.setTextFill(
                Color.web(MARROM)
        );

        cadastro.setFont(
                Font.font(
                        "Arial",
                        10
                )
        );

        cadastro.setUnderline(true);

        cadastro.setStyle(
                "-fx-cursor: hand;"
        );

        painel.getChildren().add(
                cadastro
        );

        // =========================================================
        // ESQUECEU A SENHA
        // =========================================================

        Label esqueci = new Label(
                "Esqueceu a senha?"
        );

        esqueci.setLayoutX(299);
        esqueci.setLayoutY(300);

        esqueci.setTextFill(
                Color.web("#B94E65")
        );

        esqueci.setFont(
                Font.font(
                        "Arial",
                        10
                )
        );

        esqueci.setUnderline(true);

        esqueci.setStyle(
                "-fx-cursor: hand;"
        );

        painel.getChildren().add(
                esqueci
        );

        // =========================================================
        // BOTÃO ENTRAR
        // =========================================================

        Button entrar = new Button(
                "ENTRAR"
        );

        entrar.setLayoutX(138);
        entrar.setLayoutY(351);

        entrar.setPrefWidth(177);
        entrar.setPrefHeight(43);

        entrar.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        painel.getChildren().add(
                entrar
        );

        // =========================================================
        // ADICIONA PAINEL
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
        campo.setPrefHeight(50);

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

        // Ícone
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
        // SENHA
        // =========================================================

        if (senha) {

            PasswordField campoSenha =
                    new PasswordField();

            campoSenha.setPromptText(
                    texto
            );

            campoSenha.setPrefWidth(245);
            campoSenha.setPrefHeight(45);

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
            Label olho = new Label("◉");

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
        // USUÁRIO
        // =========================================================

        else {

            TextField campoTexto =
                    new TextField();

            campoTexto.setPromptText(
                    texto
            );

            campoTexto.setPrefWidth(245);
            campoTexto.setPrefHeight(45);

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