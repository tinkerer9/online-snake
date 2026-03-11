const socket = io('/play');

const text = document.getElementsByClassName('text')[0];

const params = new URLSearchParams(document.location.search);

const gameCode = params.get('gamecode');
const name = params.get('name');
const skin = params.get('skin');
const isHost = params.get('host') == '';

if (isHost == true) {
	if (name == null || !(skin == 'red' || skin == 'yellow' || skin == 'green' || skin == 'blue')) {
		window.location.href = '/create';
	}

	text.innerHTML = 'Creating Game...';
	socket.emit('createGame', 'test name', 'red');
} else {
	if (name == null || !(skin == 'red' || skin == 'yellow' || skin == 'green' || skin == 'blue')) {
		window.location.href = '/join';
	}

	text.innerHTML = `Playing (${gameCode})`;
	socket.emit('checkGameCode', gameCode);
}

socket.on('createGameResponse', (gameCode) => {
	let sharingLink = `${window.location.host}/join?gamecode=${gameCode}`;
	text.innerHTML = `Game Created! ${gameCode}</br>Sharing Link: ${sharingLink}`;
});

socket.on('checkGameCodeResponse', (result) => {
 	if (result == true) {
 		text.innerHTML = `Playing (${gameCode})`;
 		socket.emit('addPlayer', gameCode, 'test name', 'green');
 	} else {
		window.location.href = '/join';
	}
});

window.onbeforeunload = () => {
	return true;
};