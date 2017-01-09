import path from 'path';
import {Server} from 'http';
import Express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext, RoutingContext} from 'react-router';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import Promise from 'bluebird';
import routes from './routes';
import PageNotFound from './components/PageNotFound';
import Index from './components/Index';

import passport from 'passport';
import mongoose from 'mongoose';
import configDB from './config/database.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { Provider } from 'react-redux';
import store from './store';
import {Route, IndexRoute, Router, hashHistory} from 'react-router';

const router = require('./router');  



mongoose.connect(configDB.url); //configure database



const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(Express.static(path.join(__dirname, 'static')));

app.use(morgan('dev')); //logs requests to console
app.use(cookieParser()); //reads cookies for authentication
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  


require('./serverroutes.js')(app);

app.get('*', function(req, res) {

	res.sendFile(path.join(__dirname + '/static/index.html'));

});


const port = process.env.PORT || 7770;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
	if (err) {
		return console.error(err);
	}

	console.info(`Server running on http://localhost:${port} [${env}]`);
});

app.use(function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router(app);  

