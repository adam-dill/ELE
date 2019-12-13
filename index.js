function renderLeaderboardInput(distance) {
    fetch('leaderboard-input.html').then((response) => {
        response.text().then(text => document.getElementById('contentContainer').innerHTML = text);
    });
}

function renderLeaderboardList() {
    
}


function loadOverlay(url) {
    fetch(url).then((response) => {
        response.text().then(text => document.getElementById('contentContainer').innerHTML = text);
    });
}

function clearOverlay() {
    document.getElementById('contentContainer').innerHTML = "";
}