package com.telas;

import javafx.scene.control.Button;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;

public class ConsultaPedidoView extends Pane {

    private final String MARROM = "#5B292B";
    private final String ROSA = "#E9A6B8";
    private final String ROSA_CLARO = "#F2D5DC";
    private final String FUNDO = "#FAF8F7";

    public ConsultaPedidoView(Main main) {

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
        // TÍTULO
        // =========================================================

        Label titulo = new Label(
                "Consultar Pedido"
        );

        titulo.setLayoutX(373);
        titulo.setLayoutY(91);

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

        getChildren().add(titulo);

        // =========================================================
        // DATA INICIAL
        // =========================================================

        Label de = criarLabel("De");

        de.setLayoutX(277);
        de.setLayoutY(149);

        getChildren().add(de);

        DatePicker dataDe = criarDataPicker();

        dataDe.setLayoutX(259);
        dataDe.setLayoutY(131);

        getChildren().add(dataDe);

        // =========================================================
        // DATA FINAL
        // =========================================================

        Label para = criarLabel("Para");

        para.setLayoutX(472);
        para.setLayoutY(149);

        getChildren().add(para);

        DatePicker dataPara = criarDataPicker();

        dataPara.setLayoutX(455);
        dataPara.setLayoutY(131);

        getChildren().add(dataPara);

        // =========================================================
        // FILTROS RÁPIDOS
        // =========================================================

        Button hoje = criarFiltro(
                "Hoje",
                231,
                193,
                "#FFB4B4"
        );

        Button semana = criarFiltro(
                "Esta Sem.",
                335,
                193,
                "#FFF0B4"
        );

        Button mes = criarFiltro(
                "Este Mês",
                438,
                193,
                "#C8F1C9"
        );

        Button trintaDias = criarFiltro(
                "Últim. 30d",
                540,
                193,
                "#BBD9F2"
        );

        getChildren().addAll(
                hoje,
                semana,
                mes,
                trintaDias
        );

        // =========================================================
        // BOTÃO BUSCAR
        // =========================================================

        Button buscar = new Button(
                "Buscar"
        );

        buscar.setLayoutX(314);
        buscar.setLayoutY(238);

        buscar.setPrefWidth(88);
        buscar.setPrefHeight(38);

        buscar.setStyle(
                "-fx-background-color: " + MARROM + ";" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 12px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(buscar);

        // =========================================================
        // BOTÃO LIMPAR
        // =========================================================

        Button limpar = new Button(
                "Limpar"
        );

        limpar.setLayoutX(446);
        limpar.setLayoutY(238);

        limpar.setPrefWidth(88);
        limpar.setPrefHeight(38);

        limpar.setStyle(
                "-fx-background-color: #C40000;" +
                "-fx-text-fill: white;" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 12px;" +
                "-fx-font-weight: bold;" +
                "-fx-cursor: hand;"
        );

        getChildren().add(limpar);

        // =========================================================
        // RESUMO DO PERÍODO
        // =========================================================

        Pane resumo = new Pane();

        resumo.setLayoutX(125);
        resumo.setLayoutY(293);

        resumo.setPrefSize(
                641,
                94
        );

        resumo.setStyle(
                "-fx-background-color: " + ROSA_CLARO + ";" +
                "-fx-background-radius: 6;"
        );

        getChildren().add(resumo);

        Label resumoTitulo = new Label(
                "Resumo do Período"
        );

        resumoTitulo.setLayoutX(17);
        resumoTitulo.setLayoutY(13);

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

        criarResumo(
                resumo,
                "Total Ped.",
                12
        );

        criarResumo(
                resumo,
                "Valor Total (R$)",
                222
        );

        criarResumo(
                resumo,
                "Pedidos Pendentes",
                429
        );

        // =========================================================
        // TABELA
        // =========================================================

        Pane tabela = new Pane();

        tabela.setLayoutX(126);
        tabela.setLayoutY(400);

        tabela.setPrefSize(
                640,
                220
        );

        tabela.setStyle(
                "-fx-background-color: white;" +
                "-fx-background-radius: 6;"
        );

        getChildren().add(tabela);

        // =========================================================
        // CABEÇALHO
        // =========================================================

        Rectangle cabecalho = new Rectangle(
                0,
                0,
                640,
                25
        );

        cabecalho.setFill(
                Color.web(ROSA_CLARO)
        );

        tabela.getChildren().add(
                cabecalho
        );

        adicionarCabecalho(
                tabela,
                "#",
                19
        );

        adicionarCabecalho(
                tabela,
                "Cliente",
                120
        );

        adicionarCabecalho(
                tabela,
                "Data Pedi.",
                237
        );

        adicionarCabecalho(
                tabela,
                "Entrega",
                318
        );

        adicionarCabecalho(
                tabela,
                "Valor (R$)",
                388
        );

        adicionarCabecalho(
                tabela,
                "Status",
                488
        );

        adicionarCabecalho(
                tabela,
                "Ações",
                584
        );

        // =========================================================
        // PEDIDOS
        // =========================================================

        adicionarPedido(
                tabela,
                "001",
                "Maria Silva",
                "01/09",
                "25/09",
                "R$ 205,99",
                "Entregue",
                39,
                true
        );

        adicionarPedido(
                tabela,
                "002",
                "João Souza",
                "01/09",
                "19/09",
                "R$ 150,00",
                "Pendente",
                64,
                false
        );

        adicionarPedido(
                tabela,
                "003",
                "Ana Costa",
                "15/09",
                "12/10",
                "R$ 170,50",
                "Pendente",
                89,
                false
        );

        adicionarPedido(
                tabela,
                "004",
                "Carlos Lima",
                "16/09",
                "14/10",
                "R$ 300,25",
                "Pendente",
                114,
                false
        );

        adicionarPedido(
                tabela,
                "005",
                "Beatriz Alves",
                "05/09",
                "25/10",
                "R$ 100,00",
                "Pendente",
                139,
                false
        );

        // =========================================================
        // RODAPÉ DA TABELA
        // =========================================================

        Label mostrando = new Label(
                "Mostrando 1–5 de 100 Pedidos"
        );

        mostrando.setLayoutX(14);
        mostrando.setLayoutY(174);

        mostrando.setTextFill(
                Color.BLACK
        );

        mostrando.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        7
                )
        );

        tabela.getChildren().add(
                mostrando
        );

        Line linha = new Line(
                14,
                185,
                625,
                185
        );

        linha.setStroke(
                Color.web("#777777")
        );

        tabela.getChildren().add(
                linha
        );

        // =========================================================
        // PAGINAÇÃO
        // =========================================================

        Button anterior = criarPagina(
                "‹",
                496
        );

        Button pagina1 = criarPagina(
                "1",
                520
        );

        Button pagina2 = criarPagina(
                "2",
                543
        );

        Button pontos = criarPagina(
                "...",
                566
        );

        Button pagina50 = criarPagina(
                "50",
                588
        );

        Button proxima = criarPagina(
                "›",
                612
        );

        tabela.getChildren().addAll(
                anterior,
                pagina1,
                pagina2,
                pontos,
                pagina50,
                proxima
        );
    }

    // =============================================================
    // LABEL
    // =============================================================

    private Label criarLabel(String texto) {

        Label label = new Label(
                texto
        );

        label.setTextFill(
                Color.web("#555555")
        );

        label.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        9
                )
        );

        return label;
    }

    // =============================================================
    // DATE PICKER
    // =============================================================

    private DatePicker criarDataPicker() {

        DatePicker data = new DatePicker();

        data.setPrefWidth(125);
        data.setPrefHeight(38);

        data.setPromptText("");

        data.setStyle(
                "-fx-background-color: " + ROSA + ";" +
                "-fx-background-radius: 6;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 9px;" +
                "-fx-border-color: transparent;"
        );

        return data;
    }

    // =============================================================
    // FILTRO
    // =============================================================

    private Button criarFiltro(
            String texto,
            double x,
            double y,
            String cor
    ) {

        Button botao = new Button(
                texto
        );

        botao.setLayoutX(x);
        botao.setLayoutY(y);

        botao.setPrefWidth(91);
        botao.setPrefHeight(23);

        botao.setStyle(
                "-fx-background-color: " + cor + ";" +
                "-fx-border-color: #555555;" +
                "-fx-border-width: 0.7;" +
                "-fx-background-radius: 12;" +
                "-fx-border-radius: 12;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 9px;" +
                "-fx-font-weight: bold;" +
                "-fx-text-fill: " + MARROM + ";" +
                "-fx-cursor: hand;"
        );

        return botao;
    }

    // =============================================================
    // RESUMO
    // =============================================================

    private void criarResumo(
            Pane painel,
            String texto,
            double x
    ) {

        Rectangle fundo = new Rectangle(
                x,
                44,
                193,
                39
        );

        fundo.setArcWidth(7);
        fundo.setArcHeight(7);

        fundo.setFill(
                Color.web(ROSA)
        );

        painel.getChildren().add(
                fundo
        );

        Label label = new Label(
                texto
        );

        label.setLayoutX(x + 6);
        label.setLayoutY(50);

        label.setTextFill(
                Color.web("#555555")
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
    // CABEÇALHO DA TABELA
    // =============================================================

    private void adicionarCabecalho(
            Pane tabela,
            String texto,
            double x
    ) {

        Text cabecalho = new Text(
                x,
                17,
                texto
        );

        cabecalho.setFill(
                Color.BLACK
        );

        cabecalho.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        9
                )
        );

        tabela.getChildren().add(
                cabecalho
        );
    }

    // =============================================================
    // PEDIDO
    // =============================================================

    private void adicionarPedido(
            Pane tabela,
            String numero,
            String cliente,
            String dataPedido,
            String entrega,
            String valor,
            String status,
            double y,
            boolean entregue
    ) {

        adicionarTexto(
                tabela,
                numero,
                20,
                y
        );

        adicionarTexto(
                tabela,
                cliente,
                109,
                y
        );

        adicionarTexto(
                tabela,
                dataPedido,
                243,
                y
        );

        adicionarTexto(
                tabela,
                entrega,
                319,
                y
        );

        adicionarTexto(
                tabela,
                valor,
                388,
                y
        );

        Text statusText = new Text(
                482,
                y,
                status
        );

        statusText.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        9
                )
        );

        if (entregue) {
            statusText.setFill(
                    Color.BLUE
            );
        } else {
            statusText.setFill(
                    Color.RED
            );
        }

        tabela.getChildren().add(
                statusText
        );

        // =========================================================
        // ÍCONE VISUALIZAR
        // =========================================================

        Text olho = new Text(
                579,
                y,
                "⊙"
        );

        olho.setFill(
                Color.BLACK
        );

        olho.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        17
                )
        );

        olho.setStyle(
                "-fx-cursor: hand;"
        );

        tabela.getChildren().add(
                olho
        );

        // =========================================================
        // ÍCONE EXCLUIR
        // =========================================================

        Text excluir = new Text(
                612,
                y,
                "♜"
        );

        excluir.setFill(
                Color.RED
        );

        excluir.setFont(
                Font.font(
                        "Arial",
                        15
                )
        );

        excluir.setStyle(
                "-fx-cursor: hand;"
        );

        tabela.getChildren().add(
                excluir
        );
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

        Text resultado = new Text(
                x,
                y,
                texto
        );

        resultado.setFill(
                Color.BLACK
        );

        resultado.setFont(
                Font.font(
                        "Arial",
                        FontWeight.BOLD,
                        9
                )
        );

        painel.getChildren().add(
                resultado
        );
    }

    // =============================================================
    // PAGINAÇÃO
    // =============================================================

    private Button criarPagina(
            String texto,
            double x
    ) {

        Button botao = new Button(
                texto
        );

        botao.setLayoutX(x);
        botao.setLayoutY(168);

        botao.setPrefWidth(
                texto.equals("...") ? 20 : 18
        );

        botao.setPrefHeight(17);

        botao.setStyle(
                "-fx-background-color: " +
                (texto.equals("1") ||
                 texto.equals("2") ||
                 texto.equals("50")
                        ? ROSA
                        : "white") +
                ";" +
                "-fx-border-color: transparent;" +
                "-fx-background-radius: 3;" +
                "-fx-font-family: 'Arial';" +
                "-fx-font-size: 8px;" +
                "-fx-font-weight: bold;" +
                "-fx-padding: 0;" +
                "-fx-cursor: hand;"
        );

        return botao;
    }
}