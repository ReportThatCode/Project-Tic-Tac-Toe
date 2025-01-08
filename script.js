

const gameBoard = (function(){
 
    let isPlaying = false;
    let mode = 1;
    const table = [
        "null","null","null",
        "null","null","null",
        "null","null","null"
    ];

    startGame = ()=>{
        gameBoard.isPlaying = true;
        displayController.movePlayer();
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
        stopGame,
        isPlaying,
        mode

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
        return playersTurn[turn];
    }

    const finishTurn = ()=>{
        turn = (turn + 1) % playersTurn.length;
    }

    const markIndex = (index,mark) => {
        gameBoard.table[index] = mark
    }

    const getIndex = (mark)=>{
        let index;
        if(mark === "o" && gameBoard.mode === 1){
              index = numberAleatorio();
              console.log("Esta jugando IA");
              return index
        } 
        else {
            index = prompIndex(`Turno de ${mark}, Elija una casilla`);
            return index
        }
    }

    const prompIndex = (prompText = "elija una casilla") => {
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
        if(!indexIsDisabled(index)){
            return numberAleatorio()
        }
        return index;
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
        numberAleatorio,
        getIndex
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
                if (gameBoard.isPlaying === false) return
                // hacer una funcion que devuelta el index segun si es bot o player
                   let index = displayController.getIndex(mark)

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

const playerX = player("Player1","x");
const playerO = player("Player2","o");
