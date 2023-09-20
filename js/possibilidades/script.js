let possibildiades = []; // lista de lista

function getBallsPossibilities1(balls) {
    pos[0] = balls;
}

function getBallsPossibilities2(balls) {
    pos[1] = balls;
}

function getBallsPossibilities3(balls) {
    pos[2] = balls;
}

function getBallsPossibilities4(balls) {
    pos[3] = balls;
}

function getBallsPossibilities5(balls) {
    pos[4] = balls;
}

let callbacks = [(balls) => {pos[0] = balls; }, (balls) => pos[1] = balls, 
                 (balls) => pos[2] = balls, (balls) => pos[3] = balls,
                 (balls) => pos[4] = balls]

function genLinesPossibilities() {
    for(let i = 0; i < 5; i++) {
        genLinearBalls(`line-poss-${i+1}`, callbacks[i], [0, 5], [0], true, 1);
    }
}

genLinesPossibilities();