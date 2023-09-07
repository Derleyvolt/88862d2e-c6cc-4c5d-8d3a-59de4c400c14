// fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest')
// .then(res => res.json())
// .then(res => {
//     localStorage.setItem('dezenas', res.dezenas);
// });

function guid() {
    function randomLetter() {
        return 'A'.charCodeAt(0) + Math.floor(Math.random() * 26);
    }

    return String.fromCharCode(...Array(8).fill(0).map(e => randomLetter()));
}

let lastAlert = undefined;

function genAlert(type, message) {
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

    lastAlert = alertGuid;
}

function loadSelectedOption() {
    let select = $('#selectConfig').val();

    if(localStorage.getItem(select)) {
        loadConfig(select);
        genAlert('success', 'Carregado com sucesso!');
    }
}

function fillSelect() {
    let select = $('#selectConfig').val();

    $('#selectConfig').html('');

    $('#selectConfig').append(`
        <option ${select ? '' : 'selected'}> Carregar configuração </option>
    `);

    for(var i of Object.keys(localStorage)) {
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
        if(id == '#count-l5') {
            genContentLine();
        }
    }

    for(var [id, value] of Object.entries(config.filters)) {
        $(id).val(value);
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
        genAlert('primary', 'Salvo!');
    }

}

fillSelect();