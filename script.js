
const SVG_NS = "http://www.w3.org/2000/svg";
const svgContainer = document.getElementById("hangman");

const gameStatusMessage = document.getElementById("message");
const remainingAttemptsElem = document.querySelector(".remainingAttempts-number");
const gameStatus={
    currentWordCategory: "",
    remainingAttempts: 6,
    clickedLetters: [],
    currentClickedLetter: "",
    currentWord: "",
    currentClickedLetterIsCorrect: false,
    gameOver: false,
    currentMeassage: "Type the word",
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
        
    setAttributes(elem, attriburesObject){
        for (let attribute in attriburesObject){
            elem.setAttribute(attribute, attriburesObject[attribute]);
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
}
class gameMessage{
    constructor(messageElem, attemptsElem, gameStatus){
        this.messageElem = messageElem;
        this.attemptsElem = attemptsElem;
        this.gameStatus = gameStatus;
    }
}
class game{
    constructor(gameStatus, gameMessage, hangmanFigure){
        this.gameStatus = gameStatus;
        this.gameMessage = gameMessage;
        this.hangmanFigure = hangmanFigure;
    }
}
const figure = new HangmanFigure(svgContainer,SVG_NS);

figure.drawCompleteFigure();


