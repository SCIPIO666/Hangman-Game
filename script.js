function toggleVisibility(elem){
    elem.style.display==="none" ? elem.style.display==="flex" : elem.style.display==="none";
}

document.addEventListener("DOMContentLoaded",(e)=> {
const menuBtn = document.getElementById("menubutton");
const modalBtn = document.getElementById("open-modal-btn");
const closeModalBtn =document.getElementById("close-btn");
const menuContent =document.getElementById("menu-content");
const myModal =document.getElementById("modal");
menuBtn.addEventListener("click", toggleVisibility(menuContent));
modalBtn.addEventListener("click", toggleVisibility(myModal));
closeModalBtn.addEventListener("click", toggleVisibility(myModal));

});