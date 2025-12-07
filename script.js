

//global vairables and constants
const SVG_NS = "http://www.w3.org/2000/svg";
const svgContainer = document.getElementById("hangman");
const gameStatusMessage = document.getElementById("message-element");
const remainingAttemptsElem = document.querySelector(".remainingAttempts-number");

const gameStatus={
    remainingAttempts: 6,
    currentWordCategory: "",
    currentWord: "",
    clickedLetters: [],
    currentClickedLetter: "",
    currentClickedLetterIsCorrect: false,
    currentLetterOccupiesMultiplePositions: false,
    gameOver: false,
    gameWon: false,
    readyForNextWord: true,
    currentMessage: "",
    figurePartsDrawn: 0,

};

// Word Category Selection
const wordCategoryButtons=document.querySelectorAll(".category-card");

function updateWordCategory(buttons){
    buttons.forEach(button=>{
        if(!button.classList.contains("selected")){
            button.classList.add("inactive");
        }
    }); 
     
}

const wordCategories={
    animals: ['TIGER', 'ELEPHANT', 'GIRAFFE', 'CHIMPANZEE', 'RHINOCEROS', 
        'ZEBRA', 'PENGUIN', 'DOLPHIN', 'KANGAROO', 'SQUIRREL'],
    fruits:[ 'APPLE', 'BANANA', 'ORANGE', 'GRAPEFRUIT', 'PINEAPPLE',
         'WATERMELON', 'MANGO', 'STRAWBERRY', 'KIWI', 'BLUEBERRY'],
    countries: ['CANADA', 'BRAZIL', 'GERMANY', 'AUSTRALIA', 'JAPAN',
         'EGYPT', 'MEXICO', 'ITALY', 'INDIA', 'RUSSIA'],
    movies: ['TITANIC', 'INCEPTION', 'AVATAR', 'PARASITE', 'JAWS', 
        'GLADIATOR', 'PULP FICTION', 'INTERSTELLAR', 'FROZEN', 'MEMENTO'],
}

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
        this.gameStatus = gameStatus;
    }

    displayMessage(message){
        this.messageElem.textContent = message;
        this.animateMessage();
    }

    startGameMessage(){
        this.messageElem.textContent = "Select Word Category To Start Playing";
        this.animateMessage();
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

   
    resetGame() {
        // Restore all properties of gameStatus to their default values
        this.gameStatus.remainingAttempts = 6;
        this.gameStatus.currentWordCategory = "";
        this.gameStatus.currentWord = "";
        this.gameStatus.clickedLetters = [];
        this.gameStatus.currentClickedLetter = "";
        this.gameStatus.currentClickedLetterIsCorrect = false;
        this.gameStatus.currentLetterOccupiesMultiplePositions = false; 
        this.gameStatus.gameOver = false;
        this.gameStatus.gameWon = false; 
        this.gameStatus.readyForNextWord = true;
        this.gameStatus.currentMessage = ""; 
        this.gameStatus.figurePartsDrawn = 0; 

        this.hangmanFigure.resetFigure();
        this.gameMessageController.startGameMessage();
        this. resetCategorySelection();
        this.restoreDefaults();
}
    startGame(){
        this.gameMessageController.startGameMessage();
        this.loadNextWord();
    }
    displayDefaultWord(){

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
        if(string==="letter"){
            dash.classList.add("letter");
        }
        if(string==="space"){
            dash.classList.add("spacer");
        }
        parentElem.appendChild(dash);
        console.log("dashes generated");
    }     
    determineNextWord(array){
        let nextWord;
        if(this.gameStatus.currentWord===""){
                    nextWord=wordArray[0]
        }
        if(!this.gameStatus.currentWord===""){
            for(i=0; i=wordArray.length-1; i++){
                 if(wordArray[i]===this.gameStatus.currentWord && i<array.length-1){
                     nextWord=wordArray[i+1];
                }
                 if(wordArray[i]===this.gameStatus.currentWord && i===array.length-1){
                     nextWord=wordArray[0];//logic to be improved 
                }                
            }
        }
        return nextWord;
    }
    displayPlaceholderDashes(string){
        console.log(string)
        this.removeAllDashes();
       let sentence= string.split(" ");
       console.log(`words:${sentence}`)
       if(sentence.length>1){
            for(i=0; i<sentence.length; i++){//letters
                    let wordOfSentence=sentence[i];
                    let dashes=wordOfSentence.split("");

                    dashes.forEach(dash=>{
                        this.createDash("letter");
                        console.log("letter dash created")
                    });

                    if( i!==sentence.length-1){//spaces
                        this.createDash("space");
                        console.log("space dash created")
                    }
            }
   
       }else{
            let letters=string.split("");
            console.log(`single word:${letters}`,letters);
            for(let i=0; i<letters.length; i++){//letters
                this.createDash("letter");
                console.log("letter dash created")  ;              
            };
        }
    }
    loadNextWord(){
        const wordCategory=this.gameStatus.currentWordCategory;
        let wordArray;
        let nextWord;
        switch (wordCategory){
            case "fruits":
                wordArray=this.words.fruits;
                nextWord=determineNextWord(wordArray);
            break;
             case "animals":
                wordArray=this.words.animals;
                nextWord=determineNextWord(wordArray);                
                
            break;
             case "movies":
                wordArray=this.words.movies;
                nextWord=determineNextWord(wordArray);                
                
            break;
            case "countries":
                wordArray=this.words.countries;
                nextWord=determineNextWord(wordArray);                
                
            break;    
            default:
                nextWord="HANGMAN"
            break;                              
        }
        this.gameStatus.currentWord=nextWord;
        this.displayPlaceholderDashes(this.gameStatus.currentWord);

    }

    checkIfLetterOccupiesMultiplePositions(){

    }
    endGame(){

    }
    acceptLetter(){

    }

    drawNextFigurePart(){

    }

    updateRemainingAttempts(){

    }

    rejectLetter(){

    }

    fillWord(){

    }
    
    updateRemainingAttempts(){

    }
}

//-------ui --------//

const figure = new HangmanFigure(svgContainer,SVG_NS);
const messageController=new GameMessage(gameStatusMessage);
const game=new Game(gameStatus,messageController,figure,wordCategories);

wordCategoryButtons.forEach(button=>{
    button.addEventListener("click",()=>{
       // if(button.classList.contains("inactive") ||)return;
        if(button.classList.contains("selected"))return;
        if(button.classList.contains("inactive") && !game.gameStatus.currentWordCategory==="" && gameStatus.readyForNextWord=== true) return;
 
        if(!button.classList.contains("selected") && !button.classList.contains("inactive")
            && game.gameStatus.currentWordCategory==="" && gameStatus.readyForNextWord=== true){
                    button.classList.add("selected");
                    gameStatus.currentWordCategory=button.dataset.category;
                    updateWordCategory(wordCategoryButtons);
        }else{
            gameStatus.currentWordCategory="default"; 
        }
        });
    
});

game.startGame();

