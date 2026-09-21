package com.telas;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage stage) {

        PedidoRealizadoView tela =
            new PedidoRealizadoView(this);

        Scene scene = new Scene(
                tela,
                900,
                640
        );

        stage.setTitle("Pedido realizado");
        stage.setScene(scene);
        stage.setResizable(false);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

// usada para testar cada tela na sprint 1. 