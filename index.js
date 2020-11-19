let WIDTH;
let HEIGHT;
let bgColour = [240, 200, 200];
let workingSet = [];
let stage = 0;
let dataDump = [];

let pushRate = 5;
let lastPush = new Date().getTime();

let total = 0;
let max = 1;
let targetMax = 1;

let popularTeams = [
    {
        "Name": "Ferrari",
        "Colour": [255, 40, 0]
    },
    {
        "Name": "claren",
        "Colour": [249, 142, 29]
    },
    {
        "Name": "Red Bull",
        "Colour": [30, 65, 255]
    },
    {
        "Name": "Renault",
        "Colour": [255, 245, 0]
    },
    {
        "Name": "Renault",
        "Colour": [255, 245, 0]
    },
    {
        "Name": "Haas",
        "Colour": [240, 215, 135]
    },
    {
        "Name": "Point",
        "Colour": [245, 150, 200]
    },
    {
        "Name": "Rosso",
        "Colour": [70, 155, 255]
    },
    {
        "Name": "Alfa",
        "Colour": [155, 0, 0]
    },
    {
        "Name": "Williams",
        "Colour": [255, 255, 255]
    },
    {
        "Name": "Mercedes",
        "Colour": [0, 210, 190]
    },
    {
        "Name": "Sauber",
        "Colour": [0, 110, 255]
    },
    {
        "Name": "India",
        "Colour": [255, 128, 199]
    },
    {
        "Name": "Lotus",
        "Colour": [255, 184, 0]
    },
    {
        "Name": "Marussia",
        "Colour": [110, 0, 0]
    },
    {
        "Name": "Lotus",
        "Colour": [255, 184, 0]
    }
]

let all = [];

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        let temp = JSON.parse(xhttp.responseText);
        dataDump = quickSort(temp, 0, temp.length - 1);
        all = JSON.parse(JSON.stringify(dataDump));
        total = dataDump.length;
    }
}
xhttp.open("GET", "./wins.json", true);
xhttp.send();

function setup() {
    createCanvas(200, 200);
    windowResized();
    frameRate(pushRate * 2);

    strokeWeight(5);

    angleMode(DEGREES);
    textAlign(LEFT, CENTER);

    textSize(24);
}

function draw() {
    background(colour());

    let teamCounters = {};

    max += (targetMax - max) / 10;

    let c = 0;

    for (let race of workingSet) {
        if (!Object.keys(teamCounters).includes(race.Team)) teamCounters[race.Team] = 0;

        if (teamCounters[race.Team] == targetMax) targetMax++;

        for (let key of Object.keys(teamCounters)) {
            stroke(`rgba(64, 64, 64, 0.1)`);
            for (let t of popularTeams) {
                if (key.toLowerCase().includes(t.Name.toLowerCase())) stroke(t.Colour);
            }
            let win = 0;
            if (key == race.Team) win++;
            line((c - Math.max(0, workingSet.length - (WIDTH / 12))) * 10, HEIGHT - ((teamCounters[key] / (max + 5)) * HEIGHT * 0.9), (c - Math.max(0, workingSet.length - (WIDTH / 12)) + 1) * 10, HEIGHT - (((teamCounters[key] + win) / (max + 5)) * HEIGHT * 0.9));
        }

        teamCounters[race.Team]++;
        c++;
    }

    noStroke();

    for(let key of Object.keys(teamCounters)) {
        fill(`rgba(64, 64, 64, 0.25)`);
        for(let t of popularTeams) {
            if (key.toLowerCase().includes(t.Name.toLowerCase()) && (teamCounters[key] / targetMax) ** 0.5 > 0.5) fill(0);
        }
        text(`${key} ${teamCounters[key]}`, ((c + 2) - Math.max(0, workingSet.length - (WIDTH / 12))) * 10, HEIGHT - ((teamCounters[key] / (max + 5)) * HEIGHT * 0.9));
    }

    fill(0);

    for(let c = 0; c < total; c += Math.ceil(total/20)) {
        if(c < all.length) text(all[c].Date.split("-")[0], (c - Math.max(0, workingSet.length - (WIDTH / 12))) * 10, 40);
    }

    let currentTime = new Date().getTime();
    if (lastPush + (1000 / pushRate) <= currentTime && dataDump.length > 0) {
        lastPush = currentTime;
        workingSet.push(dataDump.shift());
    }
}

function colour() {
    for (let c = 0; c < 3; c++) {
        if (c == stage) {
            bgColour[c] += 0.1;
        } else {
            bgColour[c] -= 0.1;
        }

        if (bgColour[c] > 255) {
            bgColour[c] = 255;
            stage = (stage + 1) % 3
        }
        if (bgColour[c] < 200) bgColour[c] = 200;
    }

    return bgColour;
}

function windowResized() {
    WIDTH = windowWidth;
    HEIGHT = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
}