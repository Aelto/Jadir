const express = require('express');
const consola = require('consola');

const { getRecentPosts } = require('../db/posts');

const router = express.Router();
const POSTS_PER_PAGE = 20;

router.get('/recent/:page', async (req, res) => {
  const page = Number(req.params.page);

  try {
    
    const posts = await getRecentPosts(page * POSTS_PER_PAGE, POSTS_PER_PAGE);

    res.json({ posts });
  }
  catch (err) {
    consola.error('an error occured when fetching for posts');
    consola.error(err);
    res.status(500).json({ message: 'an error occured when fetching for posts' });
  }
});

module.exports = router;