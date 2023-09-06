function genLines() {
    for(var i = 0; i < 5; i++) {
        $('.lineBody').append(`
        <div>
            <a class="btn btn-primary col-12 mb-2" data-bs-toggle="collapse" href="#collapseExample${i+1}" role="button" aria-expanded="false" aria-controls="collapseExample${i+1}">
                LINHA ${i+1}
            </a>

            <div class="collapse" id="collapseExample${i+1}">
                <div class="card-body d-flex justify-content-center align-items-center">
                    <div id="line${i+1}">

                    </div>
                </div>
            </div>
        </div>
        `);
    }
}

function genContentLine() {
    var countl = [];

    for(var i = 0; i < 5; i++) {
        countl.push(Number($(`#count-l${i+1}`).val(), 10));
    }

    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
            let node = $(`.line${i+1}-${j+1}`);
            if(node) {
                node.remove();
            }
        }
    }

    for(var i = 0; i < 5; i++) {
        for(var j = i*5+1; j <= (i+1)*5; j+=5) {
            $(`#line${i+1}`).append(`
            <div class="d-flex">
                <div class="container">
                    <div class="row">
                        <div class="col line${i+1}-${1} border text-center">
                            <h2 class=""> ${j} </h2>
                        </div>

                        <div class="col line${i+1}-${2} border text-center">
                            <h2 class=""> ${j+1} </h2>
                        </div>


                        <div class="col line${i+1}-${3} border text-center">
                            <h2 class=""> ${j+2} </h2>
                        </div>

                        <div class="col line${i+1}-${4} border text-center">
                            <h2 class=""> ${j+3} </h2>
                        </div>

                        <div class="col line${i+1}-${5} border text-center">
                            <h2 class=""> ${j+4} </h2>
                        </div>
                    </div>
                </div>
            </div>
            `);
        }

        for(var k = 0; k < 5; k++) {
            for(var j = 0; j < Math.max(countl[i], 0); j++) {
                if(j == 0) {
                    $(`.line${i+1}-${k+1}`).append(`
                        <input type="number" class="w-100 mb-1" id="line${i+1}-${k+1}-${j+1}" value=${i*5+1+k} disabled readonly>
                    `);
                }  else {
                    $(`.line${i+1}-${k+1}`).append(`
                        <input type="number" class="w-100 mb-1" id="line${i+1}-${k+1}-${j+1}">
                    `);
                }
                // i*5+1+k
            }
        }
    }
}

function getRelations() {
    let edges = [];

    let countl = [];

    let sum = 0;

    for(var i = 0; i < 5; i++) {
        let aux = Number($(`#count-l${i+1}`).val(), 10);
        countl.push(aux);
        sum += aux;
    }

    if(sum != 15) {
        alert('A soma dos números por linha deve ser 15.');
        return undefined;
    }

    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
            let aux = [];
            for(var k = 0; k < countl[i]; k++) {
                if(isNaN(parseInt($(`#line${i+1}-${j+1}-${k+1}`).val()))) {
                    alert(`Há um campo vazio na linha ${i+1} no número ${i*5+1+j} na célula ${k+1}`);
                    return undefined;
                }

                aux.push(Number($(`#line${i+1}-${j+1}-${k+1}`).val()));
            }

            edges.push(aux);
        }
    }

    return edges;
}

function preencherInputs() {
    let countl = [];

    for(var i = 0; i < 5; i++) {
        let aux = Number($(`#count-l${i+1}`).val(), 10);
        countl.push(aux);
    }

    for(var i = 0; i < 5; i++) {
        for(var j = 0;  j < 5; j++) {
            for(var k = 1; k < countl[i]; k++) {
                if(i*5+1+j+k < i*5+1+5) {
                    $(`#line${i+1}-${j+1}-${k+1}`).val(i*5+1+j+k);
                } else {
                    $(`#line${i+1}-${j+1}-${k+1}`).val(i*5+1+j-k);
                }
            }
        }
    }
}

genLines();
genContentLine();
preencherInputs();