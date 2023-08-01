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

bot.addEventListener('click', () => {
    controller = new AbortController();
    const signal = controller.signal;
    clear(circle, plus);
    game = gameFactory();
    h2.textContent = 'Player vs AI';

    function hover (index, element) {
        squares[index].appendChild(element);
        element.style.display = 'block';
        element.style.opacity = 0.6;
    }
    //Choice == 1 will be AI
    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            playRoundBot(game, index);
        }, { signal });
        square.addEventListener('mouseenter', () => {
            switch(true) {
                case game.choice == 0 && check(index) && game.players.playerOne == plus[0]:
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
})

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

    function elementChoice (player) {
        game.players[player] == plus[0] ? 
        plus[index].style.display = 'block' : 
        circle[index].style.display = 'block';
    }

    switch(true) {
        case game.choice == 0 && check(index):
             elementChoice('playerOne');
             game.choice++; h2.textContent = 'Player vs AI'; break;
        case game.choice == 1 && check(index):
             elementChoice('playerTwo');
             game.choice--; h2.textContent = 'Player vs AI'; break;
        default: 
            h2.textContent = 'Choose other square';
             break;
    }

    roundWinner(plus, circle, game.players);
}

function playRoundBot (game, index) {
    if (squares[index].contains(plusHover)) 
        {creationDiv.appendChild(plusHover)};
    if (squares[index].contains(circleHover)) 
        {creationDiv.appendChild(circleHover)};

    function elementChoice (player, index) {
        game.players[player] == plus[0] ? 
        plus[index].style.display = 'block' : 
        circle[index].style.display = 'block';
    }

    function botChoice() {
        let playerOne = (function () {
            return game.players['playerOne'] == plus[0] ?
            'X' : 'O'
        })(),
            bot = (function () {
            return game.players['playerTwo'] == plus[0] ?
            'X' : 'O'
        })(), 
            circleN = document.querySelectorAll('.circle'),
            plusN = document.querySelectorAll('.plus'),
            oArr = returnIndex(circleN),
            xArr = returnIndex(plusN),
            board = newBoard(oArr, xArr),
            bestSpot = minimax(board, bot).index;

        function minimax(newBoard, player){
                let availSpots = emptyIndexies(newBoard);
              
                if (winning(newBoard, playerOne)){
                   return {score:-10};
                }
                  else if (winning(newBoard, bot)){
                  return {score:10};
                  }
                else if (availSpots.length === 0){
                    return {score:0};
                }
              
                let moves = [];
              
                for (let i = 0; i < availSpots.length; i++){

                  let move = {};
                    move.index = newBoard[availSpots[i]];
              
                  newBoard[availSpots[i]] = player;
              
                  if (player == bot){
                    let result = minimax(newBoard, playerOne);
                    move.score = result.score;
                  }
                  else{
                    let result = minimax(newBoard, bot);
                    move.score = result.score;
                  }
              
                  newBoard[availSpots[i]] = move.index;
              
                  moves.push(move);
                }
              
                let bestMove;
                if(player === bot){
                  let bestScore = -10000;
                  for(let i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                      bestScore = moves[i].score;
                      bestMove = i;
                    }
                  }
                }else{
              
                  let bestScore = 10000;
                  for(let i = 0; i < moves.length; i++){
                    if(moves[i].score < bestScore){
                      bestScore = moves[i].score;
                      bestMove = i;
                    }
                  }
                }
              
                return moves[bestMove];
        }
    
        function returnIndex (elem) {
            return [...elem].map((x, index) => x.style.display !== '' ? index:undefined).filter(x => x !== undefined)
        };
        
        return bot == 'O' ? circle[bestSpot].style.display = 'block' : plus[bestSpot].style.display = 'block'
    }

    switch(true) {
        case game.choice == 0 && check(index):
             elementChoice('playerOne', index);
             game.choice++; h2.textContent = 'Player vs AI'; 
             roundWinner(plus, circle, game.players);
        case game.choice == 1:
             if(h2.textContent == 'playerOne are the winner' || h2.textContent == "It's a tie") return;
             botChoice();
             game.choice--; break;
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

function newBoard (oArr, xArr) {
    let board = ['', '', '', '', '', '', '', '', ''];

    for(let i = 0; i < 9; i++) {
        xArr.includes(i) ? board[i] = 'X': board[i] = i;
        if(oArr.includes(i)) board[i] = 'O';
    }

    return board
}

  function emptyIndexies(board){
    return  board.filter(s => s != "O" && s != "X");
  }
  
  function winning(board, player){
   if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
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