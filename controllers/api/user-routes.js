const router = require('express').Router();
const { User } = require('../../models');
// Import the withAuth function from the utils directory for authentication.
const withAuth = require('../../utils/auth');


// api/user  Route to sign up a new user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create(req.body);  // Create a new user in the database.
        req.session.save(() => {
            req.session.userId = dbUserData.id;  // Save the user ID to the session.
            req.session.username = dbUserData.username;  // Save the username to the session.
            req.session.loggedIn = true;  // Set the loggedIn status to true in the session.
            res.status(201).json({ message: `Account created!`});  // Return a success message with the username.
        });
    } catch (err) {
        res.status(400).json(err);  // Return an error if there's a bad request.
    }
});


// /api/user/login   Route to log in a user
router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {username: req.body.username}
        });  // Find user by their username.
        if (!dbUserData) {
            res.status(400).json({ message: `User id not found!` });  // Return a message if the user is not found.
            return;
        }
        // Check if the provided password is valid.
        const pwValidated = await dbUserData.checkPassword(req.body.password);
        if (!pwValidated) {
            res.status(400).json({ message: "Incorrect password!" });  // Return a message if the password is incorrect.
            return;
        }
        // Create a session and send a response back indicating successful login.
        req.session.save(() => {
            req.session.userId = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.status(200).json({ message: "You're logged in!" });
        });
    } catch (err) {
        res.status(400).json(err);  // Return an error if there's a bad request.
    }
});


// /api/user/logout   Route to log out a user
router.post('/logout', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn) {
            const dbUserData = await req.session.destroy(() => {
                res.status(204).end();  // Destroy the session and send a response indicating successful logout.
            });
        } else {
            res.status(404).end();  // Return a not found response if the user is not logged in.
        }
    } catch {
        res.status(400).end();  // Return an error if there's a bad request.
    }
});

module.exports = router;
