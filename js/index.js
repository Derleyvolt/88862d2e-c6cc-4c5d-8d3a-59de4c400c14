const moldura = new Set();
for(let i = 1; i <= 5; i++)
    for(let j = 1; j <= 5; j++)
        if(i == 1 || i == 5 || j == 1 || j == 5)
            moldura.add(5*(i-1)+j);

const primes = new Set();
const primesArray = [2, 3, 5, 7, 11, 13, 17, 19, 23];
for(let i = 0; i < primesArray.length; i++) primes.add(primesArray[i]);

const fib = new Set();
const fibArray = [1, 2, 3, 5, 8, 13, 21];
for(let i = 0; i < fibArray.length; i++) fib.add(fibArray[i]);

const repeated = new Set();

// function loadRepeteatedContest(contest) {
//     fetch(`https://loteriascaixa-api.herokuapp.com/api/lotofacil/${contest}`)
//     .then(res => res.json())
//     .then(res => {
//         const repeatedArray = res.dezenas;
//         for(let i = 0; i < repeatedArray.length; i++) repeated.add(Number(repeatedArray[i]));
//     });
// }

function check_even(game, restrictions){
    let tot_even = 0;
    for(let i = 0; i < game.length; i++)
        tot_even += ((game[i]&1) === 0);
    return (tot_even >= restrictions.pares[0] && tot_even <= restrictions.pares[1]);
}

function check_bezel(game, restrictions){
    let tot_bezel = 0;
    for(let i = 0; i < game.length; i++)
        tot_bezel += moldura.has(game[i]);
    return (tot_bezel >= restrictions.moldura[0] && tot_bezel <= restrictions.moldura[1]);
}

function check_prime(game, restrictions){
    let tot_primes = 0;
    for(let i = 0; i < game.length; i++)
        tot_primes += primes.has(game[i]);
    return (tot_primes >= restrictions.primos[0] && tot_primes <= restrictions.primos[1]);
}

function check_repeated(game, restrictions){
    let tot_repeated = 0;
    for(let i = 0; i < game.length; i++)
        tot_repeated += repeated.has(game[i]);
    return (tot_repeated >= restrictions.repetidos[0] && tot_repeated <= restrictions.repetidos[1]);
}

function check_mult3(game, restrictions){
    let tot_mult = 0;
    for(let i = 0; i < game.length; i++)
        tot_mult += (game[i]%3 == 0);
    return (tot_mult >= restrictions.m3[0] && tot_mult <= restrictions.m3[1]);
}

function check_fib(game, restrictions){
    let tot_fib = 0;
    for(let i = 0; i < game.length; i++)
        tot_fib += fib.has(game[i]);
    return (tot_fib >= restrictions.fib[0] && tot_fib <= restrictions.fib[1]);
}

function check_sum(game, restrictions){
    let sum = 0;
    for(let i = 0; i < game.length; i++)
        sum += game[i];
    return (sum >= restrictions.soma[0] && sum <= restrictions.soma[1]);
}

function game_is_valid(game, restrictions){
    if(!check_even(game, restrictions)) return false;
    if(!check_bezel(game, restrictions)) return false;
    if(!check_prime(game, restrictions)) return false;
    if(!check_repeated(game, restrictions)) return false;
    if(!check_mult3(game, restrictions)) return false;
    if(!check_fib(game, restrictions)) return false;
    if(!check_sum(game, restrictions)) return false;
    return true;
}

function calcGames(restrictions, edges, sets_per_line){
    let valid_games = [];
    let prefix = [sets_per_line[0]];
    for(let i = 1; i < 5; i++) prefix.push(prefix[i-1]+sets_per_line[i]);
    var char = 'A';
    for(let a = 0; a < prefix[0]; a++){
        let cha = String.fromCharCode(char.charCodeAt(0) + a);
        for(let b = prefix[0]; b < prefix[1]; b++){
            let chb = String.fromCharCode(char.charCodeAt(0) + (b-prefix[0]));
            for(let c = prefix[1]; c < prefix[2]; c++){
                let chc = String.fromCharCode(char.charCodeAt(0) + (c-prefix[1]));
                for(let d = prefix[2]; d < prefix[3]; d++){
                    let chd = String.fromCharCode(char.charCodeAt(0) + (d-prefix[2]));
                    for(let e = prefix[3]; e < prefix[4]; e++){
                        let che = String.fromCharCode(char.charCodeAt(0) + (e-prefix[3]));
                        let game = [];
                        for(let n = 0; n < edges[a].length; n++) game.push(edges[a][n]);
                        for(let n = 0; n < edges[b].length; n++) game.push(edges[b][n]);
                        for(let n = 0; n < edges[c].length; n++) game.push(edges[c][n]);
                        for(let n = 0; n < edges[d].length; n++) game.push(edges[d][n]);
                        for(let n = 0; n < edges[e].length; n++) game.push(edges[e][n]);
                        if(game_is_valid(game, restrictions))
                            valid_games.push([["1"+cha, "2"+chb, "3"+chc, "4"+chd, "5"+che], game]);
                    }
                }
            }
        }
    }
    return valid_games;
}
