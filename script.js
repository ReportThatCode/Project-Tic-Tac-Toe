

const gameBoard = (function(){
 
    let isPlaying = false;
    let mode = 1;
    const table = [
        "null","x","null",
        "null","null","null",
        "null","null","null"
    ];

    startGame = ()=>{
        displayController.movePlayer();
        gameBoard.isPlaying = true;
    }
    resetGame = ()=>{
        console.log("reiniciando el juego")
    }

    stopGame = () => {
        isPlaying = false
    }
    return {
        table,
        startGame,
        reset: resetGame,
        stopGame

    }
})();


const displayController = (function(){

    let playersTurn = ["PlayerX","PlayerO"];
    let turn = 0;
    const combinacionesGanadoras = [
        [0, 1, 2], // Fila superior
        [3, 4, 5], // Fila central
        [6, 7, 8], // Fila inferior
        [0, 3, 6], // Columna izquierda
        [1, 4, 7], // Columna central
        [2, 5, 8], // Columna derecha
        [0, 4, 8], // Diagonal principal
        [2, 4, 6], // Diagonal inversa
      ];

      
    const showWinner = (mark)=>{
        resetGame();
        gameBoard.isPlaying = false
        alert("EL GANADOR ES "+ mark)
    }
    const isWinner = (mark)=>{   
       combinacionesGanadoras.forEach(table => {
            if(gameBoard.table[table[0]] === mark && gameBoard.table[table[1]] === mark && gameBoard.table[table[2]] === mark ){
                return showWinner(mark)
            }
        })
    }

    const showTable = ()=>{
        console.log(gameBoard.table[0],gameBoard.table[1],gameBoard.table[2])
        console.log(gameBoard.table[3],gameBoard.table[4],gameBoard.table[5])
        console.log(gameBoard.table[6],gameBoard.table[7],gameBoard.table[8])
    }

    const getTurn = ()=>{
        console.log("le toca a => "+ playersTurn[turn])
        return playersTurn[turn];
    }

    const finishTurn = ()=>{
        turn = (turn + 1) % playersTurn.length;
        console.log(turn)
    }

     
    const markIndex = (index,mark) => {
        gameBoard.table[index] = mark
    }


    const prompIndex = (prompText = "elija un numero del 1 al 9") => {
        let index = prompt(prompText)
        isAvialable = displayController.indexIsDisabled(index);
        if(!isAvialable){
            return prompIndex("Indice no disponible, ingrese otro numero")
        }
        else {
            return index
        }

    }

    const numberAleatorio = ()=> {
        let index = Math.floor(Math.random() * 9);
        return index;
    }

    const check__IA__index = ()=>{

    }

    const indexIsDisabled = (index)=>{
        if(gameBoard.table[index] !== "null"){
            return false    
        }
        return true
    }

    const movePlayer = ()=>{
        const move = getTurn();
        if(move === "PlayerX"){
            playerX.moveTable();
        }
        else if(move === "PlayerO") {
            playerO.moveTable();
        }

    }
    return {
        isWinner,
        markIndex,
        indexIsDisabled,
        showTable,
        getTurn,
        finishTurn,
        movePlayer,
        prompIndex,
        numberAleatorio
    }

}())


const player = (player,mark)=>{
    
    let name = player;

        return {

            setName(newName){
                name = newName
            },
            getName(){
                console.log(name)
            },

            moveTable(){
                let index;
            
                if (gameBoard.isPlaying === false) return
                    
                else if(gameBoard.mode = 1 && mark === "o"){
                    index = numberAleatorio();
                    isAvialable = displayController.indexIsDisabled(index)

                    

                } else {
                    index = displayController.prompIndex(`Turno de ${mark}, elija un numero entre 1 al 9`);    
                    displayController.markIndex(index,mark);
                    console.log(displayController.showTable())
                    const isWinner = displayController.isWinner(mark)

                    if(isWinner === true) {
                        return console.log("TENEMOS GANADOR ESS =>" + mark)
                    } else {
                        displayController.finishTurn();
                        displayController.movePlayer();
                    }
                }
            }
        }

}

const playerX = player("Player1","x");
const playerO = player("Player2","o");






//console.log(gameBoard)
//playerX.moveTable() 
//playerO.moveTable()