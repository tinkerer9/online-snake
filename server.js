const localhostPort = 8000;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let sessionCount = 0;

let allGameData = [];

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomCharacter() {
    return characters.charAt(getRandomInt(characters.length));
}

function createGame(hostAddress) {
    let gameCode = createGameCode();

    let gameData = {
        gameCode: gameCode,
        hostAddress: hostAddress,
        playerData: [],
        appleX: getRandomInt(17) + 0.5,
        appleY: getRandomInt(17) + 0.5,
    };

    allGameData.push(gameData);

    return gameCode;
}

function createGameCode() {
    while (true) {
        let gameCode = getRandomCharacter() + getRandomCharacter() + getRandomCharacter();

        if (!getAllGameCodes().includes(gameCode)) {
            return gameCode;
        }
    }
}

function getAllGameCodes() {
    let gameCodes = [];

    for (let i = 0; i < allGameData.length; i++) {
        gameCodes.push(allGameData[i].gameCode);
    }

    return gameCodes;
}

function checkGameCode(gameCode) {
    return getAllGameCodes().includes(gameCode.toUpperCase());
}

function addPlayer(gameCode, playerAddress, playerName, skin, isHost) {
    let playerData = {
        playerAddress: playerAddress,
        playerName: playerName,
        isHost: isHost,
        x: getRandomInt(17) + 0.5,
        y: getRandomInt(17) + 0.5,
        length: 2,
        skin: skin,
        out: false
    };

    allGameData[getGameIndex(gameCode)].playerData.push(playerData);

    return playerData;
}

function getGameIndex(gameCode) {
    let gameIndex = false;

    allGameData.forEach((value, index) => {
        if (value.gameCode == gameCode) {
            gameIndex = index;
        }
    });

    return gameIndex;
}

function switchApple(gameCode) {
    allGameData[getGameIndex(gameCode)]['appleX'] = getRandomInt(17) + 0.5;
    allGameData[getGameIndex(gameCode)]['appleY'] = getRandomInt(17) + 0.5;
}

function connectionBoiler(path, socket) {
    sessionCount++;
    const clientAddress = socket.handshake.address;
    console.log(`Client ${socket.id} (${clientAddress}) connected to '${path}' (${sessionCount} sessions)`);

    return clientAddress;
}

function disconnectBoiler(path, socket, clientAddress, reason) {
    sessionCount--;
    console.log(`Client ${socket.id} (${clientAddress}) disconnected from '${path}' due to ${reason} (${sessionCount} sessions)`);
}

function ifHostThenDelete(clientAddress) {
    allGameData = allGameData.filter(gameData => gameData.hostAddress !== clientAddress);
}

app.get('/', function(req, res) { res.sendFile(__dirname + '/index.html') });
app.get('/styles.css', function(req, res) { res.sendFile(__dirname + '/styles.css') });
app.get('/script.js', function(req, res) { res.sendFile(__dirname + '/script.js') });

app.get('/create', function(req, res) { res.sendFile(__dirname + '/create/index.html') });
app.get('/create/styles.css', function(req, res) { res.sendFile(__dirname + '/create/styles.css') });
app.get('/create/script.js', function(req, res) { res.sendFile(__dirname + '/create/script.js') });

app.get('/join', function(req, res) { res.sendFile(__dirname + '/join/index.html') });
app.get('/join/styles.css', function(req, res) { res.sendFile(__dirname + '/join/styles.css') });
app.get('/join/script.js', function(req, res) { res.sendFile(__dirname + '/join/script.js') });

app.get('/play', function(req, res) { res.sendFile(__dirname + '/play/index.html') });
app.get('/play/styles.css', function(req, res) { res.sendFile(__dirname + '/play/styles.css') });
app.get('/play/script.js', function(req, res) { res.sendFile(__dirname + '/play/script.js') });

app.get('/images/logo.svg', function(req, res) { res.sendFile(__dirname + '/images/logo.svg') });
app.get('/images/grass.svg', function(req, res) { res.sendFile(__dirname + '/images/grass.svg') });
app.get('/images/apple.svg', function(req, res) { res.sendFile(__dirname + '/images/apple.svg') });
app.get('/images/red-preview.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/red/preview.svg') });
app.get('/images/red-head.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/red/head.svg') });
app.get('/images/red-square.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/red/square.svg') });
app.get('/images/red-corner.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/red/corner.svg') });
app.get('/images/red-tail.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/red/tail.svg') });
app.get('/images/yellow-preview.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/yellow/preview.svg') });
app.get('/images/yellow-head.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/yellow/head.svg') });
app.get('/images/yellow-square.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/yellow/square.svg') });
app.get('/images/yellow-corner.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/yellow/corner.svg') });
app.get('/images/yellow-tail.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/yellow/tail.svg') });
app.get('/images/green-preview.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/green/preview.svg') });
app.get('/images/green-head.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/green/head.svg') });
app.get('/images/green-square.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/green/square.svg') });
app.get('/images/green-corner.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/green/corner.svg') });
app.get('/images/green-tail.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/green/tail.svg') });
app.get('/images/blue-preview.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/blue/preview.svg') });
app.get('/images/blue-head.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/blue/head.svg') });
app.get('/images/blue-square.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/blue/square.svg') });
app.get('/images/blue-corner.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/blue/corner.svg') });
app.get('/images/blue-tail.svg', function(req, res) { res.sendFile(__dirname + '/images/skins/blue/tail.svg') });

io.of('/').on('connection', (socket) => {
    let clientAddress = connectionBoiler('/', socket);

    socket.on('disconnect', (reason) => {
        disconnectBoiler('/', socket, clientAddress, reason)
    });
});
io.of('/join').on('connection', (socket) => {
    let clientAddress = connectionBoiler('/join', socket);

    socket.on('checkGameCode', (gameCode) => {
        socket.emit('checkGameCodeResponse', checkGameCode(gameCode));
    });

    socket.on('disconnect', (reason) => {
        disconnectBoiler('/join', socket, clientAddress, reason)
    });
});
io.of('/create').on('connection', (socket) => {
    let clientAddress = connectionBoiler('/create', socket);

    socket.on('disconnect', (reason) => {
        disconnectBoiler('/create', socket, clientAddress, reason)
    });
});
io.of('/play').on('connection', (socket) => {
    let clientAddress = connectionBoiler('/play', socket);

    socket.on('createGame', (hostName, skin) => {
        let gameCode = createGame(clientAddress);
        addPlayer(gameCode, clientAddress, hostName, skin, true);
        socket.emit('createGameResponse', gameCode);
    });

    socket.on('addPlayer', (gameCode, playerName, skin) => {
        addPlayer(gameCode, clientAddress, playerName, skin, false);
    });

    socket.on('checkGameCode', (gameCode) => {
        socket.emit('checkGameCodeResponse', checkGameCode(gameCode));
    });

    socket.on('disconnect', (reason) => {
        ifHostThenDelete(clientAddress);
        disconnectBoiler('/play', socket, clientAddress, reason);
    });
});

http.listen(localhostPort, function() {
    console.log(`Server listening on http://localhost:${localhostPort}`);
});