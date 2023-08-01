const squares = document.querySelectorAll('.container>div'),
      gameBoard = document.querySelector('.container'),
      circle = document.querySelectorAll('.circle'),
      plus = document.querySelectorAll('.plus'),
      bot = document.querySelector('.bot'),
      twoPlayers = document.querySelector('.twoPlayers'),
      h2 = document.querySelector('main > h2'),
      plusHover = document.querySelector('.plusC'),
      circleHover = document.querySelector('.circleC'),
      creationDiv = document.querySelector('.creation');

let controller, game;
    
twoPlayers.addEventListener('click', () => {
    controller = new AbortController();
    const signal = controller.signal;
    clear(circle, plus);
    game = gameFactory();
    h2.textContent = 'Two players mode';

    function hover (index, element) {
        squares[index].appendChild(element);
        element.style.display = 'block';
        element.style.opacity = 0.6;
    }

    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            playRound(game, index);
        }, { signal });
        square.addEventListener('mouseenter', () => {
            switch(true) {
                case game.choice == 0 && check(index) && game.players.playerOne == plus[0]:
                     hover(index, plusHover);
                     return;
                case game.choice == 1 && check(index) && game.players.playerTwo == plus[0]:
                     hover(index, plusHover);
                     return;
                default: 
                     if(check(index)) hover(index, circleHover);
                     return;
            }
        }, { signal });
        square.addEventListener('mouseleave', () => {
            if(squares[index].contains(plusHover)) 
                {creationDiv.appendChild(plusHover);}
            if(squares[index].contains(circleHover))
                {creationDiv.appendChild(circleHover);}
        });
    })
});

const gameFactory = function () {
    const players = (function () {
            let arr = [circle, plus],
                playerOne, playerTwo;
        
            playerOne = arr[Math.floor(Math.random()*2)];
            if(playerOne == plus) {playerOne = plus[0]; playerTwo = circle[0];}
            else {playerOne = circle[0]; playerTwo = plus[0];}
        
            return {playerOne, playerTwo}
        })();

        let choice = 0;

    return {choice, players}
    }

function playRound (game, index) {
    if (squares[index].contains(plusHover)) 
        {creationDiv.appendChild(plusHover)};
    if (squares[index].contains(circleHover)) 
        {creationDiv.appendChild(circleHover)};

    switch(true) {
        case game.choice == 0 && check(index):
             game.players.playerOne == plus[0] ? plus[index].style.display = 'block' : circle[index].style.display = 'block';
             game.choice++; h2.textContent = 'Two players mode'; break;
        case game.choice == 1 && check(index):
            game.players.playerTwo == plus[0] ? plus[index].style.display = 'block' : circle[index].style.display = 'block';
             game.choice--; h2.textContent = 'Two players mode'; break;
        default: 
            h2.textContent = 'Choose other square';
             break;
    }

    roundWinner(plus, circle, game.players);
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

    function declareWinner (players, element) {
        for(const key in players) {
            if(players[key] == element) {h2.textContent = `${key} are the winner`}
        }
    };

    function winner (array, arr2) {
        return arr2.every(element => array.includes(element))
    }

    for(let i = 0; i < winningCond.length; i++) {
        if(winner(oArr, winningCond[i])) {
            declareWinner(players, circle[0]); controller.abort(); return;
    }
        if(winner(xArr, winningCond[i])) {
            declareWinner(players, plus[0]); controller.abort(); return;
        }
    }

    if(oArr.length + xArr.length == 9) {
        h2.textContent = "It's a tie";
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

function check (index) {
    return plus[index].style.display == '' && circle[index].style.display == ''
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

        function declareWinner (players, string, score) {
            for(const key in players) {
                if(players[key] == string) {score[key]++; console.log(`${key} are the winner`)}
            }
        }

        for(let i = 0; i < winningCond.length; i++) {
            if(winningCond[i].every(element => oArr.includes(element))) {
                declareWinner(players, 'O', score); break;
        }
            if(winningCond[i].every(element => xArr.includes(element))) {
                declareWinner(players, 'X', score); break;
            }
        }

        if(!boardGame.some(element => element == '')) {
            console.log("It's a tie");
        }
}
*/
