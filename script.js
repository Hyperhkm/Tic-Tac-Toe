const squares = document.querySelectorAll('.container>div'),
      gameBoard = document.querySelector('.container'),
      circle = document.querySelectorAll('.circle'),
      plus = document.querySelectorAll('.plus'),
      bot = document.querySelector('.bot'),
      twoPlayers = document.querySelector('.twoPlayers'),
      h2 = document.querySelector('main > h2');
    
twoPlayers.addEventListener('click', () => {
    game = gameFactory();
    clear(circle, plus);
    h2.innerText = 'Two players mode';

    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            playRound(game, index);
        });
    })
})

const gameFactory = function () {
    const players = (function () {
            let arr = [circle, plus],
                playerOne, playerTwo;
        
            playerOne = arr[Math.floor(Math.random()*2)];
            if(playerOne == plus) {playerOne = plus[0]; playerTwo = circle[0];}
            else playerTwo = plus[0];
        
            return {playerOne, playerTwo}
        })();

        let choice = 0;

    return {choice, players}
    }

function playRound (game, index) {
    switch(true) {
        case game.choice == 0 && plus[index].style.display == '' && circle[index].style.display == '':
             game.players.playerOne == plus[0] ? plus[index].style.display = 'block' : circle[index].style.display = 'block';
             game.choice++; break;
        case game.choice == 1 && plus[index].style.display == '' && circle[index].style.display == '':
            game.players.playerTwo == plus[0] ? plus[index].style.display = 'block' : circle[index].style.display = 'block';
             game.choice--; break;
        default: 
             h2.innerText = 'Choose other square';
             break;
    }
    roundWinner(plus, circle, game.players);
    return;
}

function roundWinner (plus, circle, players) {
    let winningCond = [
        [0,1,2],
        [0,3,6],
        [2,5,8],
        [6,7,8],
        [3,4,5],
        [1,4,7],
        [6,4,2],
        [0,4,8],
    ], oArr = returnIndex(circle)
    , xArr = returnIndex(plus);

    function returnIndex (elem) {
        return [...elem].map((x, index) => x.style.display !== '' ? index:undefined).filter(x => x !== undefined)
    };

    function check (players, element) {
        for(const key in players) {
            if(players[key] == element) {h2.innerText = `${key} are the winner`}
        }
    }

    for(let i = 0; i < winningCond.length; i++) {
        if(winningCond[i].every(element => oArr.includes(element))) {
            check(players, circle[0]); break;
    }
        if(winningCond[i].every(element => xArr.includes(element))) {
            check(players, plus[0]); break;
        }
    }

    if(![...plus].some(element => element.style.display == '' || 
        ![...circle].some(element => element.style.display == ''))) {
        h2.innerText = "It's a tie";
    }
}

function clear(circle, plus) {
    plus.forEach(plusEm => {
        plusEm.style.display = '';
    })
    circle.forEach(circleEm => {
        circleEm.style.display = '';
    })
}

/* 
** TIC-TAC-TOE CONSOLE VERSION **
--------------------------------------
const gameFactory = function () {
    const players = (function () {
            let arr = ['O', 'X'],
                playerOne, playerTwo;
        
            playerOne = arr[Math.floor(Math.random()*2)];
            if(playerOne=='X') playerTwo = 'O';
            else playerTwo='X';
        
            return {playerOne, playerTwo}
        })();
    let board = ['', '', '',
                    '', '', '',
                    '', '', ''];
          boardGame = board,
          choice = 0, score = {playerOne: 0, playerTwo: 0};
          console.log(boardGame);
    return {choice, score, boardGame, players}
    }

    let game = gameFactory();

    function playRound (playerIndex) {
        switch(true) {
            case game.choice == 0 && game.boardGame[playerIndex] == '':
                game.boardGame[playerIndex] = game.players.playerOne;
                game.choice++; break;
            case game.choice == 1 && game.boardGame[playerIndex] == '':
                game.boardGame[playerIndex] = game.players.playerTwo;
                game.choice--; break;
            default: 
                console.log('Choose other square');
                break;
        }
        console.log(game.boardGame);
        roundWinner(game.boardGame, game.players, game.score);
    }
    
    function roundWinner (boardGame, players, score) {
        let winningCond = [
            [0,1,2],
            [0,3,6],
            [2,5,6],
            [6,7,8],
            [3,4,5],
            [1,4,7],
            [6,4,2],
            [0,4,8],
        ], oArr = returnIndex('O')
        , xArr = returnIndex('X');

        function returnIndex (str) {
            return boardGame.map((x, index) => x == str?index:undefined).filter(x => x !== undefined)
        };

        function check (players, string, score) {
            for(const key in players) {
                if(players[key] == string) {score[key]++; console.log(`${key} are the winner`)}
            }
        }

        for(let i = 0; i < winningCond.length; i++) {
            if(winningCond[i].every(element => oArr.includes(element))) {
                check(players, 'O', score); break;
        }
            if(winningCond[i].every(element => xArr.includes(element))) {
                check(players, 'X', score); break;
            }
        }

        if(!boardGame.some(element => element == '')) {
            console.log("It's a tie");
        }
}
*/
