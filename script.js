const socket = io('/');

const joinBtn = document.getElementsByClassName('joinBtn')[0];
const createBtn = document.getElementsByClassName('createBtn')[0];

joinBtn.addEventListener('click', joinBtnClick);
createBtn.addEventListener('click', createBtnClick);

function joinBtnClick() {
	window.location = window.location.origin + '/join';
}

function createBtnClick() {
	window.location = window.location.origin + '/create';
}