import path from 'path';
import {Server} from 'http';
import Express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from './routes';
import PageNotFound from './components/PageNotFound';

import passport from 'passport';
import mongoose from 'mongoose';
import configDB from './config/database.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';



mongoose.connect(configDB.url); //configure database

// require('./config/passport')(passport); //pass passport to configure with db


const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(Express.static(path.join(__dirname, 'static')));
app.use(morgan('dev')); //logs requests to console
app.use(cookieParser()); //reads cookies for authentication
app.use(bodyParser());
app.use(session({secret: "awesomesecret"}));
// app.use(passport.initialize());
// app.use(passport.session());

require('./serverroutes.js')(app);


// app.get('/foofoo', function(req, res) {
// 		res.json("foooooooo");
// });

app.get('*', (req, res) => {
	console.log("caught it");
	match(
		{routes, location: req.url},
		(err, redirectLocation, renderProps) => {
			if(err) {
				console.log("error caught");
				return res.status(500).send(err.message);
			}
			if(redirectLocation) {
				console.log("inside 302");
				return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			}

			let markup;
			if (renderProps) {
				console.log("inside renderProps");
				markup = renderToString(<RouterContext {...renderProps}/>);
			}
			else {
				console.log("inside PageNotFound");
				markup = renderToString(<PageNotFound/>);
				res.status(404);
			}
			console.log("right before rendering index");
			return res.render('index', {markup});
		}

	);
	console.log("outside of match function");
});


const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
	if (err) {
		return console.error(err);
	}

	console.info(`Server running on http://localhost:${port} [${env}]`);
});


