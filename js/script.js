function guid() {
    function randomLetter() {
        return 'A'.charCodeAt(0) + Math.floor(Math.random() * 26);
    }

    return String.fromCharCode(...Array(8).fill(0).map(e => randomLetter()));
}

let lastAlert = undefined;

function genAlert(type, message, resumeTime) {
    if(lastAlert) {
        $('#' + lastAlert).remove();
    }

    let alertGuid = guid();
    let btnGuid   = guid();

    $('body').append(`
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertGuid}">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" id="${btnGuid}">
            </button>
        </div>
    `);

    $('#' + btnGuid).on('click', function() {
        $('#' + alertGuid).remove();
    });

    setTimeout(function() {
        let node = $('#' + alertGuid);
        if(node) {
            node.remove();
        }
    }, resumeTime);

    lastAlert = alertGuid;
}

function loadSelectedOption() {
    let select = $('#selectConfig').val();

    if(localStorage.getItem(select)) {
        loadConfig(select);
        genAlert('success', 'Carregado com sucesso!', 3000);
    }
}

async function loadSelectedOptionRepetidos() {
    let select = $('#repetidosConcurso').val();

    repeated.clear();

    const repeatedArray = allGamesMap[select];
    try {
        for(let i = 0; i < repeatedArray.length; i++) repeated.add(Number(repeatedArray[i]));
    } catch(err) {
        console.log(err);
    }
}

let s = 0;

function fillSelectRepetidos() {
    let select = $('#repetidosConcurso').val();

    $('#repetidosConcurso').html('');

    $('#repetidosConcurso').append(`
        <option ${select ? '' : 'selected'}> Escolher concurso </option>
    `);

    let allGames = JSON.parse(localStorage.getItem('#lotofacil'));
    
    for(let element of allGames) {
        $('#repetidosConcurso').append(`
            <option ${select == element[0] ? 'selected' : ''}>${element[0]} </option>
        `);
    }
}

async function fillSelect() {
    await fillSimulatorSelect();

    let select = $('#selectConfig').val();
    
    $('#selectConfig').html('');

    $('#selectConfig').append(`
        <option ${select ? '' : 'selected'}> Carregar configuração </option>
    `);

    for(var i of Object.keys(localStorage)) {
        if(i.indexOf('#') == 0) {
            continue;
        }

        $('#selectConfig').append(`
            <option ${select == i ? 'selected' : ''}>${i}</option>
        `);
    }
}

function loadConfig(configName) {
    let config = JSON.parse(localStorage.getItem(configName));

    for(var [id, value] of Object.entries(config.relations)) {
        $(id).val(value);

        // crio os inputs dinâmicos quando termino de preencher os inputs relativos
        // às frequências.
        if(id == '#cj-line5') {
            genContentLine();
        }
    }

    for(var [id, value] of Object.entries(config.filters)) {
        $(id).val(value);

        if(id == '#repetidosConcurso') {
            loadSelectedOptionRepetidos();
        }
    }

    for(var [id, value] of Object.entries(config.premiosPreco)) {
        $(id).val(value);
    }

    for(let i = 0; i < config.possibilidades.length; i++) {
        pos[i] = config.possibilidades[i];
        genLinearBalls(`line-poss-${i+1}`, callbackList[i], [0, 5], config.possibilidades[i], true, 1);
    }

    for(var [id, value] of Object.entries(config.analise_frequencia)) {
        $(id).val(value);
    }

    includedNumbers = config.included;
    excludedNumbers = config.excluded;
    dezenas         = config.numeroDezenas;

    genLinearBalls('number-of-balls', (res) => {
        dezenas = res[0];
    }, [15, 20], [dezenas], false, 1);
}

function saveConfig() {
    alert('xx');
    let name = $('#configName').val();

    if(name.length) {
        let config = {
            filters: getRestrictionsToLoad(),
            relations: getRelationsToLoad(),
            excluded: excludedNumbers,
            included: includedNumbers,
            numeroDezenas: dezenas,
            premiosPreco: {
                '#configPremio1': Number($('#configPremio1').val()),
                '#configPremio2': Number($('#configPremio2').val()),
                '#configPremio3': Number($('#configPremio3').val()),
                '#configPremio4': Number($('#configPremio4').val()),
                '#configPremio5': Number($('#configPremio5').val()),
            },
            possibilidades: [pos[0], pos[1], pos[2], pos[3], pos[4]],
            analise_frequencia: {
                '#analise-freq1': Number($('#analise-freq1').val()),
                '#analise-freq2': Number($('#analise-freq2').val()),
                '#analise-freq3': Number($('#analise-freq3').val()),
                '#analise-freq4': Number($('#analise-freq4').val()),
                '#analise-freq5': Number($('#analise-freq5').val()),
            }
        }
        
        localStorage.setItem(name, JSON.stringify(config));
        genAlert('primary', 'Salvo!', 3000);
    }
}

function removerConfig() {
    let configName = $('#selectConfig').val();

    console.log(configName);

    localStorage.removeItem(configName);
    genAlert('success', 'Configuração apagada!', 3000);
}

fillSelect();
fillSelectRepetidos();