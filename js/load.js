function genLinearBalls(nodeId, callback, range, preSelectedBalls, multiple, minOfSelections) {
    let selectedBalls = {};

    preSelectedBalls = new Set(preSelectedBalls);

    $('#'+nodeId).html('');

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
            if(selectedBalls[`#${nodeId}${i}`] != undefined) {
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