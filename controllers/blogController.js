const { Post } = require('../models');

// 글 목록 가져오기
exports.getPosts = async (req, res) => {
    try {
      const accountId = req.session.accountId;

      // 사용자가 로그인하지 않았다면 에러 처리
      if (!accountId) {
        return res.status(401).json({message: 'You must be logged in to check posts'})
      }

      // 로그인한 사용자의 글만 출력.
      const posts = await Post.findAll({
        where: {
          accountId: accountId
        }
      });
      res.status(200).json({
        message: "Posts fetched successfully",
        data: posts
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving posts' });
    }
  };

// 글 작성하기
exports.createPost = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to create a post' });
        }

        const { title, content } = req.body;
        const data = await Post.create({ title, content, accountId });
        res.status(201).json({
          message: "Post created successfully",
          data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while creating the post' });
    }
};

// 특정 글 가져오기
exports.getPost = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to check the post' });
        }

        const post = await Post.findByPk(req.params.id);
        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
          message: "Post retrieved successfully",
          data: post
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while retrieving the post' });
    }
};

// 글 수정하기
exports.updatePost = async (req, res) => {
    try {
      // 세션에서 accountId 추출
      const accountId = req.session.accountId;
      if (!accountId) {
          // 사용자가 로그인하지 않았다면 에러 처리
          return res.status(401).json({ message: 'You must be logged in to update the post' });
      }

      const post = await Post.findByPk(req.params.id);
      if (post) {
        await post.update(req.body);
        res.status(200).json({
          message: "Post updated successfully",
          data: post
        });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while updating the post' });
    }
  };

// 글 삭제하기
exports.deletePost = async (req, res) => {
    try {
      // 세션에서 accountId 추출
      const accountId = req.session.accountId;
      if (!accountId) {
          // 사용자가 로그인하지 않았다면 에러 처리
          return res.status(401).json({ message: 'You must be logged in to delete the post' });
      }
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      await post.destroy();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
  };