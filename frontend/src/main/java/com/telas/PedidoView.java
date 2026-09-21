package com.telas;

import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class PedidoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#E39AAF";
    private final String FUNDO = "#FAF8F7";
    private final String VERDE = "#4FD77A";

    public PedidoView(Main main) {

        setPrefSize(900, 640);

        setStyle(
                "-fx-background-color: " + FUNDO + ";"
        );

        // =========================================================
        // CABEÇALHO
        // =========================================================

        Rectangle cabecalho = new Rectangle(
                0,
                0,
                900,
                44
        );

        cabecalho.setFill(
                Color.web(MARROM)
        );

        getChildren().add(cabecalho);

        Text tituloTopo = new Text(
                25,
                31,
                "Faça seu Pedido"
        );

        tituloTopo.setFill(
                Color.web("#E6E0DE")
        );

        tituloTopo.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        24
                )
        );

        tituloTopo.setStyle(
                "-fx-font-style: italic;"
        );

        getChildren().add(
                tituloTopo
        );

        // =========================================================
        // PAINEL PRINCIPAL
        // =========================================================

        Pane painel = new Pane();

        painel.setLayoutX(93);
        painel.setLayoutY(103);

        painel.setPrefSize(
                707,
                475
        );

        painel.setStyle(
                "-fx-background-color: white;" +
                "-fx-background-radius: 6;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 6;"
        );

        getChildren().add(
                painel
        );

        // =========================================================
        // TÍTULO - ESTRUTURA
        // =========================================================

        Label estrutura = criarTitulo(
                "Estrutura do Bolo"
        );

        estrutura.setLayoutX(45);
        estrutura.setLayoutY(52);

        painel.getChildren().add(
                estrutura
        );

        // =========================================================
        // TÍTULO - ACABAMENTO
        // =========================================================

        Label acabamento = criarTitulo(
                "Acabamento do Bolo"
        );

        acabamento.setLayoutX(353);
        acabamento.setLayoutY(52);

        painel.getChildren().add(
                acabamento
        );

        // =========================================================
        // TAMANHO
        // =========================================================

        Label tamanhoLabel = criarLabel(
                "Tamanho *"
        );

        tamanhoLabel.setLayoutX(36);
        tamanhoLabel.setLayoutY(109);

        painel.getChildren().add(
                tamanhoLabel
        );

        ComboBox<String> tamanho = criarCombo(
                "1kg",
                "1kg",
                "2kg",
                "3kg",
                "5kg"
        );

        tamanho.setLayoutX(97);
        tamanho.setLayoutY(108);

        painel.getChildren().add(
                tamanho
        );

        // =========================================================
        // 1º RECHEIO
        // =========================================================

        Label recheio1Label = criarLabel(
                "1º Recheio *"
        );

        recheio1Label.setLayoutX(36);
        recheio1Label.setLayoutY(159);

        painel.getChildren().add(
                recheio1Label
        );

        ComboBox<String> recheio1 = criarCombo(
                "Brigadeiro",
                "Brigadeiro",
                "Beijinho",
                "Ninho",
                "Doce de leite"
        );

        recheio1.setLayoutX(97);
        recheio1.setLayoutY(158);

        painel.getChildren().add(
                recheio1
        );

        // =========================================================
        // 2º RECHEIO
        // =========================================================

        Label recheio2Label = criarLabel(
                "2º Recheio *"
        );

        recheio2Label.setLayoutX(36);
        recheio2Label.setLayoutY(210);

        painel.getChildren().add(
                recheio2Label
        );

        ComboBox<String> recheio2 = criarCombo(
                "Brigadeiro",
                "Brigadeiro",
                "Beijinho",
                "Ninho",
                "Doce de leite"
        );

        recheio2.setLayoutX(97);
        recheio2.setLayoutY(209);

        painel.getChildren().add(
                recheio2
        );

        // =========================================================
        // ANDAR
        // =========================================================

        Label andarLabel = criarLabel(
                "Andar *"
        );

        andarLabel.setLayoutX(36);
        andarLabel.setLayoutY(260);

        painel.getChildren().add(
                andarLabel
        );

        ComboBox<String> andar = criarCombo(
                "Andar único",
                "Andar único",
                "2 andares",
                "3 andares"
        );

        andar.setLayoutX(97);
        andar.setLayoutY(259);

        painel.getChildren().add(
                andar
        );

        // =========================================================
        // TEMA
        // =========================================================

        Label temaLabel = criarLabel(
                "Tema *"
        );

        temaLabel.setLayoutX(36);
        temaLabel.setLayoutY(309);

        painel.getChildren().add(
                temaLabel
        );

        TextArea tema = criarArea(
                "Descreva aqui as\ncaracterísticas do seu pedido"
        );

        tema.setLayoutX(97);
        tema.setLayoutY(301);

        tema.setPrefWidth(113);
        tema.setPrefHeight(60);

        painel.getChildren().add(
                tema
        );

        // =========================================================
        // COBERTURA
        // =========================================================

        Label coberturaLabel = criarLabel(
                "Cobertura *"
        );

        coberturaLabel.setLayoutX(367);
        coberturaLabel.setLayoutY(109);

        painel.getChildren().add(
                coberturaLabel
        );

        ComboBox<String> cobertura = criarCombo(
                "Ninho",
                "Ninho",
                "Chantilly",
                "Ganache",
                "Buttercream"
        );

        cobertura.setLayoutX(445);
        cobertura.setLayoutY(107);

        painel.getChildren().add(
                cobertura
        );

        // =========================================================
        // TOPO E DECORAÇÃO
        // =========================================================

        Label topoLabel = criarLabel(
                "Topo &\nDecoração"
        );

        topoLabel.setLayoutX(367);
        topoLabel.setLayoutY(158);

        painel.getChildren().add(
                topoLabel
        );

        TextArea topo = criarArea(
                "Descreva a decoração do bolo"
        );

        topo.setLayoutX(445);
        topo.setLayoutY(159);

        topo.setPrefWidth(113);
        topo.setPrefHeight(60);

        painel.getChildren().add(
                topo
        );

        // =========================================================
        // MASSA
        // =========================================================

        Label massaLabel = criarLabel(
                "Massa *"
        );

        massaLabel.setLayoutX(367);
        massaLabel.setLayoutY(240);

        painel.getChildren().add(
                massaLabel
        );

        ComboBox<String> massa = criarCombo(
                "Branca",
                "Branca",
                "Chocolate",
                "Red Velvet",
                "Baunilha"
        );

        massa.setLayoutX(443);
        massa.setLayoutY(237);

        painel.getChildren().add(
                massa
        );

        // =========================================================
        // RESTRIÇÕES ALIMENTARES
        // =========================================================

        Label restricoesLabel = criarLabel(
                "Restrições\nAlimentares"
        );

        restricoesLabel.setLayoutX(367);
        restricoesLabel.setLayoutY(278);

        painel.getChildren().add(
                restricoesLabel
        );

        TextArea restricoes = criarArea(
                "Descreva se houver alguma\nrestrição"
        );

        restricoes.setLayoutX(445);
        restricoes.setLayoutY(272);

        restricoes.setPrefWidth(113);
        restricoes.setPrefHeight(60);

        painel.getChildren().add(
                restricoes
        );

        // =========================================================
        // BOTÃO ADICIONAR AO CARRINHO
        // =========================================================

        Button carrinho = new Button(
                "🛒   Adicionar ao carrinho"
        );

        carrinho.setLayoutX(259);
        carrinho.setLayoutY(397);

        carrinho.setPrefWidth(175);
        carrinho.setPrefHeight(40);

        carrinho.setStyle(
                "-fx-background-color: " + VERDE + ";" +
                "-fx-text-fill: " + MARROM + ";" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 11px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        painel.getChildren().add(
                carrinho
        );
    }

    // =============================================================
    // TÍTULOS
    // =============================================================

    private Label criarTitulo(String texto) {

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
                        21
                )
        );

        return titulo;
    }

    // =============================================================
    // LABELS
    // =============================================================

    private Label criarLabel(String texto) {

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
                        10
                )
        );

        return label;
    }

    // =============================================================
    // COMBOBOX
    // =============================================================

    private ComboBox<String> criarCombo(
            String valor,
            String... opcoes
    ) {

        ComboBox<String> combo =
                new ComboBox<>();

        combo.getItems().addAll(
                opcoes
        );

        combo.setValue(
                valor
        );

        combo.setPrefWidth(81);
        combo.setPrefHeight(19);

        combo.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-border-radius: 8;" +
                "-fx-background-radius: 8;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 8px;" +
                "-fx-padding: 0 2 0 7;"
        );

        return combo;
    }

    // =============================================================
    // TEXTAREA
    // =============================================================

    private TextArea criarArea(
            String texto
    ) {

        TextArea area = new TextArea();

        area.setPromptText(
                texto
        );

        area.setWrapText(
                true
        );

        area.setStyle(
                "-fx-background-color: white;" +
                "-fx-border-color: #9C696B;" +
                "-fx-border-width: 1;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 7px;" +
                "-fx-text-fill: #555555;" +
                "-fx-padding: 5;"
        );

        return area;
    }
}