/*function getOS() {
    var userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
    if (/windows|win32/i.test(userAgent) || /macintosh|mac os x/i.test(userAgent)) {
        return 'desktop';
    }
    else if (/android/i.test(userAgent)) {
        return 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
    } else {
        return 'unknown';
    }
}
var os = getOS();
if (os === 'desktop') {
    window.location.href = "error_page.html";
}
*/
let balance = 0;
let pps = 1;
let clickPower = 1;
let energy = 100;
let maxEnergy = 100;
let lastUpdate = 0;

function abbreviateNumber(balance) {
    if (balance >= 1e15) {
        return (balance / 1e15).toFixed(1).replace(/\.0$/, '') + 'Q';
    } else if (balance >= 1e12) {
        return (balance / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
    } else if (balance >= 1e9) {
        return (balance / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (balance >= 1e6) {
        return (balance / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (balance >= 1e3) {
        return (balance / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return balance;
    }
}

document.getElementById('balance').innerHTML = `${balance} $TURBO`;
document.getElementById('pps').innerHTML = `${pps} Profit Per Second`;
document.getElementById('energy-status').innerHTML = `${energy}/${maxEnergy}`;

function showdialog(){
    document.getElementById("dialog-icon").style.setProperty("fill", "red");
    document.getElementById("dialog-title").innerHTML = "Insufficient $TURBO";
    document.querySelector('.dialog').style.setProperty("bottom", "0");
    document.querySelector('.dialog').style.setProperty("display", "flex");
}

function updateUI() {
    document.getElementById('balance').innerHTML = `${abbreviateNumber(balance)} $TURBO`;
    document.getElementById('energy-status').innerHTML = `${energy}/${maxEnergy}`;
    document.getElementById('energy-bar').style.width = `${(energy / maxEnergy) * 100}%`;
    document.getElementById('pps').innerHTML = `${abbreviateNumber(pps)} Profit Per Second`;
    updateLeague();
}

updateUI();

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
    if (localStorage.getItem("banned") == "true"){
        window.location.href = "https://turboclicker.vercel.app/banned.html/";
        return false;
    }
    if (localStorage.getItem("lastUpdate") == null){
        return false;
    } else {
        lastUpdate = localStorage.getItem("lastUpdate");
        return true
    }
}

function saveGame() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('pps', pps);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', energy);
    localStorage.setItem('maxEnergy', maxEnergy);
}

if (loadGame()){
    let timePassed = Math.floor((Date.now() - lastUpdate) / 1000);
    loaded_balance = Math.min(timePassed * pps, 3600 * pps);
    energy = Math.min(maxEnergy, energy+timePassed);
    balance += loaded_balance;
    document.getElementById("dialog-icon").style.setProperty("fill", "green");
    document.getElementById("dialog-title").innerHTML = `Bot loaded ${loaded_balance} $TURBO for you!`;
    document.querySelector('.dialog').style.setProperty("bottom", "0");
    document.querySelector('.dialog').style.setProperty("display", "flex");
    saveGame();
}

updateUI();

function clickCoin() {
    if (energy > 1) {
        balance += clickPower;
        energy -= 1;
        updateUI();
        saveGame();
    }
}


function increaseEnergy() {
    if(energy < maxEnergy) {
        energy += 1;
        updateUI();
    }
}


function profitps() {
    balance += pps;
    saveGame();
    updateUI();
}


setInterval(increaseEnergy,1000);
setInterval(profitps, 1000);
updateUI();

function updateLeague() {
    const leagues = [
        { name: 'Noob League', threshold: 0 },
        { name: 'Novice League', threshold: 100000 },
        { name: 'Experimenter League', threshold: 500000 },
        { name: 'Candidate League', threshold: 1000000 },
        { name: 'Master League', threshold: 10000000 },
        { name: 'Ridwan League', threshold: 50000000 },
        { name: 'Nitro League', threshold: 100000000 },
        { name: 'GM League', threshold: 1000000000 },
        { name: 'SGM League', threshold: 5000000000 },
        { name: 'Pro League', threshold: 1000000000000 },
        { name: 'Ultimatum League', threshold: 100000000000000 },
        { name: 'Boss League', threshold: 1000000000000000 },
        { name: 'X League', threshold: 10000000000000000 }
    ];

    for (let i = leagues.length - 1; i >= 0; i--) {
        if (balance >= leagues[i].threshold) {
            document.getElementById('leagues').innerHTML = leagues[i].name;
            break;
        }
    }
}

function buyBoost(addedPps,addedClickPower,addedEnergy,cost) {
    loadGame();
    if (balance >= cost) {
        balance -= cost;
        pps += addedPps;
        clickPower += addedClickPower;
        energy += addedEnergy;
        maxEnergy += addedEnergy;
        cost*=2;
        saveGame();
        document.getElementById("dialog-icon").style.setProperty("fill", "green");
        document.getElementById("dialog-title").innerHTML = "Done!";
        document.querySelector('.dialog').style.setProperty("bottom", "0");
        document.querySelector('.dialog').style.setProperty("display", "flex");
    } else {
        showdialog();
    }
    updateUI();
}

function openboosts(){
    document.getElementById("gamemenu").style.setProperty("display", "none");
    document.getElementById("boostsmenu").style.setProperty("display", "flex");
    document.body.style.setProperty("padding-top", "40%");
    document.body.style.setProperty("padding-bottom", "30%");
}

function backtogames(){
    document.getElementById("gamemenu").style.setProperty("display", "flex");
    document.getElementById("boostsmenu").style.setProperty("display", "none");
    document.body.style.setProperty("padding-top", "10%");
    document.body.style.setProperty("padding-bottom", "30%");
}


let x = 0;
let y = 0;
let coin = document.getElementById("coin");

document.addEventListener("mousemove",function(e) {
    const rect = coin.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
});

function createParticle(parentElement = document.body, text) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.innerHTML = text;
    particle.style.setProperty("top",y+"px");
    particle.style.setProperty("left",x+"px");
    if (parentElement) {
        parentElement.append(particle);
    }
    return particle;
}

let autotapchecker = 0;
let lastx = 0;
let lasty = 0;

coin.addEventListener("click", function() {
    if (energy >= 1){
        if (lastx == x && lasty == y){
            autotapchecker += 1;
            if (autotapchecker == 100){
                localStorage.setItem("banned", "true");
                window.location.href = "https://turboclicker.vercel.app/banned.html/";
            }
        } else {
            autotapchecker = 0;
        }
        lastx = x;
        lasty = y;
        const particle = createParticle(parentElement = coin, clickPower);
        particle.addEventListener("animationend", function() {
            particle.remove();
        });
    }
});


function closedialog(){
    document.querySelector('.dialog').style.setProperty("bottom", "-60%");
    setTimeout(function(){document.querySelector('.dialog').style.setProperty("display", "none")}, 500);
    
}

window.addEventListener('beforeunload', () => {
    const currentTime = Date.now();
    localStorage.setItem('lastUpdate', currentTime);
});
