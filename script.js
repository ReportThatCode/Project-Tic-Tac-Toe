

const gameBoard = (function(){
 
    let isPlaying = false;
    let mode = 2;
    let table = ["null","null","null","null","null","null","null","null","null"];

    const startGame = ()=>{ gameBoard.isPlaying = true; document.querySelector("#startGame").classList.add("active");}
    
    const resetGame = ()=>{
        displayController.resetTurn();
        document.querySelector(".comments").textContent = "Mode game:"
        document.querySelectorAll(".img-index").forEach(el => el.classList.remove("checked"));
        gameBoard.table = ["null","null","null","null","null","null","null","null","null"];
        gameBoard.isPlaying = true;
        document.querySelector("#reset").classList.add("active")
        setTimeout(()=>{
            document.querySelector("#reset").classList.remove("active") 
        },300)}

    const stopGame = () => gameBoard.isPlaying = false
    
    const modeTwoPlayers = () => gameBoard.mode = 2
    
    const modeBot = ()=> gameBoard.mode = 1

    return {
        table,
        startGame,
        reset: resetGame,
        stopGame,
        isPlaying,
        mode,
        modeTwoPlayers,
        modeBot
    }
})();

const displayController = (function(){

    let playersTurn = ["PlayerX","PlayerO"];
    let turn = 0;
    const combinacionesGanadoras = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];
    
    const resetTurn = ()=> displayController.turn = 0

    const showWinner = (mark)=>{
        gameBoard.stopGame();
        document.querySelector(".comments").innerHTML = `El ganador es:  <span class="span-mark">${mark}</span>`;
        displayController.increaseScore(mark)

    }  
    const increaseScore = (mark)=>{
        if(mark === "x"){
            playerX.increanse();
            document.querySelector(".score-spanX").textContent = playerX.getscore();
        }
        else if(mark === "o"){
            playerO.increanse();
            document.querySelector(".score-spanO").textContent = playerO.getscore();
        }
    }
    const isWinner = (mark)=>{   
       let hasWinner = false;
       combinacionesGanadoras.forEach(table => {
            if(gameBoard.table[table[0]] === mark && gameBoard.table[table[1]] === mark && gameBoard.table[table[2]] === mark ){
                return hasWinner = true;
            }})
        return hasWinner
    }

    const showTable = ()=>{
        console.log(gameBoard.table[0],gameBoard.table[1],gameBoard.table[2])
        console.log(gameBoard.table[3],gameBoard.table[4],gameBoard.table[5])
        console.log(gameBoard.table[6],gameBoard.table[7],gameBoard.table[8])
    }

    const getTurn = ()=> playersTurn[turn];

    const finishTurn = ()=> turn = (turn + 1) % playersTurn.length;

    const markIndex = (index,mark) => gameBoard.table[index] = mark

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
        }}

    const indexIsDisabled = (index)=> gameBoard.table[index] !== "null" ? false : true
    
    const numberAleatorio = ()=> {
        let index = Math.floor(Math.random() * 9);
        if(!indexIsDisabled(index)){
            return numberAleatorio()
        }  return index; }


    const movePlayer = ()=>{
        const move = getTurn();
        if(move === "PlayerX"){ playerX.moveTable();}
        else if(move === "PlayerO") { playerO.moveTable();}
    }

    const markDOOM = (index,mark)=> {
        document.querySelector(`.index${index}`).src = `${mark}.png`
        document.querySelector(`.index${index}`).classList.add("checked")
    } 
    const moveBot = ()=>{
    let indexBot = numberAleatorio();
    displayController.markIndex(indexBot,"o");
    displayController.markDOOM(indexBot,"o")
    const isWinner = displayController.isWinner("o")
    displayController.finishTurn();
    if(isWinner === true) return displayController.showWinner("o"); 
    }

    return {
        isWinner,
        markIndex,
        indexIsDisabled,
        showTable,
        getTurn,
        finishTurn,
        movePlayer,
        numberAleatorio,
        getIndex,
        showWinner,
        markDOOM,
        increaseScore,
        moveBot,
        resetTurn
    }

}())


const player = (player,mark)=>{
    let score = 0;
    let name = player;

    const increanse = ()=> score += 1;
    const getscore = ()=> score;
    const setName = (newName)=> name = newName; 
    const getName = ()=> name;
    const moveTable = (index)=>{       

        let indexParse = parseInt(index)

        if (gameBoard.isPlaying === false) return     
        else if (gameBoard.mode === 1){
            console.log("MODO PLAYER VS BOT")
            // move player
            isValidIndex = displayController.indexIsDisabled(indexParse);
            if(isValidIndex){
                console.log("vs ia")
                displayController.markIndex(indexParse,mark);
                displayController.markDOOM(indexParse,mark)
                const isWinner = displayController.isWinner(mark)
                if(isWinner === true) return displayController.showWinner(mark); 
                displayController.finishTurn()
                return displayController.moveBot(indexParse);
            }else {return alert("INDICE YA EN USO, ELIJA OTRO")}     
            }
            else {
                console.log("MODO TWO PLAYERS")
                isValidIndex = displayController.indexIsDisabled(indexParse);
                if(isValidIndex){
                    displayController.markIndex(indexParse,mark);
                    displayController.markDOOM(indexParse,mark)
                    const isWinner = displayController.isWinner(mark)
                    if(isWinner === true) return displayController.showWinner(mark); 
                    return displayController.finishTurn()
                }
                else {return alert("INDICE YA EN USO, ELIJA OTRO")}
            }
        }
        return {increanse,getscore,setName,getName,moveTable}
}

const playerX = player("Player1","x");
const playerO = player("Player2","o");

const doomHandler = (function(){

    const selectMode = (mode)=>{
        if(mode === "TwoPlayers"){
            gameBoard.modeTwoPlayers();
            gameBoard.reset();
        }
        else if(mode === "Bot"){ 
            gameBoard.modeBot()
            gameBoard.reset();
        }
        }


    const botIA = ()=>{ document.getElementById("player2").value = "BOT IA"}
    
    const removeActive = ()=>{ return document.querySelectorAll(".mode").forEach(el => el.classList.remove("active"))}
    
    return { selectMode, removeActive,botIA }
})();


document.addEventListener("click",(e)=>{
    const mode = e.target.closest(".mode")
    const index = e.target.closest(".index")

    if(mode){
        doomHandler.removeActive()
        mode.classList.add("active");
        doomHandler.selectMode(mode.dataset.mode);
    }

    if(index){
        let turn = displayController.getTurn();
        if(turn === "PlayerX"){ playerX.moveTable(index.dataset.index);}
        else if(turn === "PlayerO" && gameBoard.mode === 2){ playerO.moveTable(index.dataset.index);}
    }

    if(e.target.matches("#startGame")){ gameBoard.startGame()}

    if(e.target.closest("#reset")){gameBoard.reset()}
})
