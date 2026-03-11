const socket = io('/join');

const params = new URLSearchParams(document.location.search);

var gameCodeFromParams = params.get('gamecode');

const gameCodeInput = document.getElementsByClassName('gameCodeInput')[0];
const nameInput = document.getElementsByClassName('nameInput')[0];
const skinInput = document.getElementsByClassName('skinInput')[0];

const notRedirectingText = document.getElementsByClassName('notRedirectingText')[0];
const notRedirectingLink = document.getElementsByClassName('notRedirectingLink')[0];

const joinBtn = document.getElementsByClassName('joinBtn')[0];

joinBtn.addEventListener('click', joinGame);

console.log(gameCodeFromParams);

if (gameCodeFromParams == undefined) {
	gameCodeInput.focus();
} else if (gameCodeFromParams.length == 3) {
	socket.emit('checkGameCode', gameCodeFromParams);
} else {
	gameCodeInput.focus();
}

function joinGame() {
	let gameCode = gameCodeInput.value;
	let name = nameInput.value;
	let skin = skinInput.value;

	if (!gameCode.length == 3) {
		alert('Game code must be 3 characters long');
		gameCodeInput.focus();
  		gameCodeInput.select();
	} else if (name == '') {
		alert('Choose a name');
		nameInput.focus();
  		nameInput.select();
  	} else if (skin == null) {
  		alert('Select a skin');
		skinInput.focus();
  		skinInput.select();
  	} else {
  		socket.emit('checkGameCode', gameCode);
  	}
}

socket.on('checkGameCodeResponse', (result) => {
	if (gameCodeFromParams == undefined) {
 		if (result == true) {
 			let gameCode = gameCodeInput.value;
			let name = nameInput.value;
			let skin = skinInput.value;

			let link = `/play?gamecode=${gameCode}&name=${name}&skin=${skin}`;

 			notRedirectingText.style.display = 'block';
 			notRedirectingLink.setAttribute('href', link);

 			window.location.href = link;
 		} else {
			alert('Invalid game code');
			gameCodeInput.focus();
  			gameCodeInput.select();
		}
	} else {
		if (result == true) {
			gameCodeInput.value = gameCodeFromParams;
		} else {
			gameCodeInput.value = '';
			gameCodeInput.focus();
  			gameCodeInput.select();
  		}
  		gameCodeFromParams = undefined;
	}
});