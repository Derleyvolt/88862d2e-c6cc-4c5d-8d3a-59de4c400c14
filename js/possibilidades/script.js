let callbackList = [(balls) => {pos[0] = balls; }, (balls) => pos[1] = balls, 
                 (balls) => pos[2] = balls, (balls) => pos[3] = balls,
                 (balls) => pos[4] = balls]

function genLinesPossibilities() {
    for(let i = 0; i < 5; i++) {
        genLinearBalls(`line-poss-${i+1}`, callbackList[i], [0, 5], [0], true, 1);
    }
}

genLinesPossibilities();