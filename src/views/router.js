const AuthenticationController = require('./controllers/authentication');  
const passportService = require('./config/passport');
const passport = require('passport');


module.exports = function(app) {  


  const requireAuth = passport.authenticate('jwt', { session: false });  
  const requireLogin = passport.authenticate('local', { session: false });

    // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Set url for API group routes
  app.use('/api', apiRoutes);
};


