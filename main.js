const Hapi = require('hapi');
const server = new Hapi.Server();
const routes = require('./routes');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGOURI || 'mondodb://localhost/vtshortner';

const options = {
	server: {
		socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
	},
	replset: {
		socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
	}
};

mongoose.connect(mongoUri, options);

const db = mongoose.connection;

server.connection({
	port: process.env.PORT || 3000,
	routes: { cors: true }
});

server.register(require('inert'), (err) => {
	db.on('error', console.error.bind(console, 'connection error:'))
		.once('open', () => {
			server.route(routes);

			server.start(err => {
				if (err) throw err;

				console.log('Server running at port ${server.info.port}');
			});
		});
});