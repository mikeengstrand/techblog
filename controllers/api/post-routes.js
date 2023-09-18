const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
// Import the withAuth function from the utils directory for authentication.
const withAuth = require('../../utils/auth'); 


// /api/post  Route to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({ ...req.body, userId: req.session.userId });
    console.log("successful - ", newPost);  // Log the newly created post to the console.
    res.status(200).json(newPost);  // Return the new post data if successfully created.
  } catch (err) {
    res.status(400).json(err);  // Return an error if there's a bad request.
  }
});


// api/post/:id Route to edit a post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );  // Update the post with the provided ID with new title and content.
    if (!updatedPost) {
      res.status(404).json({ message: 'This id has no post' });  // Return a message if the post ID is not found.
      return;
    }
    res.status(200).json(updatedPost);  // Return the updated post data if successfully updated.
  } catch (err) {
    res.status(500).json(err);  // Return an error if there's a server error.
  }
});


// api/post/:id Route to delete a post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: { postId: req.params.id },
    });  // Delete comments associated with the post being deleted.

    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });  // Delete the post with the provided ID and associated with the logged-in user.
    if (!postData) {
      res.status(404).json({
        message: `Post ID not found}`,
      });  // Return a message if the post ID is not found for the logged-in user.
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; 