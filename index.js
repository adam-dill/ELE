function loadOverlay(url, callback) {
    fetch(url).then((response) => {
        response.text().then(text => {
            document.getElementById('contentContainer').innerHTML = text;
            if (typeof(callback) === 'function') {
                callback.call(undefined);
            }
        });
    });
}

function clearOverlay() {
    document.getElementById('contentContainer').innerHTML = "";
}