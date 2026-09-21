package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class PedidoRealizadoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String VERDE = "#92F4AE";
    private final String VERDE_ICONE = "#267542";
    private final String FUNDO = "#FAF8F7";

    public PedidoRealizadoView(Main main) {

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
                800,
                28,
                "×"
        );

        fechar.setFill(Color.WHITE);

        fechar.setFont(
                Font.font(
                        "Arial",
                        32
                )
        );

        fechar.setStyle(
                "-fx-cursor: hand;"
        );

        fechar.setOnMouseClicked(event -> {
            System.exit(0);
        });

        getChildren().add(fechar);

        // =========================================================
        // CÍRCULO VERDE
        // =========================================================

        Circle circulo = new Circle(
                121
        );

        circulo.setCenterX(410);
        circulo.setCenterY(256);

        circulo.setFill(
                Color.web(VERDE)
        );

        getChildren().add(circulo);

        // =========================================================
        // CHECK / ÍCONE DE CONFIRMAÇÃO
        // =========================================================

        Line check1 = new Line(
                397, 230,
                406, 239
        );

        check1.setStroke(
                Color.web(VERDE_ICONE)
        );

        check1.setStrokeWidth(2.5);

        check1.setStrokeLineCap(
                javafx.scene.shape.StrokeLineCap.ROUND
        );

        Line check2 = new Line(
                406, 239,
                429, 216
        );

        check2.setStroke(
                Color.web(VERDE_ICONE)
        );

        check2.setStrokeWidth(2.5);

        check2.setStrokeLineCap(
                javafx.scene.shape.StrokeLineCap.ROUND
        );

        getChildren().addAll(
                check1,
                check2
        );

        // =========================================================
        // TEXTO PRINCIPAL
        // =========================================================

        Label pedido = new Label(
                "Pedido Realizado!"
        );

        pedido.setLayoutX(305);
        pedido.setLayoutY(250);

        pedido.setPrefWidth(210);

        pedido.setAlignment(
                Pos.CENTER
        );

        pedido.setTextFill(
                Color.web(MARROM)
        );

        pedido.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        22
                )
        );

        getChildren().add(pedido);

        // =========================================================
        // TEXTO SECUNDÁRIO
        // =========================================================

        Label confirmacao = new Label(
                "Aguardar Confirmação"
        );

        confirmacao.setLayoutX(300);
        confirmacao.setLayoutY(274);

        confirmacao.setPrefWidth(220);

        confirmacao.setAlignment(
                Pos.CENTER
        );

        confirmacao.setTextFill(
                Color.web(MARROM)
        );

        confirmacao.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        18
                )
        );

        getChildren().add(confirmacao);
    }
}
