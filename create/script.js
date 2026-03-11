const socket = io('/create');

const nameInput = document.getElementsByClassName('nameInput')[0];
const skinInput = document.getElementsByClassName('skinInput')[0];

const notRedirectingText = document.getElementsByClassName('notRedirectingText')[0];
const notRedirectingLink = document.getElementsByClassName('notRedirectingLink')[0];

const createBtn = document.getElementsByClassName('createBtn')[0];

createBtn.addEventListener('click', createGame);

function createGame() {
	let name = nameInput.value;
	let skin = skinInput.value;

	if (name == '') {
		alert('Choose a name');
		nameInput.focus();
  		nameInput.select();
  	} else if (skin == null) {
  		alert('Select a skin');
		skinInput.focus();
  		skinInput.select();
  	} else {
  		window.location.href = (`/play?host&name=${name}&skin=${skin}`);
  	}
}