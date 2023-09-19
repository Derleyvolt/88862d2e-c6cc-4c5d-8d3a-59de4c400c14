function genLinearBalls(nodeId, callback, range, preSelectedBalls, multiple, minOfSelections) {
    let selectedBalls = {};

    preSelectedBalls = new Set(preSelectedBalls);

    for(let i = range[0]; i <= range[1]; i++) {
        $('#'+nodeId).append(`
            <button class="btn rounded-circle border ms-2 ${preSelectedBalls.has(i) ? 
                (() => {
                    selectedBalls[`#${nodeId}${i}`] = i;
                    return 'bg-success';
                })() : ''}" id="${nodeId}${i}">
                ${i}
            </button>
        `)

        $(`#${nodeId}${i}`).on('click', function() {
            if(selectedBalls[`#${nodeId}${i}`]) {
                console.log(selectedBalls);
                if(Object.keys(selectedBalls).length > minOfSelections) {
                    $(this).removeClass('bg-success');
                    delete selectedBalls[`#${nodeId}${i}`];
                }
            } else {
                $(this).addClass('bg-success');

                if(!multiple) {
                    let lastSelectedBall = Object.keys(selectedBalls)[0];
                    $(lastSelectedBall).removeClass('bg-success');
                    delete selectedBalls[lastSelectedBall];
                }

                selectedBalls[`#${nodeId}${i}`] = i;
            }

            callback(Object.entries(selectedBalls).map(e => e[1]));
        });
    }
}

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

function loadSelectedOptionRepetidos() {
    let select = $('#repetidosConcurso').val();

    repeated.clear();

    const repeatedArray = allGamesMap[select];
    for(let i = 0; i < repeatedArray.length; i++) repeated.add(Number(repeatedArray[i]));
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

function fillSelect() {
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

    includedNumbers = config.included;
    excludedNumbers = config.excluded;
}

function saveConfig() {
    let name = $('#configName').val();

    if(name.length) {
        let config = {
            filters: getRestrictionsToLoad(),
            relations: getRelationsToLoad(),
            excluded: excludedNumbers,
            included: includedNumbers,
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

genLinearBalls('number-of-balls', (res) => {
    dezenas = res[0];
}, [15, 20], [15], false, 1);

// genLinearBalls
// param1: id do node
// param2: callback
// param3: intervalo
// param4: lista de bolas selecionadas
// param5: permite multiseleção
// param6: número mínimo de bolas que devem estar selecionadas.