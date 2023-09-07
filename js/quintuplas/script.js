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

function closeModal() {
    $('#myModal').modal('toggle');
}

function genModal(game) {
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
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    const numberSet = new Set(game.numbers);

    for(var i = 0; i < 25; i++) {
        if(i % 5 == 0) {
            $('#contentNumbers').append(`
                <div class="row">
            `);
        }

        if(numberSet.has(i+1)) {
            $('#contentNumbers').append(`
            <button class="rounded-circle border bg-success col">
                    ${(i+1) < 10 ? '0' + (i+1) : i+1}
                </button>
            `);
        } else {
            $('#contentNumbers').append(`
            <button class="rounded-circle border col">
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

function showModal(element) {
    let rowIndex = element.parentElement.parentElement.rowIndex;
    let page     = pagination.getSelectedIndex();
    let content  = pagination._content[ (page * pagination._rowsPerPage) + rowIndex - 1];

    const game = {
        numberGame: (page * pagination._rowsPerPage) + rowIndex,
        numbers: content[1]
    }

    console.log(game.numbers);

    $('#myModal').remove();
    
    genModal(game);

    $('#myModal').modal('show');
}

function getFilteredGames() {
    let edges        = getRelations();
    let restrictions = getRestrictions();

    return calcGames(restrictions, edges);
}

var pagination;

function fillTable() {
    let filteredGames = getFilteredGames();
    
    let len = filteredGames.length;
    
    $('.pagination').html('');

    console.log(filteredGames.length);

    pagination = new Pagination(len, resultsPerPage, 5, 'pagination', filteredGames);
    
    pagination.render();
    
    clearTable();

    for(var i = 0; i < Math.min(resultsPerPage, len); i++) {
        fillRowTable(filteredGames[i][0]);
    }
}