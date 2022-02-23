const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const apiRouter = require('./routes/api');
const githubRouter = require('./routes/github');

//New line from dev branch

const PORT = 3000;

//This is a line from ari/test2

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// in order for back end and front end to communicate in dev mode
app.use(cors());

//Static Routes
// app.use(express.static(path.resolve(__dirname, '../client')));

/**
 * define route handlers
 */
// const sessionController = require('./controllers/sessionController');

// app.get('/',(req,res) => {
//   return res.sendFile(path.resolve('dist','index.html'));
// });

if (process.env.NODE_ENV !== 'development') {
	app.use('/', express.static(path.resolve(__dirname, '../dist')));
}

// app.get('/dist', (req, res) => {
//   console.log('dist')
//   return res.sendFile(path.resolve('dist','bundle.js'));
// });

app.use('/api', apiRouter);
app.use('/github', githubRouter);
app.get('/logout', (req, res) => {
	return res.clearCookie('ssid').redirect('/');
});

// catch-all route handler for any requests to an unknown route
// app.get('/*', (req, res) => res.redirect('/'));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */

app.use((err, req, res, next) => {
	const defaultErr = {
		log: 'Express error handler caught unknown middleware error',
		status: 500,
		message: { err: 'An error occurred' },
	};
	const errorObj = Object.assign({}, defaultErr, err);
	console.log(errorObj.log);
	return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
