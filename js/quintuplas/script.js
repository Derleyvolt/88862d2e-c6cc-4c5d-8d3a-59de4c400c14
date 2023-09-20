var paginationCurrentIndex = 0;
var resultsPerPage = 10;
// ############################### PAGINATION SETUP ###############################

class Pagination {
    constructor(rows, rowsPerPage, indexesCount, nodeId, content) {
        this._rows = rows;
        this._rowsPerPage = rowsPerPage;
        this._indexesCount = indexesCount;
        this._nodeId = '.' + nodeId;
        this._startIndex = 0;
        this._content = content;
        this._endIndex = Math.min(this._indexesCount, Math.ceil(this._rows/this._rowsPerPage));

        this._currentIndex = 0;
    }

    clear() {
        $(this._nodeId).html('');
    }

    reloadTable() {
        clearTable();

        let startIndex = this._currentIndex * this._rowsPerPage;

        for(var i = startIndex; i < Math.min(startIndex + this._rowsPerPage, this._rows); i++) {
            fillRowTable(this._content[i][0]);
        }
    }

    getPageFromIndex(event) {
        event.preventDefault();
        let value = Number(event.target.textContent);

        this._currentIndex = value-1;
        this.reloadTable();
        this.clear();
        this.render();
    }

    render() {
        $(this._nodeId).append(`
<li class="page-item ${this._currentIndex == 0 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="pagination.prev(event)">Previous</a></li>
`
        );

        for(var i = this._startIndex; i < this._endIndex; i++) {
            if(i == this._currentIndex) {
                $(this._nodeId).append(`
<li class="page-item active"><a class="page-link" href="#" onclick="pagination.getPageFromIndex(event)">${i+1}</a></li>
`
                );
            } else {
                $(this._nodeId).append(`
<li class="page-item"><a class="page-link" href="#" onclick="pagination.getPageFromIndex(event)">${i+1}</a></li>
`
                );   
            }
        }

        $(this._nodeId).append(`
<li class="page-item ${this._currentIndex+1 >= this._rows ? 'disabled' : ''}"><a class="page-link" href="#" onclick="pagination.next(event)">Next</a></li>
`);
    }

    next(event) {
        event.preventDefault();
        this._currentIndex += 1;

        if (this._startIndex + this._indexesCount < this._rows) {
            this._startIndex = this._currentIndex;
        }

        this._endIndex = this._startIndex + this._indexesCount > this._rows ? 
            this._endIndex = this._rows : this._startIndex + this._indexesCount;

        this.reloadTable();
        this.clear();
        this.render();
    }

    prev(event) {
        event.preventDefault();
        if (this._endIndex - this._indexesCount > 0) {
            this._endIndex = this._currentIndex;
        }

        this._currentIndex -= 1;

        this._startIndex = this._currentIndex - this._indexesCount < 0 ? 
            this._startIndex = 0 : this._endIndex - this._indexesCount;

        this.reloadTable();
        this.clear();
        this.render();
    }

    getSelectedIndex() {
        return this._currentIndex;
    }
}

function closeModalToChoice() {
    $('#myModalChoice').modal('toggle');
}

function closeModal() {
    $('#myModal').modal('toggle');
}

let includedNumbers = [];
let excludedNumbers = [];

function genModalToChoice(type) {
    $('body').append(`
<div id="myModalChoice" class="modal" tabindex="-1" role="dialog">
<div class="modal-dialog modal-dialog-centered" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title text-center">${ type == 'include' ? 'Escolha as dezenas a serem incluídas' : 'Escolha as dezenas a serem excluídas' }</h5>
</div>

<div class="modal-body">
<div class="d-flex justify-content-center">
<div class="d-inline-block p-0" id="contentNumbers1">
</div>    
</div>
</div>

<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModalToChoice()">Close</button>
</div>
</div>
</div>
</div>
`);

    for(var i = 0; i < 25; i++) {
        let btnId = guid();

        if(i % 5 == 0) {
            $('#contentNumbers1').append(`
<div class="row">
`);
        }

        let color = '';

        if(includedNumbers.indexOf(i+1) != -1) {
            color = 'btn-success';
        } else if(excludedNumbers.indexOf(i+1) != -1) {
            color = 'btn-danger';
        }

        $('#contentNumbers1').append(`
<button class="btn rounded-circle border ${color}" id="${btnId}">
${(i+1) < 10 ? '0' + (i+1) : i+1}
</button>
`);

        $('#'+btnId).on('click', function(event) {
            if(this.classList.contains('btn-success') && type=='include') {
                this.classList.remove('btn-success');
                let number = Number(this.textContent);
                includedNumbers = includedNumbers.filter(e => e != number);

            } else if(this.classList.contains('btn-danger') && type=='exclude') {
                this.classList.remove('btn-danger');
                let number = Number(this.textContent);
                excludedNumbers = excludedNumbers.filter(e => e != number);
            } else if(!this.classList.contains('btn-success') && !this.classList.contains('btn-danger')) {
                this.classList.add(type == 'include' ? 'btn-success' : 'btn-danger');

                if(type == 'include') {
                    includedNumbers.push(Number(this.textContent));
                } else {
                    excludedNumbers.push(Number(this.textContent));
                }
            }

        });

        if((i+1)%5 == 0) {
            $('#contentNumbers1').append(`
</div>
`);
        }
    }
}

let resultsSelectedFilterColor = {

};

function genModal(game) {
    // clear selected filters
    for(let i = 0; i < 25; i++) {
        resultsSelectedFilterColor[i+1] = 0;
    }

    let numbers = new Set(game.numbers);

    let applyFilter = [...numbers];

    let statisticEnum = {
        "pares": applyFilter.filter(e => e % 2 == 0),
        "impares": applyFilter.filter(e => e % 2),
        "primos": applyFilter.filter(e => primes.has(e)),
        "moldura": applyFilter.filter(e => moldura.has(e)),
        "múltiplos 3": applyFilter.filter(e => e % 3 == 0),
        "repetidos": applyFilter.filter(e => repeated.has(e)),
        "fibonacci": applyFilter.filter(e => fib.has(e)),
    }

    let statisticCount = {
        "pares": applyFilter.reduce((prev, cur) => prev + Number(cur % 2 == 0), 0),
        "impares": 0,
        "soma": applyFilter.reduce((prev, cur) => prev + cur, 0),
        "primos": applyFilter.reduce((prev, cur) => prev + Number(primes.has(cur)), 0),
        "moldura": applyFilter.reduce((prev, cur) => prev + Number(moldura.has(cur)), 0),
        "múltiplos 3": applyFilter.reduce((prev, cur) => prev + Number(cur % 3 == 0), 0),
        "repetidos": applyFilter.reduce((prev, cur) => prev + Number(repeated.has(cur)), 0),
        "fibonacci": applyFilter.reduce((prev, cur) => prev + Number(fib.has(cur)), 0)
    };

    statisticCount.impares = 15 - statisticCount.pares;

    $('body').append(`
<div id="myModal" class="modal" tabindex="-1" role="dialog">
<div class="modal-dialog modal-dialog-centered" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title text-center">Jogo ${game.numberGame}</h5>
</div>

<div class="modal-body">
<div class="d-flex justify-content-center">
<div class="d-inline-block p-0" id="contentNumbers">
</div>    

</div>

<div class="container m-2">
<div class="row col-12 justify-content-center" id="statistics">

</div>
</div>
</div>

<div class="modal-footer">

<div class="d-flex ">
<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal()">Close</button>
</div>
</div>
</div>
</div>
</div>
`);

    for(let filter of Object.entries(statisticCount)) {
        let id = guid();
        $('#statistics').append(`
<div class="rounded ${filter[0] == 'soma' ? '' : 'border'} border-primary ps-1 pe-1 m-1 w-auto">
<div class="col" id="${id}">
<small> ${filter[0]}: ${filter[1]} </small>
</div>
</div>
`);

        if(filter[0] != 'soma') {
            $('#' + id).on('click', function(event) {
                let parentClass = this.parentElement.classList;

                if(!parentClass.contains('bg-info')) {
                    parentClass.add('bg-info');
                    statisticEnum[filter[0]].forEach((i) => {
                        let result = $(`#numberResult${i}`);
                        result.removeClass('bg-success');
                        result.addClass('bg-warning');
                        resultsSelectedFilterColor[i]++; // store counter
                    });
                } else {
                    statisticEnum[filter[0]].forEach((i) => {
                        parentClass.remove('bg-info');

                        let result = $(`#numberResult${i}`);
                        resultsSelectedFilterColor[i]--;

                        if(resultsSelectedFilterColor[i] == 0) {
                            result.removeClass('bg-warning');
                            result.addClass('bg-success');
                        }
                    });
                }
            });
        }
    }

    const numberSet = new Set(game.numbers);

    for(var i = 0; i < 25; i++) {
        if(i % 5 == 0) {
            $('#contentNumbers').append(`
<div class="row">
`);
        }

        if(numberSet.has(i+1)) {
            $('#contentNumbers').append(`
<button class="btn rounded-circle border bg-success" id="numberResult${i+1}">
${(i+1) < 10 ? '0' + (i+1) : i+1}
</button>
`);
        } else {
            $('#contentNumbers').append(`
<button class="btn rounded-circle border">
${(i+1) < 10 ? '0' + (i+1) : i+1}
</button>
`);
        }

        if((i+1)%5 == 0) {
            $('#contentNumbers').append(`
</div>
`);
        }
    }
}

function fillRowTable(numbers) {
    var html = '<tr>';

    for(var i = 0; i < numbers.length; i++) {
        html = html.concat(`<td class="text-center p-0 text-success"><button class="btn btn-success rounded-circle btn-sm">${numbers[i] < 10 ? '0' + numbers[i] : numbers[i]}</button></td>`);
    }

    html = html.concat(`<td class="text-center ms-2">
<button class="btn btn-primary btn-sm" onclick="showModal(this)"> Mostrar </button>
</td>
</tr>`)

    $('.table-body').append(html);
}

function clearTable() {
    let table = $('.table-body');
    table.html('');
}

function showModalChoice(type) {
    $('#myModalChoice').remove();

    genModalToChoice(type);

    $('#myModalChoice').modal('show');
}

function showModal(element) {
    let rowIndex = element.parentElement.parentElement.rowIndex;
    let page     = pagination.getSelectedIndex();
    let content  = pagination._content[ (page * pagination._rowsPerPage) + rowIndex - 1];

    const game = {
        numberGame: (page * pagination._rowsPerPage) + rowIndex,
        numbers: content[1]
    }

    $('#myModal').remove();

    genModal(game);

    $('#myModal').modal('show');
}

function filterIncludedExcluded(arr){
    for(var e of excludedNumbers) {
        if (arr[1].indexOf(e) != -1) {
            return false;
        }
    }

    for(var e of includedNumbers) {
        if (arr[1].indexOf(e) == -1) {
            return false;
        }
    }

    return true;
}

function getFilteredGames() {
    let edges        = getRelations();
    let restrictions = getRestrictions();
    let aux_cj = [...last_cjl];
    let prefix = [last_cjl[0]];
    for(let i = 1; i < last_cjl.length; i++) prefix.push(prefix[i-1]+last_cjl[i]);
    for(let i = 4; i >= 0; i--){
        if(aux_cj[i] == 0){
            edges.splice(prefix[i], 0, []);
            aux_cj[i] = 1;
        }
    }

    console.log(edges);

    let result = calcGames(restrictions, edges, aux_cj);
    result = result.filter(filterIncludedExcluded);

    return result;
}

let pos = [[0], [0], [0], [0], [0]];
let comb = [
    [[]],
    [[1], [2], [3], [4], [5]],
    [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]],
    [[1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]],
    [[1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5], [2, 3, 4, 5]],
    [[1, 2, 3, 4, 5]]
];

function generateCombs(choose, sum){
    let combs = [];
    for(let i = 0; i < comb[choose].length; i++){
        let c = [];
        for(let j = 0; j < choose; j++){
            c.push(comb[choose][i][j]+sum);
        }
        combs.push(c);
    }
    return combs;
}

function generatePossibilities(){
    let results = [];
    let restrictions = getRestrictions();
    for(let a = 0; a < pos[0].length; a++){
        let pa = pos[0][a];
        for(let b = 0; b < pos[1].length; b++){
            let pb = pos[1][b];
            for(let c = 0; c < pos[2].length; c++){
                let pc = pos[2][c];
                for(let d = 0; d < pos[3].length; d++){
                    let pd = pos[3][d];
                    for(let e = 0; e < pos[4].length; e++){
                        let pe = pos[4][e];
                        if(pa+pb+pc+pd+pe != dezenas) continue;
                        let tot_cjs = [comb[pa].length, comb[pb].length, comb[pc].length, comb[pd].length, comb[pe].length];
                        const comba = generateCombs(pa, 0), combb = generateCombs(pb, 5), combc = generateCombs(pc, 10), combd = generateCombs(pd, 15), combe = generateCombs(pe, 20);
                        let edges = []; edges.push(...comba); edges.push(...combb); edges.push(...combc); edges.push(...combd); edges.push(...combe);
                        let result = calcGames(restrictions, edges, tot_cjs);
                        result = result.filter(filterIncludedExcluded);
                        results.push(...result);
                    }
                }
            }
        }
    }
    return results;
}

var pagination;
let filteredGames = [];

function fillTable() {
    let len = filteredGames.length;

    $('.pagination').html('');

    pagination = new Pagination(len, resultsPerPage, 5, 'pagination', filteredGames);

    pagination.render();

    clearTable();

    for(var i = 0; i < Math.min(resultsPerPage, len); i++) {
        fillRowTable(filteredGames[i][0]);
    }

    alert(filteredGames.length + " jogos foram gerados!");
}

function fillTableFrequency(){
    filteredGames = getFilteredGames();
    fillTable();
}

function fillTablePossibilities(){
    filteredGames = generatePossibilities();
    fillTable();
}

function gerarString(){
    let jogos = ";";
    for(let i = 1; i <= dezenas; i++) jogos += 'D'+i+';';
    jogos += 'D00\n'
    for(let i = 0; i < filteredGames.length; i++)
        jogos += `Jogo ${i+1};`+filteredGames[i][1].join(';')+';0\n'
    return jogos;
}

function downloadGames(){
    let jogos = gerarString();

    let blob = new Blob([jogos], { type: 'text/csv' });

    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = document.getElementById("downloadSheet").value+".csv";

    downloadLink.click();
}
