const router = require('express').Router();

// Import API routes
const apiRoutes = require('./api');
// Import home-related routes
const homeRoutes = require('./home-routes');
// Import dashboard-related routes
const dashboardRoutes = require('./dashboard-routes');

// Use the imported routes for specific paths.
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

module.exports = router;