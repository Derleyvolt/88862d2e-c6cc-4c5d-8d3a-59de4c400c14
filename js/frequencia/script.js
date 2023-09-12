let last_cjl = [5, 5, 5, 5, 5];
let dezenas = 15;

function genLines() {
    for(var i = 0; i < 5; i++) {
        $('.lineBody').append(`
        <div>
            <a class="btn btn-primary col-12 mb-2" data-bs-toggle="collapse" href="#collapseExample${i+1}" role="button" aria-expanded="false" aria-controls="collapseExample${i+1}">
                LINHA ${i+1}
            </a>

            <div class="collapse" id="collapseExample${i+1}">
                <div class="card-body d-flex justify-content-center align-items-center">
                    <div class"container">
                        <div class"row">
                            <div id="line${i+1}">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `);
    }
}

function genContentLine() {
    //removing things to create new ones later
    for(var i = 0; i < 5; i++) {
        let char = 'A';
        let ch = char.charCodeAt(0);
        for(var j = 0; j < last_cjl[i]; j++, ch++) {
            let cc = String.fromCharCode(ch);
            let node = $(`#line${i+1}-${cc}`);
            if(node) node.remove();
        }
    }

    var countl = [];
    let cjl = [];
    for(var i = 0; i < 5; i++) {
        countl.push(Number($(`#count-l${i+1}`).val(), 10));
        cjl.push(Number($(`#cj-line${i+1}`).val(), 10));
    }
    last_cjl = [...cjl];

    for(var i = 0; i < 5; i++) {
        $(`#line${i+1}`).append(`
            <div class="d-flex">
                <div class="container">
                    <div class="row" id="row${i+1}">

                    </div>
                </div>
            </div>
        `);

        let char = 'A';
        let ch = char.charCodeAt(0);
        for(var j = 0; j < cjl[i]; j++, ch++) {
            let cc = String.fromCharCode(ch);
            $(`#row${i+1}`).append(`
                <div class="col border text-center" id="line${i+1}-${cc}">
                    <h2 class=""> ${i+1}${cc} </h2>
                </div>
            `);
        }

        for(var k = 0; k < 5; k++) {
            for(var j = 0; j < Math.max(countl[i], 0); j++) {
                $(`.line${i+1}-${k+1}`).append(`
                    <input type="number" class="w-100 mb-1" id="line${i+1}-${k+1}-${j+1}">
                `);
            }
        }

        char = 'A';
        ch = char.charCodeAt(0);
        for(let j = 0; j < cjl[i]; j++, ch++){
            let cc = String.fromCharCode(ch);
            for(let k = 0; k < countl[i]; k++){
                $(`#line${i+1}-${cc}`).append(`
                    <input type="number" class="w-100 mb-1" id="line${i+1}-${cc}-${k+1}">
                `);

            }
        }
    }
    // preencherInputs();
}

function getRelationsToLoad() {
    let relations = {
    };

    let countl = [];

    let sum = 0;

    for(var i = 0; i < 5; i++) {
        let aux = Number($(`#count-l${i+1}`).val(), 10);
        countl.push(aux);
        sum += aux;

        relations[`#count-l${i+1}`] = aux;
    }

    if(sum != dezenas) {
        alert(`A soma dos números por linha deve ser ${dezenas}.`);
        return undefined;
    }

    for(let i = 0; i < 5; i++) {
        relations[`#cj-line${i+1}`] = Number($(`#cj-line${i+1}`).val(), 10);
    }

    for(var i = 0; i < 5; i++) {
        let char = 'A';
        let ch = char.charCodeAt(0);
        for(var j = 0; j < last_cjl[i]; j++, ch++) {
            let aux = [];
            let cc = String.fromCharCode(ch);
            for(var k = 0; k < countl[i]; k++) {
                if(isNaN(parseInt($(`#line${i+1}-${cc}-${k+1}`).val()))) {
                    alert(`Há um campo vazio na linha ${i+1} na coluna ${i+1}${cc} na célula ${k+1}`);
                    return undefined;
                }
                let componentId = `#line${i+1}-${cc}-${k+1}`;
                relations[componentId] = $(`#line${i+1}-${cc}-${k+1}`).val();
            }
        }
    }

    return relations;
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

    if(sum != dezenas) {
        alert(`A soma dos números por linha deve ser ${dezenas}.`);
        return undefined;
    }

    for(var i = 0; i < 5; i++) {
        let char = 'A';
        let ch = char.charCodeAt(0);
        for(var j = 0; j < last_cjl[i]; j++, ch++) {
            let aux = [];
            let cc = String.fromCharCode(ch);
            for(var k = 0; k < countl[i]; k++) {
                if(isNaN(parseInt($(`#line${i+1}-${cc}-${k+1}`).val()))) {
                    alert(`Há um campo vazio na linha ${i+1} na coluna ${i+1}${cc} na célula ${k+1}`);
                    return undefined;
                }

                aux.push(Number($(`#line${i+1}-${cc}-${k+1}`).val()));
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
        let char = 'A';
        let ch = char.charCodeAt(0);
        let max = (i+1)*5;
        let min = max-4;
        for(var j = 0; j < last_cjl[i]; j++, ch++) {
            let cc = String.fromCharCode(ch);
            for(var k = 0; k < countl[i]; k++) {
                // $(`#line${i+1}-${cc}-${k+1}`).val(Math.round(Math.random() * (max - min) + min));
                $(`#line${i+1}-${cc}-${k+1}`).val(min+k);
            }
        }
    }
}

genLines();
genContentLine();
preencherInputs();
