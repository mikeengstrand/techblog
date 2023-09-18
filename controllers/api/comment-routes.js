const router = require('express').Router();
const { Comment } = require('../../models');
// Import the withAuth function from the utils directory for authentication.
const withAuth = require('../../utils/auth');


// api/comment Route to get all comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({});  // Retrieve all comments from the database.
    if (commentData.length === 0) {
      res.status(404).json({ message: "You have no comments." });  // Return a message if no comments are found.
      return;
    };
    res.status(200).json(commentData);  // Return the comment data if available.
  } catch (err) {
    res.status(500).json(err).json  // Return an error if there's a server error.
    console.log(`${err} api/comment Route to get all comments`)
  }
});


// api/comment/:id Route to get comments for a specific post by ID 
router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: { id: req.params.id },
    });  // Retrieve comments for a specific post using its ID.
    if (commentData.length === 0) {
      res.status(404).json({ message: `No comments found.` });  // Return a message if no comments are found for the specified post ID.
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
    console.log(`${err} api/comment/:id Route to get comments for a specific post by ID `)
  }
});


// /api/comment  - Route to create a new comment
router.post('/', withAuth, async (req, res) => {
  const body = req.body;
  try {
    const newComment = await Comment.create({
      ...body,
      userId: req.session.userId,
    });  // Create a new comment and associate it with the logged-in user.
    res.status(200).json({ newComment, success: true });  // Return the new comment data if successfully created.
  } catch (err) {
    res.status(500).json(err);
    console.log(`${err} /api/comment  - Route to create a new comment `)
  }
});


// api/comment/:id Route to delete a comment by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: { id: req.params.id },
    });  // Delete a comment based on the provided comment ID.
    if (!commentData) {
      res.status(404).json({
        message: `Comment id not foundd`,
      });
      return;
    }
    res.status(200).json({ commentData, success: true });  // Return success message after successful deletion.
  } catch (err) {
    res.status(500).json(err);
    console.log(`${err} api/comment/:id Route to delete a comment by ID `)
  }
});

module.exports = router; 
