

//global vairables and constants
const SVG_NS = "http://www.w3.org/2000/svg";
const svgContainer = document.getElementById("hangman");
const gameStatusMessage = document.getElementById("message-element");
const remainingAttemptsElem = document.querySelector(".remainingAttempts-number");

const gameStatus={
    remainingAttempts: 6,
    currentWordCategory: "default",
    currentWord: "",
    currentClickedLetter: "",
    gameOver: false,
    gameWon: false,
    currentMessage: "",
    figurePartsDrawn: 0,

};

const wordCategories = {
    animals: [
        'TIGER', 'ELEPHANT', 'GIRAFFE', 'CHIMPANZEE', 'RHINOCEROS',
        'ZEBRA', 'PENGUIN', 'DOLPHIN', 'KANGAROO', 'SQUIRREL',
        'HIPPOPOTAMUS', 'OSTRICH', 'LION', 'CAMEL', 'CROCODILE',
        'WOLF', 'FOX', 'BEAR', 'SEAGULL', 'RACCOON'
    ],
    fruits: [
        'APPLE', 'BANANA', 'ORANGE', 'GRAPEFRUIT', 'PINEAPPLE',
        'WATERMELON', 'MANGO', 'STRAWBERRY', 'KIWI', 'BLUEBERRY',
        'CHERRY', 'PEAR', 'PLUM', 'APRICOT', 'RASPBERRY',
        'LEMON', 'LIME', 'AVOCADO', 'COCONUT', 'GRAPE'
    ],
    countries: [
        'CANADA', 'BRAZIL', 'GERMANY', 'AUSTRALIA', 'JAPAN',
        'EGYPT', 'MEXICO', 'ITALY', 'INDIA', 'RUSSIA',
        'CHINA', 'FRANCE', 'SPAIN', 'NIGERIA', 'KENYA',
        'CHILE', 'PERU', 'SWEDEN', 'GREECE', 'VIETNAM'
    ],
    movies: [
        'TITANIC', 'INCEPTION', 'AVATAR', 'PARASITE', 'JAWS',
        'GLADIATOR', 'PULP FICTION', 'INTERSTELLAR', 'FROZEN', 'MEMENTO',
        'ALIEN', 'PSYCHO', 'MAD MAX', 'ROCKY',
        'CASABLANCA', 'GODFATHER', 'AMELIE', 'MATRIX', 'DUNE'
    ],
    sports: [
        'FOOTBALL', 'BASKETBALL', 'BASEBALL', 'SOCCER', 'TENNIS',
        'VOLLEYBALL', 'SWIMMING', 'CRICKET', 'BOXING', 'GOLF',
        'HOCKEY', 'RUGBY', 'SAILING', 'FENCING', 'CYCLING'
    ]
};

class HangmanFigure{
    constructor(parentElem, nameSpace){
        this.parentElem = parentElem;
        this.nameSpace = nameSpace;
    }
    
    drawLine(x1, y1, x2, y2) {
        let line = document.createElementNS(this.nameSpace, "line");
        const attributes = {
            x1: x1, 
            y1: y1,
            x2: x2,
            y2: y2,
            style: "stroke: black; stroke-width: 2; "
        }
        this.setAttributes(line, attributes);
        this.parentElem.appendChild(line);
    }
        
    setAttributes(elem, attributesObject){
        for (let attribute in attributesObject){
            elem.setAttribute(attribute, attributesObject[attribute]);
        }

    }

    drawNeck(){
        this.drawLine(140, 80, 140, 100);
    }
    
    drawHead(){
        let circle = document.createElementNS(this.nameSpace, "circle");
        const attributes = {
            cx: 140,
            cy: 60,
            r: 20,
            style: "stroke: black; stroke-width: 2; fill: white;"
        }
        this.setAttributes(circle,attributes);
        this.parentElem.appendChild(circle);
    }

    drawTorso(){
        this.drawLine(120, 100, 160, 100);
        this.drawLine(120, 100, 120, 150);
        this.drawLine(160, 100, 160, 150);
        this.drawLine(120, 150, 160, 150);
    }
    
    drawRightHand(){
        this.drawLine(160, 100, 180, 130);
        this.drawLine(160, 110, 170, 120);
        this.drawLine(180, 130, 170, 120);
    }
    
    drawLeftHand(){
        this.drawLine(120, 100, 100, 130);
        this.drawLine(120, 110, 110, 120);
        this.drawLine(100, 130, 110, 120);
    }
    
    drawRightLeg(){
        this.drawLine(150, 150, 150, 220);
    } 
    
    drawLeftLeg(){
        this.drawLine(130, 150, 130, 220);
    }
    drawCompleteFigure(){
        this.drawHead();
        this.drawNeck();
        this.drawTorso();
        this.drawLeftHand();
        this.drawRightHand();
        this.drawLeftLeg();
        this.drawRightLeg();

    }
    resetFigure(){
        const figureParts = this.parentElem.querySelectorAll("line, circle");           
        figureParts.forEach(part => part.remove());
        const hangmanContainer=document.querySelector(".hangman-figure");
        hangmanContainer.innerHTML = ` 
                <line x1="10" y1="20" x2="150" y2="20" style="stroke: black; stroke-width: 4; " />
                <line x1="20" y1="70" x2="60" y2="20" style="stroke: black; stroke-width: 4; " />
                <line x1="140" y1="20" x2="140" y2="40" style="stroke: black; stroke-width: 4; " />
                <line x1="20" y1="20" x2="20" y2="250" style="stroke: black; stroke-width: 5; " />
                <line x1="10" y1="250" x2="140" y2="250" style="stroke: black; stroke-width: 10; "/>`;
    }
}
class GameMessage{
    constructor(messageElem){
        this.messageElem = messageElem;

    }

    displayMessage(message){
        this.messageElem.textContent = message;
        this.animateMessage();
    }

    startGameMessage(){
        this.messageElem.textContent = "Select Word Category To Start Playing";
        this.animateMessage();

    }
    completeTheSecretWordMessage(){
        this.messageElem.classList.add("hide"); 
        this.messageElem.textContent="Complete The Secret Word";
        this.messageElem.classList.add("slide-in-out");

    }
    animateMessage(){
        this.messageElem.classList.remove("hide");
        this.messageElem.classList.remove("slide-in-out");
        this.messageElem.classList.add("slide-in-out");
    }

    endAnimateMessage(){
        this.messageElem.classList.remove("slide-in-out");
        this.messageElem.classList.add("hide"); 
    }
}

class Game{
    constructor(gameStatus, gameMessageController, hangmanFigure,words){//gameStatusObject,GameMessage,hangmanClass,words object
        this.gameStatus = gameStatus;
        this.gameMessageController = gameMessageController;
        this.hangmanFigure = hangmanFigure;
        this.words=words;
    }
    restoreDefaults(){
       const modal=document.querySelector(".notification-modal");
        modal.style.display="none";
        const remainingAttemptsDisplay= document.querySelector(".remainingAttempts-number");
        remainingAttemptsDisplay.textContent= 6;
    }

    resetCategorySelection(){
        const categoryCards = document.querySelectorAll(".category-card");
        categoryCards.forEach(card => {
            if(card.classList.contains("inactive")){
                card.classList.remove("inactive");
            }
            if(card.classList.contains("selected")){
                card.classList.remove("selected");
            }
        });
    }

   
    restartGame() {
        // Restore all properties of gameStatus to their default values
        this.gameStatus.remainingAttempts = 6;
        this.gameStatus.currentWordCategory = "default";
        this.gameStatus.currentWord = "";
        this.gameStatus.gameOver = false;
        this.gameStatus.gameWon = false; 
        this.gameStatus.currentMessage = ""; 
        this.gameStatus.figurePartsDrawn = 0; 
        this.hangmanFigure.resetFigure();
        this.gameMessageController.startGameMessage();
        this. resetCategorySelection();
        this.restoreDefaults();
        this.startGame();
}
    startGame(){
        this.gameMessageController.startGameMessage();
       this.loadNextWord(this.gameStatus.currentWordCategory);
    }
    removeAllDashes(){
        const dashes=document.querySelectorAll(".letter");
        const spaces=document.querySelectorAll(".spacer");

        if(dashes){
            dashes.forEach(dash=>{
                dash.remove();
            });
        }
        if(spaces){
            spaces.forEach(space=>{
                space.remove();
            });
        }
        console.log("dashes removed");
    }
    createDash(string){
        const dash=document.createElement("div");
        const parentElem=document.querySelector(".word");
        const dashes=document.querySelectorAll(".letter");
        const spaces=document.querySelectorAll(".spacer");
        const totalPositionsCreated=dashes.length+spaces.length;
        if(string==="letter"){
            dash.classList.add("letter");
        }
        if(string==="space"){
            dash.classList.add("spacer");
        }
        dash.classList.add("dash");
        dash.dataset.index=totalPositionsCreated;
        parentElem.appendChild(dash);
    }  
     displayPlaceholderDashes(string){
        this.removeAllDashes();
        const word = this.gameStatus.currentWord;
        word.split("").forEach((char, index) => {
        if(char===" "){
            this.createDash("spacer");
        }else{
            this.createDash("letter");
        }
        });

    }   
    determineNextWord(wordArray){
        let nextWord;
        let nextWordIndex;
        if(this.gameStatus.currentWordCategory==="default"){
                    nextWord="HANGMAN";//to be improved
        }
        if(this.gameStatus.currentWordCategory!=="default"){
        nextWordIndex=Math.floor(Math.random() * ((wordArray.length-1) - 0 + 1)) + 0;
           nextWord=wordArray[nextWordIndex];
        }
        return nextWord;
    }

    loadNextWord(wordCategory){//gets next word and calls dash display method
        const nextWord=this.determineNextWord(this.words[this.gameStatus.currentWordCategory]);
        this.gameStatus.currentWord=nextWord;
        this.displayPlaceholderDashes(this.gameStatus.currentWord);

    }
  checkLetterPositions(letter) {
    const word = this.gameStatus.currentWord;
    let letterIndexes = [];
    word.split("").forEach((char, index) => {
        if (letter === char) {
            letterIndexes.push(index); 
        }
    });

    return letterIndexes;
}
    
    checkIfLetterIsCorrect(letter){
        const letterUsage=this.checkLetterPositions(letter);
        if(letterUsage.length>0){
            return true;
        }else{
            return false;
        }
    }
    fillLetterDashes(letter){
            const proceed=this.checkIfLetterIsCorrect(letter);
            if(proceed){
                    const letterUsage=this.checkLetterPositions(letter); 
                    const letterElements=document.querySelectorAll(".letter");
                    letterElements.forEach(letterElem=>{
                            for (let i=0; i<letterUsage.length; i++){
                                if(parseFloat(letterElem.dataset.index)===letterUsage[i]){
                                    letterElem.textContent=letter.toUpperCase();
                                }
                            }
                    });
                }

    }
  
    draw(){
        const figurePartsDrawn=this.gameStatus.figurePartsDrawn;
        switch (figurePartsDrawn){
            case 0:
                this.hangmanFigure.drawHead();
                this.hangmanFigure.drawNeck();
            break;
            case 1:
                this.hangmanFigure.drawTorso();
            break;
            case 2:
                this.hangmanFigure.drawLeftHand();
            break;
            case 3:
                this.hangmanFigure.drawRightHand();
            break;
            case 4:
                this.hangmanFigure.drawRightLeg();
            break;
            case 5:
                this.hangmanFigure.drawLeftLeg();
                this.endGame();
            break;
            default:
                this.hangmanFigure.drawCompleteFigure();

            break;            
        }
        this.gameStatus.figurePartsDrawn= parseFloat(this.gameStatus.figurePartsDrawn)+ 1;
    }
    updateRemainingAttempts(letter){
        if(this.checkIfLetterIsCorrect(letter))return;
        if(this.gameStatus.remainingAttempts>0){
            this.gameStatus.remainingAttempts=parseFloat(this.gameStatus.remainingAttempts)-1;
        }
        const attemptsDisplay=document.querySelector(".remainingAttempts-number");
        attemptsDisplay.textContent=gameStatus.remainingAttempts;
    }

    updateGameStatus(letter){
         if(this.checkIfLetterIsCorrect(letter)){
            this.fillLetterDashes(letter) ;
        }else{
            this.draw();
        }
        this. updateRemainingAttempts(letter);
        this.loadNextRound();
    }
    determineRemainingLetters(){
         const allFilledLetters=document.querySelectorAll(".letter");
         const remainingLetters=[];
         allFilledLetters.forEach(letter=>{
                if(letter.textContent===""){
                    remainingLetters.push(letter.dataset.index);
                }
         });
         return remainingLetters;
    }
    loadNextRound(){
        const remainingAttempts=parseFloat(this.gameStatus.remainingAttempts);
         const remainingLetters=this.determineRemainingLetters();
        if(remainingLetters.length===0){
            this.gameStatus.gameOver=true;
            this.gameStatus.gameWon=true;
            this.endGame();
        }else if(remainingLetters.length>0 && remainingAttempts===0){
            this.gameStatus.gameOver=true;
            this.gameStatus.gameWon=false;
            this.endGame();    
        }else{
            return;
        }
    }

    endGame(){
        const modal=document.querySelector(".notification-modal");
        const message=document.querySelector(".notification-message");
        if(this.gameStatus.gameWon===true){
            message.textContent="YOU WIN";
        }else{
            message.textContent="YOU LOOSE";
        }
        modal.classList.remove("hide");
        modal.classList.add("show");
    }
    resetGame(){
        const remaining=document.querySelector(".remainingAttempts-number")
        remaining.textContent=6;
        this.gameStatus.remainingAttempts = 6;
        this.gameStatus.gameOver = false;
        this.gameStatus.gameWon = false; 
        this.gameStatus.figurePartsDrawn = 0; 
        this.hangmanFigure.resetFigure();
        this.loadNextWord(this.gameStatus.currentWordCategory);

    }
}

//-------ui --------//
// Word Category Selection
const wordCategoryButtons=document.querySelectorAll(".category-card");

function updateWordCategory(buttons,currentButton){
    buttons.forEach(button=>{
             
        if(button.classList.contains(button.dataset.category)){
                button.classList.remove(button.dataset.category);
        }
        button.classList.add("inactive");
        if(button.classList.contains("switch")){
            button.classList.remove("switch");
             button.classList.remove("inactive");                   
        }
        });  
    currentButton.classList.add("selected") ;    
    currentButton.classList.add(currentButton.dataset.category);
     gameStatus.currentWordCategory=currentButton.dataset.category;
    console.log("word category selected") ;
     
}
function switchWordCategories(button){
    button.classList.add("switch");
    wordCategoryButtons.forEach(button=>{
        button.classList.remove("selected");
        button.classList.remove("inactive");
    });
     updateWordCategory(wordCategoryButtons,button);
 
}
const messageElem=document.querySelector("#message-element");
const figure = new HangmanFigure(svgContainer,SVG_NS);
const messageController=new GameMessage(messageElem);
const game=new Game(gameStatus,messageController,figure,wordCategories);

game.startGame();
wordCategoryButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        if(button.classList.contains("selected"))return;

      if(button.classList.contains("inactive")){
            switchWordCategories(button); 
                    game.loadNextWord(gameStatus.currentWordCategory);
       
        }

        if(!button.classList.contains("selected") && !button.classList.contains("inactive")
            && gameStatus.currentWordCategory==="default"){
                    updateWordCategory(wordCategoryButtons,button);   
                    game.loadNextWord(gameStatus.currentWordCategory);

        }
    });
    
});

const keys=document.querySelectorAll(".key");
keys.forEach(key=>{
    key.addEventListener("click",e=>{
        game.updateGameStatus(e.target.textContent);
    });
});

//--------------------modal..........//

const modal=document.querySelector(".notification-modal");
const modalButtons=document.querySelectorAll(".close");
    modalButtons.forEach(button=>{
        button.addEventListener("click",e=>{
            modal.classList.remove("show");
            modal.classList.add("hide"); 
            game.resetGame();
            messageController.completeTheSecretWordMessage();
        });
});

