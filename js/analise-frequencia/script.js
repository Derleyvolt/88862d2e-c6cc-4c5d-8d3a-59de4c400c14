function searchGamesByFrequency() {
    filteredGames = [];

    let frequency = [];

    const getFrequency = (game) => {
        let res = [0, 0, 0, 0, 0];

        for(let num of game) {
            res[Math.ceil(num / 5)-1]++;
        }

        return res;
    }

    for(let i = 0; i < 5; i++) {
        frequency.push(Number($(`#analise-freq${i+1}`).val()))
    }

    if(frequency.reduce((prev, next) => prev + next) != 15) {
        alert('A soma das linhas deve ser 15.')
        return;
    }

    const compare = (l1, l2) => {
        for(let i = 0; i < l1.length; i++) {
            if(l1[i] != l2[i]) {
                return false;
            }
        }

        return true;
    }

    for(let [_, game] of allGames) {
        if(compare(getFrequency(game), frequency)) {
            filteredGames.push([game.slice(0, 5), game]);
        }
    }

    fillTable();
}