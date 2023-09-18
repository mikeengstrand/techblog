const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');


// just: /  Route to get all posts
router.get('/', async (req, res) => {
  try {
    // Retrieve all posts from the database along with comments and user info
    const postData = await Post.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment',
            'postId',
            'userId',
            'created_at'
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['created_at', 'DESC']],  // Order posts in order of date
    });


    // Serialize data
    const posts = postData.map((post) => post.get({ plain: true }));
    // Respond with the homepage template 
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      userId: req.session.userId
    });
  } catch (err) {
    res.status(500).json(err);  // Return an error if there's a server error
  }
});


// post/:id   Route to get a single post by ID
router.get('/post/:id', async (req, res) => {
  try {
    // get a single post by its ID with comment n user data
    const postData = await Post.findOne({
      where: { id: req.params.id },
      attributes: [
        'id',
        'content',
        'title',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment',
            'postId',
            'userId',
            'created_at'
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    if (postData) {
      const post = postData.get({ plain: true });
      res.render('single-post', { post, loggedIn: req.session.loggedIn, username: req.session.username });
    } else {
      res.status(404).json({ message: "This id has no post." });
      return;
    }
  } catch (err) {
    res.status(500).json(err);  // Return an error if there's a server error
  }
});


// /login  Route to render login pagee
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');  // Redirect to home if already logged in
    return;
  }
  res.render('login');  // Render the login page
});


// /signup  Route to render signup page
router.get('/signup', async (req, res) => {
  res.render('signup');  // Render the signup page
});

module.exports = router;
