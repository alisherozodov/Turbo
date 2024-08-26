function getOS() {
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
let balance = 0;
let pps = 1;
let clickPower = 1;
let energy = 100;
let maxEnergy = 100;
let lastUpdate = 0;
let boost_costs = [1e4, 1e5, 1e6, 1e9, 1e12, 1e13, 1e15];

function abbreviateNumber(balance) {
    if (balance >= 1e15) {
        return (balance / 1e15).toFixed(2).replace(/\.0$/, '') + 'Q';
    } else if (balance >= 1e12) {
        return (balance / 1e12).toFixed(2).replace(/\.0$/, '') + 'T';
    } else if (balance >= 1e9) {
        return (balance / 1e9).toFixed(2).replace(/\.0$/, '') + 'B';
    } else if (balance >= 1e6) {
        return (balance / 1e6).toFixed(2).replace(/\.0$/, '') + 'M';
    } else if (balance >= 1e3) {
        return (balance / 1e3).toFixed(2).replace(/\.0$/, '') + 'K';
    } else {
        return balance;
    }
}
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
    for (i = 0; i<boost_costs.length(); i++){
        document.getElementById(`b${i+1}`).querySelector("span").innerHTML += ` - ${abbreviateNumber(boost_costs[i])} $TURBO`;
    }
}

function loadGame() {
    balance = parseInt(localStorage.getItem("balance") || 0);
    pps = parseInt(localStorage.getItem("pps") || 1);
    clickPower = parseInt(localStorage.getItem("clickPower") || 1);
    energy = parseInt(localStorage.getItem("energy") || 100);
    maxEnergy = parseInt(localStorage.getItem("maxEnergy") || 100);
    lastUpdate = parseInt(localStorage.getItem("lastUpdate") || Date.now());
    boost_costs = JSON.parse(localStorage.getItem("boostCosts") || "[10000,100000,1000000,1000000000,1000000000000,10000000000000,1000000000000000]");

    const isBanned = localStorage.getItem("banned") === "true";
    if (isBanned) {
        window.location.href = "https://turboclicker.vercel.app/banned.html/";
        return false;
    }

    return true;
}

function saveGame() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('pps', pps);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', energy);
    localStorage.setItem('maxEnergy', maxEnergy);
    localStorage.setItem('lastUpdate', Date.now());
    localStorage.setItem("boostCosts", JSON.stringify(boost_costs));
}

if (loadGame()) {
    let timePassed = Math.floor((Date.now() - lastUpdate) / 1000);
    let cappedTime = Math.min(timePassed, 3600);
    if (cappedTime > 0){
        let offlineProfit = cappedTime * pps;
        balance += offlineProfit;
        energy = Math.min(maxEnergy, energy + timePassed);
        document.getElementById("dialog-icon").style.setProperty("fill", "green");
        document.getElementById("dialog-title").innerHTML = `Bot loaded ${abbreviateNumber(offlineProfit)} $TURBO for you!`;
        document.querySelector('.dialog').style.setProperty("bottom", "0");
        document.querySelector('.dialog').style.setProperty("display", "flex");
        saveGame();
    }
}


function clickCoin() {
    if (energy > 1) {
        balance += clickPower;
        energy -= 1;
        updateUI();
        saveGame();
    }
}

function increaseEnergy() {
    if (energy < maxEnergy) {
        energy += 1;
        updateUI();
    }
}

function profitps() {
    balance += pps;
    saveGame();
    updateUI();
}

setInterval(increaseEnergy, 1000);
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

function buyBoost(addedPps, addedClickPower, addedEnergy, garakmidi, index) {
    loadGame();
    cost = boost_costs[index-1]
    if (balance >= cost) {
        balance -= cost;
        pps += addedPps;
        clickPower += addedClickPower;
        energy += addedEnergy;
        maxEnergy += addedEnergy;
        boost_costs[index-1] *= 2;
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

function openboosts() {
    document.getElementById("gamemenu").style.setProperty("display", "none");
    document.getElementById("boostsmenu").style.setProperty("display", "flex");
    document.body.style.setProperty("padding-top", "40%");
    document.body.style.setProperty("padding-bottom", "30%");
}

function backtogames() {
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


function closedialog() {
    document.querySelector('.dialog').style.setProperty("bottom", "-60%");
    setTimeout(function() {
        document.querySelector('.dialog').style.setProperty("display", "none");
    }, 500);
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastUpdate', Date.now());
});
