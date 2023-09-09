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

        localStorage.setItem('lotofacil', JSON.stringify(lotofacil));
    } catch(err) {
        console.log(err);
    }

    allGames = JSON.parse(localStorage.getItem('lotofacil'));

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

fillSimulatorSelect();

let choisenGame = [];

function selectGame(elem) {
    let concurso = elem.value;

    if(concurso != 'selecione') {
        $('#initialStateSelect').remove();

        if($('#btnCheckMatchs').hasClass('invisible')) {
            $('#btnCheckMatchs').removeClass('invisible');
        }

        choisenGame = allGamesMap[concurso];
        console.log(choisenGame);
        drawResultInDOM('contentNumbersSimulator', allGamesMap[concurso]);
    }
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

            // console.log(textContent, acertos[1]);
            // console.log(numMatches);
            // console.log(acertos[0]);

            
            if(numMatches >= 10+i) {
                matches[i-1] += 1;
                obj.text(text + ': ' + matches[i-1]);
            }
        }
    });
}