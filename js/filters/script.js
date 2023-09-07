function genFilters(filters) {
    for(var e of filters) {
        const {id, name} = e;

        $('.mainFilter').append(`
        <div class="mt-2 card col-12">
            <div class="card-header text-center">
                <strong> ${name} </strong>
            </div>
    
            <div class="card-body col-12">
                <div class="d-flex justify-content-center">
                    <div class="form-floating me-2 mb-2 d-flex col-6">
                        <input type="number" id="${id + '-min'}" class="form-control" placeholder="minimo" value="0">
                        <label for="${id + '-min'}" class="mt-1 me-2 text-danger"> min </label>
                    </div>

                    <div class="form-floating mb-2 d-flex col-6">
                        <input type="number" id="${id + '-max'}" class="form-control" placeholder="maximo" value="3000">
                        <label for="${id + '-max'}" class="mt-1 me-2 text-danger"> max </label>
                    </div>
                </div>
            </div>
        </div>`);

    }

    $('.mainFilter').append(`
        <div class="mt-2 card col-12">
            <div class="card-header">
            <strong> Incluir e Excluir </strong>
            </div>
            <div class="d-flex m-2 justify-content-center">
                <button class="btn btn-primary me-2" onclick="showModalChoice('include')"> Incluir </button>
                <button class="btn btn-primary" onclick="showModalChoice('exclude')"> Excluir </button>
            </div>
        </div>
    `);
}

// this function saves component ids to load them more easily
function getRestrictionsToLoad() {
    const restrictions = {
    };

    const restrictionsName = ['pares', 'moldura', 'primos', 'repetidos', 'm3', 'fib', 'soma'];

    for(var i = 0; i < filters.length; i++) {
        let min = $(`#${restrictionsName[i] + '-' + 'min'}`).val();
        let max = $(`#${restrictionsName[i] + '-' + 'max'}`).val();

        restrictions[`#${restrictionsName[i] + '-' + 'min'}`] = min;
        restrictions[`#${restrictionsName[i] + '-' + 'max'}`] = max;
    }

    return restrictions;
}

function getRestrictions() {
    const restrictions = {
    };

    const restrictionsName = ['pares', 'moldura', 'primos', 'repetidos', 'm3', 'fib', 'soma'];

    for(var i = 0; i < filters.length; i++) {
        let min = $(`#${restrictionsName[i] + '-' + 'min'}`).val();
        let max = $(`#${restrictionsName[i] + '-' + 'max'}`).val();
        restrictions[restrictionsName[i]] = [Number(min), Number(max)];
    }

    return restrictions;
}

let filters = [ 
    {
        name: "Pares",
        id: "pares"
    }, 
    {
        name: "Moldura",
        id: "moldura"
    }, 
    {
        name: "Primos",
        id: "primos"
    },
    {
        name: "Repetidos",
        id: "repetidos"
    }, 
    {
        name: "Múltiplos de 3",
        id: "m3"
    },
    {
        name: "Fibonacci",
        id: "fib"
    },
    {
        name: "Soma",
        id: "soma"
    },
]

genFilters(filters);