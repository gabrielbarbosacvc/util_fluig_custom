
var utilFFC = (function () {
    /**
     * Função LoadingScreen
     *
     * Essa função cria uma tela de carregamento personalizada utilizando o componente FLUIGC.loading.
     * Ela é utilizada para indicar ao usuário que o sistema está processando uma ação ou carregando dados.
     *
     * @param {string} [textMessage] - Mensagem personalizada exibida na tela de carregamento. Se não for fornecida, será usada uma mensagem padrão.
     *
     * @returns {Object} loadingScreen - Objeto que controla a tela de carregamento.
     *
     * Configurações:
     * - `textMessage`: Mensagem exibida na tela de carregamento (padrão: 'Carregando dados, por favor aguarde...').
     * - `css`: Define o estilo visual da tela de carregamento (ex.: posição, tamanho, bordas, cores, etc.).
     * - `overlayCSS`: Configura o estilo do overlay que cobre o restante da página (ex.: cor e opacidade).
     * - `cursorReset`: Define o cursor após o carregamento (padrão: 'default').
     * - `baseZ`: Define a altura (z-index) da tela de carregamento para garantir que ela fique acima de outros elementos.
     * - `centerX` e `centerY`: Centralizam a tela no eixo X e Y.
     * - `bindEvents`: Permite associar eventos ao elemento de carregamento (padrão: true).
     * - `fadeIn` e `fadeOut`: Controlam os tempos de animação de entrada e saída da tela de carregamento.
     * - `timeout`: Tempo limite para a tela desaparecer automaticamente (padrão: 0, sem limite).
     * - `showOverlay`: Indica se o overlay deve ser exibido junto com a tela de carregamento (padrão: true).
     * - `onBlock` e `onUnblock`: Callbacks executados quando a tela é bloqueada ou desbloqueada.
     * - `ignoreIfBlocked`: Define se uma nova tela de carregamento será criada mesmo se outra já estiver ativa (padrão: false).
     *
     * Retorna um objeto `loadingScreen`, que pode ser utilizado para controlar manualmente a exibição
     * e o encerramento da tela de carregamento.
     */

    function loadingScreen(textMessage){

    if (!textMessage) textMessage = 'Carregando dados, por favor aguarde...'; // Define uma mensagem padrão, se necessário.
    var loadingScreen = FLUIGC.loading(window, {
            textMessage: textMessage,
            title: null,
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: '1px solid #aaa',
                backgroundColor: '#fff',
                cursor: 'wait',
                opacity: 1,
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait',
            },
            cursorReset: 'default',
            baseZ: 1000,
            centerX: true,
            centerY: true,
            bindEvents: true,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: true,
            onBlock: null,
            onUnblock: null,
            ignoreIfBlocked: false,
        });
        return loadingScreen;
    }



    function hiddenMovementButtons(ocultar) { // exibi ou esconde os botões de movimentação
        if (ocultar) {
            parent.$('[data-send]').hide();
            parent.$('[data-toggle]').hide();
            parent.$('[data-save]').hide();
            parent.$('[data-transfer]').hide();
            parent.$('[data-cancel]').hide();
        } else {        
            parent.$('[data-send]').show();
            parent.$('[data-toggle]').show();
            parent.$('[data-save]').show();
            parent.$('[data-transfer]').show();
            parent.$('[data-cancel]').show();
        }
    }

    /**
     * Remove todas as linhas de uma tabela específica no formulário Fluig com base em uma chave identificadora.
     *
     * @param {string} tabela - O ID da tabela pai (HTML) que contém os elementos a serem excluídos.
     * @param {string} chave - A chave base utilizada para identificar os elementos na tabela.
     *
     * @return {void} Esta função não retorna valores, mas remove as linhas da tabela com base na chave fornecida.
     *
     * @description
     * Esta função localiza e remove todas as linhas de uma tabela dinâmica no Fluig cujos elementos `input` têm 
     * um ID que inclui a chave identificadora. Utiliza a função nativa `fnWdkRemoveChild` para excluir os elementos corretamente.
     */
    function deleteTable(tabela, chave) {
        var tabela = document.getElementById(tabela); // Obtém o elemento da tabela pelo ID.
        var itens = tabela.getElementsByTagName("input"); // Obtém todos os elementos <input> dentro da tabela.
        var ListaExclusao = new Array(); // Cria uma lista para armazenar os itens a serem excluídos.

        for (var i = 0; i < itens.length; i++) {
            // Verifica se o ID do elemento contém a chave e está no formato esperado (ex.: "chave___").
            if (itens[i].id != null && itens[i].id.indexOf(chave + "___") != -1) {
                ListaExclusao.push(itens[i]); // Adiciona o elemento à lista de exclusão.
            }
        }

        for (var j = 0; j < ListaExclusao.length; j++) {
            // Remove cada item encontrado utilizando a função nativa do Fluig.
            fnWdkRemoveChild(ListaExclusao[j]);
        }
    }


    /**
     * Formata um valor numérico para os formatos brasileiro ou americano.
     *
     * @param {string|number} valor - O valor a ser formatado. Pode ser uma string ou número.
     * @param {boolean} formatoBR - Define o formato de saída: 
     *                              `true` para o formato brasileiro (com vírgulas como separadores decimais),
     *                              `false` para o formato americano (com pontos como separadores decimais).
     *
     * @return {string|number} Retorna o valor formatado como string no formato brasileiro
     *                         ou como número no formato americano.
     *
     * @description
     * Esta função processa um valor numérico que pode estar no formato brasileiro ou americano e
     * converte entre esses formatos de acordo com a necessidade. É útil para manipular valores em campos de formulários
     * e realizar cálculos matemáticos, garantindo consistência entre formatos.
     */
    function formatarValor(valor, formatoBR) {
        valor = String(valor); // Converte o valor para string para garantir compatibilidade com métodos de manipulação de texto.

        if (valor.includes(',')) {
            // Trata valores no formato brasileiro: substitui '.' (separador de milhar) e troca ',' (separador decimal) por '.'.
            valor = valor.replace('.', '').replace(',', '.');
        }

        var numero = parseFloat(valor); // Converte o valor para um número decimal (float).

        if (formatoBR) {
            // Retorna o número no formato brasileiro (ex: 1.234,5678).
            if (isNaN(numero)) return "0,0000"; // Caso o número seja inválido, retorna "0,0000".
            return numero.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
        } else {
            // Retorna o número no formato americano (ex: 1234.5678).
            if (isNaN(numero)) return 0; // Caso o número seja inválido, retorna 0.
            return numero;
        }
    }

    /**
     * Ativa ou desativa os botões de movimentação do formulário no Fluig.
     *
     * @param {boolean} controle - Define o estado dos botões. `true` para desativar e `false` para ativar.
     *
     * @return {void} Esta função não retorna valores, mas altera o estado dos botões de movimentação.
     *
     * @description
     * Esta função desativa ou ativa os botões principais de movimentação no formulário Fluig. 
     * Os botões controlados incluem ações como enviar, salvar, transferir e cancelar.
     */
    function disableMovementButtons(controle) {
        parent.$('[data-send]').attr('disabled', controle);
        parent.$('[data-toggle]').attr('disabled', controle);
        parent.$('[data-save]').attr('disabled', controle);
        parent.$('[data-transfer]').attr('disabled', controle);
        parent.$('[data-cancel]').attr('disabled', controle);
    }


    /**
     * Adiciona opções a um campo `<select>` no formulário.
     *
     * @param {string} campo - O ID do campo `<select>` onde as opções serão adicionadas.
     * @param {Array<string>} options - Lista de opções que serão adicionadas ao campo, ordenadas em ordem alfabética.
     *
     * @return {void} Esta função não retorna valores, mas adiciona as opções ao campo e define o valor previamente salvo, se houver.
     *
     * @description
     * Esta função insere opções em um campo `<select>` no formulário. As opções fornecidas são ordenadas em ordem alfabética
     * e, em seguida, adicionadas ao campo. Caso um valor já esteja salvo em um campo oculto relacionado, ele será selecionado automaticamente no `<select>`.
     */
    function addOptions(campo, options){
        options.sort(); //Ordena em ordem crescente, ou seja, alfabética para strings
        $.each(options, function(index, valor) {
            $('#'+campo).append($('<option>', {
                value: valor,
                text: valor
            }));
        });
        var valor_option = $("#hidden_"+campo).val();
        $('#'+campo).val(valor_option);
    }


    /**
     * Inicializa um campo Zoom no formulário Fluig.
     *
     * @param {string} campoZoom - O ID do campo Zoom onde será aplicado o filtro.
     * @param {string} company - Nome da coluna que será exibida como título no cabeçalho do filtro.
     * @param {Array<string>} options - Lista de opções que serão exibidas no campo Zoom.
     *
     * @return {void} Esta função não retorna valores, mas inicializa o campo Zoom com as opções fornecidas.
     *
     * @description
     * Esta função configura um campo Zoom do Fluig utilizando o componente `FLUIGC.filter`.
     * O campo é preenchido com as opções fornecidas, ordenadas em ordem alfabética. Caso haja
     * um valor previamente salvo no campo oculto relacionado ao Zoom, ele será selecionado automaticamente.
     *
     * @note
     * Para que esta função funcione corretamente, é necessário incluir os seguintes códigos no HTML do formulário:
     * 
     * ```html
     * <link type="text/css" rel="stylesheet" href="/style-guide/css/fluig-style-guide-filter.min.css">
     * <script type="text/javascript" src="/style-guide/js/fluig-style-guide-filter.min.js" charset="utf-8"></script>
     * ```
     */
    function initZoom(campoZoom, company, options) {
        options.sort(); //Ordena em ordem crescente, ou seja, alfabética para strings
        var source = options.map(function(option) {
            return {
                company : option,
                id : options.indexOf(option) + 1
            };
        });
        
        var settingsArray = {
            source: source,
            displayKey: 'company',
            multiSelect: false,
            style: {
                autocompleteTagClass: 'tag-gray',
                tableSelectedLineClass: 'info'
            },
            table: {
                header: [{
                    'title': company,
                    'size': 'col-xs-9',
                    'dataorder': 'company',
                    'standard': false
                }],
                renderContent: ['company']
            }
        }; 
        var filter = FLUIGC.filter('#'+campoZoom, settingsArray);
        var valor_campo = $("#hidden_"+campoZoom).val(); 

            if (valor_campo) {
            var item = {
                company : valor_campo
            };
            filter.add(item);
        }
    }

    function ativaMascaraValor(campo, decimal){
        if(!decimal && decimal != 0) decimal = 4 
        $("#"+campo).maskMoney({
            decimal: ",",
            thousands: ".",
            precision: decimal, // Numero de casas decimais
            allowZero: true // Permite a exibição do valor zero
        });
    }

    function ativarCaixa_alta(){
        $(".caixa_alta").on("input", function() {
            $(this).val($(this).val().toUpperCase());
        });
    }

    function formatarData(data, formatoSaida) {
        // Se não foi informado, pega data atual
        if (!data) {
            var hoje = new Date();
            var dia = hoje.getDate();
            var mes = hoje.getMonth() + 1;
            var ano = hoje.getFullYear();
            data = dia + "/" + mes + "/" + ano;
        }

        // Formato de saída padrão
        if (!formatoSaida) formatoSaida = "dd/mm/yyyy";

        // Normaliza separadores
        var texto = data.toString().trim().replace(/[-.]/g, "/");
        var partes = texto.split("/");
        var dia, mes, ano;

        // Detecta formato de entrada
        if (partes[0].length == 4) {
            // yyyy/mm/dd
            ano = partes[0];
            mes = partes[1];
            dia = partes[2];
        } else {
            // dd/mm/yyyy
            dia = partes[0];
            mes = partes[1];
            ano = partes[2];
        }

        // Garante dois dígitos
        if (dia.length == 1) dia = "0" + dia;
        if (mes.length == 1) mes = "0" + mes;

        // Retorna no formato desejado
        if (formatoSaida == "dd/mm/yyyy") {
            return dia + "/" + mes + "/" + ano;
        } else if (formatoSaida == "yyyy/mm/dd") {
            return ano + "/" + mes + "/" + dia;
        } else if (formatoSaida == "yyyy-mm-dd") {
            return ano + "-" + mes + "-" + dia;
        } else if (formatoSaida == "dd-mm-yyyy") {
            return dia + "-" + mes + "-" + ano;
        } else {
            // padrão
            return dia + "/" + mes + "/" + ano;
        }
    }


    function exibirAlerta(mensagem, title, label) {
        if(!title) title = "ATEN\u00C7\u00C3O"
        if(!label) label = "OK"
        FLUIGC.message.alert({
            message: '<div style="text-align: center;"><br><b>'+mensagem+'<b><br></div>',
            title: '<div style="text-align: center;">'+title+'</div>',
            label: label
        });
    }

    function exibirToast(message, type, title){
        if (!message) message = 'Menssagem não informada'
        if (!type) type = 'danger' //success, danger, info, warning
        //if (!title) title = 'ATENÇÃO'
        FLUIGC.toast({
            title: title,
            message: message,
            type: type
        });
    }

    function buttonsCloseModal() {
        $('button[data-close-modal]').click(function() {
            disableMovementButtons(false);
        });
        $('.close').on('click', function() {
            disableMovementButtons(false);
        });
    }

    function formatarCPF(cpf, pontuado) {
        cpf = String(cpf).replace(/\D/g, ''); // Remove tudo que não for dígito
        if (cpf.length !== 11) return null;

        if (!pontuado) return cpf; // retorna só os números
        
        var parte1 = cpf.slice(0, 3);
        var parte2 = cpf.slice(3, 6);
        var parte3 = cpf.slice(6, 9);
        var parte4 = cpf.slice(9, 11);
        
        return parte1+"."+parte2+"."+parte3+"-"+parte4
    }

    function formatarCNPJ(cnpj, pontuado) {        
        cnpj = String(cnpj).replace(/\D/g, ''); // Remove tudo que não for número
        if (cnpj.length !== 14) return null;    // CNPJ inválido
        
        if (!pontuado) return cnpj; // retorna só os números
        
        var parte1 = cnpj.slice(0, 2);
        var parte2 = cnpj.slice(2, 5);
        var parte3 = cnpj.slice(5, 8);
        var parte4 = cnpj.slice(8, 12);
        var parte5 = cnpj.slice(12, 14);

        return parte1+"."+parte2+"."+parte3+"/"+parte4+"-"+parte5
    }


    function safeValue(valor, defaultValue) {
        if (valor === null || valor === undefined) {
            return defaultValue; 
        }

        if (typeof valor === "string") {
            var v = valor.trim().toLowerCase();

            // trata strings inválidas
            if (v === "" || v === "null" || v === "undefined" || v === "nan") {
                return defaultValue;
            }

            return valor.trim();
        }

        if (typeof valor === "number") {
            return isFinite(valor) ? valor : defaultValue;
        }

        if (typeof valor === "boolean") {
            return valor;
        }

        if (Array.isArray(valor)) {
            return valor.length > 0 ? valor : defaultValue;
        }

        if (typeof valor === "object") {
            return Object.keys(valor).length > 0 ? valor : defaultValue;
        }

        return defaultValue;
    }
})();
