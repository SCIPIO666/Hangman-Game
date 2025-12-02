const svgParent=document.querySelector("svg"); // Assumes an <svg> element exists in the HTML
const svgNamespace = "http://www.w3.org/2000/svg";

 

class HangmanFigure{
    constructor(parentElem, nameSpace){
        this.parentElem = parentElem;
        this.nameSpace = nameSpace;
    }
    drawLine(x1, y1, x2, y2) {
            // Coordinates <line x1="140" y1="80" x2="140" y2="100"/>
        let line = document.createElementNS(this.nameSpace, "line");
        const attributes = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
        }
        this.attributeFunction(line, attributes);
        this.parentElem.appendChild(line);
    }
        
    setAttributes(elem, object){
            for (key in object){
                elem.setAttribute(key, object[key]);
            }
            elem.setAttribute("stroke-width", "2");
            elem.setAttribute("stroke", "black");
        
    }

        
    drawNeck(){
        let line = document.createElementNS(this.nameSpace, "line");
        const attributes = {
            x1: 140,
            y1: 80,
            x2: 140,
            y2: 100,
        }
        this.attributeFunction(line, attributes);
        this.parentElem.appendChild(line);
    }
    
    // Coordinates based on <circle cx="140" cy="60" r="20"/> (Fixed y-coordinate from 600 to 60)
    drawHead(){
        let circle = document.createElementNS(this.nameSpace, "circle");
        const attributes = {
            cx: 140,
            cy: 60,
            r: 20,
            fill: "white",
        }
        this.setAttributes(circle,attributes);
        this.parentElem.appendChild(circle);
    }

    drawTorso(){
        // Top line
        this.drawLine(120, 100, 160, 100);
        // Left vertical line
        this.drawLine(120, 100, 120, 150);
        // Right vertical line
        this.drawLine(160, 100, 160, 150);
        // Bottom line
        this.drawLine(120, 150, 160, 150);
    }
    
    drawRightHand(){
        // Main Arm Line
        this.drawLine(160, 100, 180, 130);
        // Hand/Fingers
        this.drawLine(160, 110, 170, 120);
        this.drawLine(180, 130, 170, 120);
    }
    
    drawLeftHand(){
        // Main Arm Line
        this.drawLine(120, 100, 100, 130);
        // Hand/Fingers
        this.drawLine(120, 110, 110, 120);
        this.drawLine(100, 130, 110, 120);
    }
    

    drawRightLeg(){
        this.drawLine(150, 150, 150, 220);
    } 
    
    drawLeftLeg(){
        this.drawLine(130, 150, 130, 220);
    }
}
let hangman=new HangmanFigure(svgParent,svgNamespace);
hangman. drawTorso();