const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const User = require('./model/User');

const app = express();

mongoose
	.connect('mongodb://localhost:27017/stack-overflow', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log('DB connection successful!'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
	res.status(200).sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/users', async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

app.get('/user', async (req, res) => {
	res.status(200).sendFile(path.join(__dirname + '/views/edit.html'));
});

app.post('/user', async (req, res) => {
	try {
		const { username, password } = req.body;
		const newUser = new User({ username, password });
		await newUser.save();
		res.status(201).send('User successfully saved');
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.patch('/user', async (req, res) => {
	const { id, username, password } = req.body;
	const user = await User.findById(id);
	user.username = username ? username : user.username;
	user.password = password ? password : user.password;
	await user.save();
	res.status(200).json(user);
});

const port = 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
