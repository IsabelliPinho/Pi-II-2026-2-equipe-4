package com.telas;

import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class CarroVazioView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#FFC7C9";
    private final String FUNDO = "#FAF8F7";

    public CarroVazioView(Main main) {

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

        getChildren().add(fechar);

        // =========================================================
        // CÍRCULO ROSA
        // =========================================================

        Circle circulo = new Circle(
                111
        );

        circulo.setCenterX(410);
        circulo.setCenterY(242);

        circulo.setFill(
                Color.web(ROSA)
        );

        getChildren().add(circulo);

        // =========================================================
        // ÍCONE DO CARRINHO
        // =========================================================

        // Cabo
        Text cabo = new Text(
                387,
                195,
                "—"
        );

        cabo.setFill(Color.WHITE);

        cabo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        20
                )
        );

        getChildren().add(cabo);

        // Corpo do carrinho
        javafx.scene.shape.Polyline carrinho =
                new javafx.scene.shape.Polyline();

        carrinho.getPoints().addAll(
                393.0, 195.0,
                399.0, 221.0,
                424.0, 221.0,
                431.0, 202.0,
                402.0, 202.0
        );

        carrinho.setFill(
                Color.TRANSPARENT
        );

        carrinho.setStroke(
                Color.WHITE
        );

        carrinho.setStrokeWidth(2.5);

        getChildren().add(carrinho);

        // Rodinha esquerda
        Circle roda1 = new Circle(
                4.5
        );

        roda1.setCenterX(402);
        roda1.setCenterY(225);

        roda1.setFill(
                Color.TRANSPARENT
        );

        roda1.setStroke(
                Color.WHITE
        );

        roda1.setStrokeWidth(2);

        getChildren().add(roda1);

        // Rodinha direita
        Circle roda2 = new Circle(
                4.5
        );

        roda2.setCenterX(421);
        roda2.setCenterY(225);

        roda2.setFill(
                Color.TRANSPARENT
        );

        roda2.setStroke(
                Color.WHITE
        );

        roda2.setStrokeWidth(2);

        getChildren().add(roda2);

        // =========================================================
        // TEXTO
        // =========================================================

        Label vazio = new Label(
                "Carrinho vazio"
        );

        vazio.setLayoutX(323);
        vazio.setLayoutY(248);

        vazio.setTextFill(
                Color.web(MARROM)
        );

        vazio.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        23
                )
        );

        vazio.setPrefWidth(180);

        vazio.setAlignment(
                Pos.CENTER
        );

        getChildren().add(vazio);
    }
}