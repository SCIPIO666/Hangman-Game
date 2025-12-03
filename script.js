const svgParent=document.querySelector("#hangman"); // Assumes an <svg id="hangman"> element exists
const svgNamespace = "http://www.w3.org/2000/svg";

class HangmanFigure{
    constructor(parentElem, nameSpace){
        this.parentElem = parentElem;
        this.nameSpace = nameSpace;
    }
    
    drawLine(x1, y1, x2, y2) {
        let line = document.createElementNS(this.nameSpace, "line");
        const attributes = {
            // FIX: Must use standard SVG line attributes: x1, y1, x2, y2
            x1: x1, 
            y1: y1,
            x2: x2,
            y2: y2,
        }
        this.setAttributes(line, attributes);
        this.parentElem.appendChild(line);
    }
        
    setAttributes(elem, object){
        for (key in object){
            elem.setAttribute(key, object[key]);
        }
        // FIX: Set style attributes outside the loop
        elem.setAttribute("stroke-width", "2");
        elem.setAttribute("stroke", "red");
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
            fill: "white",
        }
        this.setAttributes(circle, attributes);
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
}

const figure = new HangmanFigure(svgParent, svgNamespace);

figure.drawHead();
figure.drawNeck();
figure.drawTorso();
figure.drawRightHand();
figure.drawLeftHand();
figure.drawRightLeg();
figure.drawLeftLeg();