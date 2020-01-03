import axios from 'axios';

const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
	e.preventDefault();
	const { elements } = this;
	const values = {};
	for (let input of elements) {
		const { name, value } = input;
		if (name) values[name] = value;
	}
	console.log(values);
	if (window.location.pathname === '/')
		axios.post('/user', values).then((result) => {
			console.log(result);
		});
	axios.patch('/user', values).then((result) => {
		console.log(result);
	});
});
