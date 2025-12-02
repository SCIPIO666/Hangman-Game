const svgParent=document.querySelector("svg");
const svgNamespace = "http://www.w3.org/2000/svg";

function setAttributes(elem,object){
    for (key in object){
        elem.setAttribute(key,object.key);
    }
    elem.setAttribute("stroke-width","3")

}

class HangmanFigure{
    constructor(parentElem,nameSpace,attributeFunction){
        this.parentElem=parentElem;
        this.nameSpace=nameSpace;
        this.attributeFunction=attributeFunction;
    }

    drawHead(){
        let circle =document.createElementNS(this.nameSpace, "circle");
        const attributes={
            cx: 140,
            cy: 600,
            r: 20,
            stroke: "black",
            fill: "white",
        }
        this.attributeFunction(circle,attributes);
        this.parentElem.appendChild(circle);
    }

    drawTorso(){

    }

    drawRightHand(){

    }
    drawLeftHand(){
        
    }
     drawRightLeg(){
        
    }   

    drawLeftLeg(){
        
    }
}