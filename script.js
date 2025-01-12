modal = document.querySelector(".modal");
modal.showModal()

// Módulo para manejar el tablero del juego
const Gameboard = (() => {
    const table = Array(9).fill(null);
    const reset = () => {
        table.fill(null);
        DisplayController.updateBoard();
        DisplayController.clearCell();
    };

    const setMark = (index, mark) => {
        if (table[index] === null) {
            table[index] = mark;
            return true;
        }
        return false;
    };
    
    const getMark = (index) => table[index];

    const getBoard = () => [...table];

    return { reset, setMark, getMark, getBoard };
})();

// Factory para crear jugadores
const Player = (name, mark) => {
    let score = 0;

    const getName = () => name;
    const getMark = () => mark;
    const addScore = () => { score += 1; };
    const getScore = () => score;

    return { getName, getMark, addScore, getScore };
};

// Módulo para manejar el flujo del juego
const GameController = (() => {
    
    // [Player("Player 1", "X"), Player("Player 2", "O")];
    let players = []
    let currentPlayerIndex = 0;
    let isPlaying = false;
    let mode = "player";
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const whoStart =()=>{
       const is = players[0].getMark();
       if(is !== "X"){
        currentPlayerIndex = 1;
        return true;
       }
    }

    const setMode = (input)=> mode = input
    const getMode = ()=> mode
    const setPlayers = (playerOne,playerTwo)=> players = [Player(playerOne[1],playerOne[0]),Player(playerTwo[1],playerTwo[0])];
    
    const getPlayers = ()=> [players[0].getScore(),players[1].getScore()];

    const currentTurn = () => players[currentPlayerIndex];
    
    const startGame = () => {
        isPlaying = true;
        Gameboard.reset();
        currentPlayerIndex = 0;
        whoStart();
        if(isTurnBot()) moveBot(); 
        DisplayController.updateBoard();
        DisplayController.showMessage(`${players[currentPlayerIndex].getName()}'s turn!`);
        DisplayController.startBtn();
    };

    const isTurnBot = ()=> getMode() === "bot" && players[1] === currentTurn() ? true : false;

    const moveBot = ()=>{
        const index = indexBot();  
        if (checkWinner(players[currentPlayerIndex].getMark())) {
            isPlaying = false;
            players[currentPlayerIndex].addScore();
            DisplayController.showMessage(`${players[currentPlayerIndex].getName()} wins!`);
            DisplayController.updateScores();
            DisplayController.updateBoard();
            DisplayController.endBtn();
            return;
        }
        
        if (Gameboard.getBoard().every(cell => cell !== null)) {
            isPlaying = false;
            DisplayController.showMessage("It's a tie!");
            DisplayController.updateBoard();
            DisplayController.endBtn();
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        DisplayController.showMessage(`${players[currentPlayerIndex].getName()}'s turn!`);
        DisplayController.updateBoard();
    }

    const indexBot = ()=>{
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 9);

        } while (!Gameboard.setMark(randomNumber,players[1].getMark()))
            return randomNumber
        }

    const playTurn = (index) => {
        if (!isPlaying || !Gameboard.setMark(index, players[currentPlayerIndex].getMark())) return
        if (checkWinner(players[currentPlayerIndex].getMark())) {
            isPlaying = false;
            players[currentPlayerIndex].addScore();
            DisplayController.showMessage(`${players[currentPlayerIndex].getName()} wins!`);
            DisplayController.updateScores();
            DisplayController.updateBoard();
            DisplayController.endBtn();
            return;
        }
        
        if (Gameboard.getBoard().every(cell => cell !== null)) {
            isPlaying = false;
            DisplayController.showMessage("It's a tie!");
            DisplayController.updateBoard();
            DisplayController.endBtn();
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        DisplayController.showMessage(`${players[currentPlayerIndex].getName()}'s turn!`);
        DisplayController.updateBoard();
        if(isTurnBot()) moveBot(); 
    };

    const checkWinner = (mark) => {
        return winningCombinations.some(combination =>
            combination.every(index => Gameboard.getMark(index) === mark)
        );
    };

    return { startGame, playTurn, currentTurn, getPlayers, setPlayers, setMode};
})();

// Módulo para manejar la lógica del DOM
const DisplayController = (() => {
    const cells = document.querySelectorAll(".index");
    const messageElement = document.querySelector(".comments");
    const scores = {
        X: document.querySelector(".score-spanX"),
        O: document.querySelector(".score-spanO")
    };

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            GameController.playTurn(index);
        });
    });

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            if(board[index] === "X"){ paintCell(cell.dataset.index,"x") }
            if(board[index] === "O"){ paintCell(cell.dataset.index,"o") }
        });
    };

    const paintCell = (index, mark)=>{
        document.querySelector(`.index${index} img`).classList.add("checked");
        document.querySelector(`.index${index} img`).src = `${mark.toLowerCase()}.png`
    }
    const clearCell = ()=>{
        cells.forEach(cell => {
            cell.querySelector("img").src = "";
            cell.querySelector("img").classList.remove("checked")
        })
    }
    const showMessage = (message) =>  messageElement.textContent = message;

    const updateScores = () => {
        const players = GameController.getPlayers();
        scores.X.textContent = players[0];
        scores.O.textContent = players[1];
    };

    const startBtn = ()=> document.querySelector("#startGame").classList.add("active");
    const endBtn = ()=> document.querySelector("#startGame").classList.remove("active")  
    
    return { updateBoard, showMessage, updateScores , clearCell, startBtn, endBtn};
})();


const modalForm = (()=>{

    const getDataForm = (container,input)=>{
        const player = document.querySelectorAll(`${container} .inputMark`)
        const checkPlayer = [...player].filter(el => el.checked);
        return  [checkPlayer[0].value.slice(-1), document.querySelector(input).value]
    }

    const dataForm = (playerOne,playerTwo)=> GameController.setPlayers(playerOne,playerTwo)

    const updateDOM = (playerOne, playerTwo, mode)=>{
        //PLAYER ONE
        document.querySelector("#player1").value = playerOne[1];
        document.querySelector(".player1-img-mark").src = `${playerOne[0].toLowerCase()}.png`

         //PLAYER TWO
         document.querySelector("#player2").value = playerTwo[1];
         document.querySelector(".player2-img-mark").src = `${playerTwo[0].toLowerCase()}.png`
    
         //Clear mode btn active
         document.querySelectorAll(".mode").forEach(el => el.classList.remove("active"))
         if(mode === "player") document.querySelector(".mode-player").classList.add("active")
         if(mode === "bot") document.querySelector(".mode-bot").classList.add("active")   
     
        }

    const changeMark = (target)=>{
        // PLAYER1 => X || PLAYER2 => 0
        if(target.id === "player1-x") document.querySelector("#player2-o").checked = true
        // PLAYER1 => O || PLAYER2 => X
        if(target.id === "player1-o") document.querySelector("#player2-x").checked = true
        // PLAYER2 => X || PLAYER1 => 0
        if(target.id === "player2-x") document.querySelector("#player1-o").checked = true
        // PLAYER2 => O || PLAYER2 => X
        if(target.id === "player2-o") document.querySelector("#player1-x").checked = true
    }
    return { changeMark, dataForm, updateDOM, getDataForm}

})();

// Inicializar el juego
document.querySelector("#startGame").addEventListener("click", () => {GameController.startGame()});

document.querySelector("#reset").addEventListener("click", () => {modal.showModal()});

document.addEventListener("change",(e)=>{
    if(e.target.matches(".inputMark")) modalForm.changeMark(e.target);

    if(e.target.matches(".mode-input")){
        if(e.target.id === "player") {return document.querySelector(".player-two-input").value = "Player Two"}
        if(e.target.id === "bot") {return document.querySelector(".player-two-input").value = "Bot"}
    }
})

document.addEventListener("submit",(e)=>{
    e.preventDefault()

    const modeGame = [...document.querySelectorAll(".mode-input")].filter(el => el.checked);
    const playerOne = modalForm.getDataForm(".container-playerOne",".player-one-input");
    const playerTwo = modalForm.getDataForm(".container-playerTwo",".player-two-input"); 

    modalForm.updateDOM(playerOne,playerTwo,modeGame[0].value);
    modalForm.dataForm(playerOne,playerTwo)

    GameController.setMode(modeGame[0].value)
    
    modal.close();
    GameController.startGame();
    DisplayController.startBtn();

})
