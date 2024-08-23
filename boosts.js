let balance = 0;
let pps = 1;
let clickPower = 1;
let energy = 100;
let maxEnergy = 100;

function loadGame() {
    if (localStorage.getItem("balance") == null){
        balance = 0;
    } else {
        balance = parseInt(localStorage.getItem("balance"));
    }
    if (localStorage.getItem("pps") == null){
        pps = 1;
    } else {
        pps = parseInt(localStorage.getItem("pps"));
    }
    if (localStorage.getItem("clickPower") == null){
        clickPower = 1;
    } else {
        clickPower = parseInt(localStorage.getItem("clickPower"));
    }
    if (localStorage.getItem("energy") == null){
        energy = 100;
    } else {
        energy = parseInt(localStorage.getItem("energy"));
    }
    if (localStorage.getItem("maxEnergy") == null){
        maxEnergy = 100;
    } else {
        maxEnergy = parseInt(localStorage.getItem("maxEnergy"));
    }
}
