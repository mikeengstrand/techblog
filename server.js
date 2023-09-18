const path = require('path');
const express = require('express');

// Import 'express-handlebars' for rendering HTML templates.
const exphbs = require('express-handlebars');

// manage session cookies
const session = require('express-session');

// Import the routes from the 'controllers' module.
const routes = require('./controllers');

// Import helper functions.
const helpers = require('./utils/helpers');

// Create an instance of the Express application.
const app = express();

// Set the port for the server to listen on.
const PORT = process.env.PORT || 3001;

// Create an instance of 'express-handlebars' with custom helper functions.
const hbs = exphbs.create({ helpers });

// Setup Sequelize storage for session data.
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Define session configuration.
const sess = {
  secret: 'secret info', // Secret key used to sign the session ID cookie.
  cookie: {
    maxAge: 3600000, // Session duration in milliseconds (1 hour in this example)
    secure: false,   // Set to true in production if using HTTPS
    httpOnly: true   // Helps prevent cross-site scripting (XSS) attacks
  }, 

  resave: false, // Whether to save the session data back to the session store if no modifications are made.
  saveUninitialized: true,// Whether to save an uninitialized session to the store.
  store: new SequelizeStore({
    db: sequelize// Use Sequelize for storing session data.
  })
};

//store it as express middleware
app.use(session(sess));

// Set the handlebars engine for rendering templates.
app.engine('handlebars', hbs.engine);

// Set the view engine to handlebars.
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);


// Sync Sequelize models with the database and start the server.
// Listen on the specified port and log a message when the server starts.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
