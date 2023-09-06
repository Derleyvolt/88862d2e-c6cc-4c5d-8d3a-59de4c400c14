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

fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest')
.then(res => res.json())
.then(res => {
    const repeatedArray = res.dezenas;
    for(let i = 0; i < repeatedArray.length; i++) repeated.add(Number(repeatedArray[i]));
    console.log(repeated.values());
});

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

function calcGames(restrictions, edges){
    let valid_games = [];
    for(let a = 1; a <= 5; a++){
        for(let b = 6; b <= 10; b++){
            for(let c = 11; c <= 15; c++){
                for(let d = 16; d <= 20; d++){
                    for(let e = 21; e <= 25; e++){
                        let game = [];
                        for(let n = 0; n < edges[a-1].length; n++) game.push(edges[a-1][n]);
                        for(let n = 0; n < edges[b-1].length; n++) game.push(edges[b-1][n]);
                        for(let n = 0; n < edges[c-1].length; n++) game.push(edges[c-1][n]);
                        for(let n = 0; n < edges[d-1].length; n++) game.push(edges[d-1][n]);
                        for(let n = 0; n < edges[e-1].length; n++) game.push(edges[e-1][n]);
                        if(game_is_valid(game, restrictions))
                            valid_games.push([[a, b, c, d, e], game]);
                    }
                }
            }
        }
    }
    return valid_games;
}

let edges = [];
edges.push([1, 2, 3]);
edges.push([1, 2, 3]);
edges.push([1, 2, 3]);
edges.push([3, 4, 5]);
edges.push([3, 4, 5]);

edges.push([6, 7, 8]);
edges.push([6, 7, 8]);
edges.push([6, 7, 8]);
edges.push([8, 9, 10]);
edges.push([8, 9, 10]);

edges.push([11, 12, 13]);
edges.push([11, 12, 13]);
edges.push([11, 12, 13]);
edges.push([13, 14, 15]);
edges.push([13, 14, 15]);

edges.push([16, 17, 18]);
edges.push([16, 17, 18]);
edges.push([16, 17, 18]);
edges.push([18, 19, 20]);
edges.push([18, 19, 20]);

edges.push([21, 22, 23]);
edges.push([21, 22, 23]);
edges.push([21, 22, 23]);
edges.push([23, 24, 25]);
edges.push([23, 24, 25]);


let restrictions = {
    pares: [7, 7],
    impares: [8, 8],
    moldura: [9, 9],
    primos: [5, 6],
    repetidos: [0, 3000],
    m3: [0, 5],
    fib: [0, 5],
    soma: [120, 200]
};
// soma: [120, 280]

// console.log(edges);
// console.log(restrictions);
// console.log(calcGames(restrictions, edges));
