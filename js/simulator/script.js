let allGames;
let allGamesMap;

async function fillSimulatorSelect() {
    try {
        result = await (await fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil')).json();

        let lotofacil = {
        };

        result.sort((a, b) => {
            return a.concurso - b.concurso;
        })

        result.forEach(element => {
            lotofacil[element.concurso] = element.dezenas.map(e => Number(e));
        });

        allGamesMap = lotofacil;

        lotofacil = Object.entries(lotofacil).sort((a, b) => b[0] - a[0]);

        localStorage.setItem('#lotofacil', JSON.stringify(lotofacil));
    } catch(err) {
        console.log(err);
    }

    allGames = JSON.parse(localStorage.getItem('#lotofacil'));

    for(let element of allGames) {
        $('#simulatorSelect').append(`
            <option> ${element[0]} </option>
        `);
    }
}

function drawResultInDOM(nodeId, result) {
    $('#' + nodeId).html('');

    for(var i = 0; i < 15; i++) {
        if(i % 5 == 0) {
            $('#' + nodeId).append(`
                <div class="row">
            `);
        }

        $('#' + nodeId).append(`
            <button class="btn rounded-circle border mb-1">
                    <strong class="text-info"> ${(result[i]) < 10 ? '0' + (result[i]) : result[i]} </strong>
                </button>
        `);

        if((i+1)%5 == 0) {
            $('#' + nodeId).append(`
                </div>
            `);
        }
    }
}

let choisenGame = [];

function selectGame(elem) {
    let concurso = elem.value;

    if(concurso != 'selecione') {
        $('#initialStateSelect').remove();

        if($('#btnCheckMatchs').hasClass('invisible')) {
            $('#btnCheckMatchs').removeClass('invisible');
        }

        choisenGame = allGamesMap[concurso];
        drawResultInDOM('contentNumbersSimulator', allGamesMap[concurso]);
    }
}

let valoresPorNumero = {
    15: 3,
    16: 48,
    17: 408,
    18: 2448,
    19: 11628,
    20: 46512,
}

function searchMatches() {
    for(var i = 1; i <= 5; i++) {
        $(`#1${i}Acertos`).text(`1${i} Acertos: 0`);
    }

    let matches = [0, 0, 0, 0, 0];
    
    filteredGames.forEach((elem) => {
        let numMatches = 0;
        let game = new Set(elem[1]);

        for(var number of choisenGame) {
            numMatches += Number(game.has(number));
        }

        for(var i = 1; i <= 5; i++) {
            let obj = $(`#1${i}Acertos`);
            let textContent = obj.text();
            let text = textContent.split(': ')[0];

            if(numMatches == 10+i) {
                matches[i-1] += 1;
                obj.text(text + ': ' + matches[i-1]);
            }
        }
    });

    $('#resultadoLotoFacil').html('');

    let totalAcertos = matches.reduce((prev, cur) => prev + cur, 0);

    let pontos = [];

    for(let i = 0; i < 5; i++) {
        pontos.push(Number($(`#configPremio${i+1}`).val()));
    }

    $('#resultadoLotoFacil').append(`
        <p class="m-0">Total de jogos com acertos: ${totalAcertos}</p>
        <p class="m-0">Total de jogos com erros: ${filteredGames.length-totalAcertos}</p>
        <p class="m-0">Total de jogos: ${filteredGames.length}</p>
    `)

    let total_gasto = filteredGames.length * valoresPorNumero[dezenas];

    let ganhos = [0, 0, 0, 0, 0];

    ganhos.forEach(function(value, index, arr) {
        arr[index] = matches[index] * pontos[index];
    });

    let total_ganho = ganhos.reduce((prev, next) => prev + next);

    $('#perdasEganhos').html('');

    $('#perdasEganhos').append(`
        <p class="m-0">Total Gasto: ${total_gasto}</p>
        <p class="m-0">Total Ganho: ${total_ganho}</p>
        <p class="m-0">Lucro: ${total_ganho-total_gasto}</p>
    `);
}

function CloseModalConfigPremios() {
    $('#modalConfigPremios').modal('toggle');
}

function modalConfigPremios(e) {
    $('body').append(`
        <div id="modalConfigPremios" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title text-center"> Configurar Prêmios </h5>
        </div>

        <div class="modal-body">
        <div class="d-flex justify-content-center">
        <div class="d-inline-block p-0">
            <div class="d-flex col-8">
                <label>11: </label>
                <input type="number" class="form-control mb-1" id="configPremio1" value="6">
            </div>

            <div class="d-flex col-8">
                <label >12: </label>
                <input type="number" class="form-control m-1" id="configPremio2" value="12">
            </div>

            <div class="d-flex col-8">
                <label >13: </label>
                <input type="number" class="form-control m-1" id="configPremio3" value="30">
            </div>

            <div class="d-flex col-8">
                <label >14: </label>
                <input type="number" class="form-control m-1" id="configPremio4" value="1000">
            </div>

            <div class="d-flex col-8">
                <label> 15: </label>
                <input type="number" class="form-control m-1" id="configPremio5" value="700000">
            </div>

        </div>    
        </div>
        </div>

        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="CloseModalConfigPremios()">Close</button>
        </div>
        </div>
        </div>
        </div>
    `);
}

function openModalConfigPremios() {
    $('#modalConfigPremios').modal('show');
}

modalConfigPremios();
