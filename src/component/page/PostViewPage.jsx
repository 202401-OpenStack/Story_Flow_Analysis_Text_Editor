import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostViewPage = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams(); // URL에서 postId를 추출

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // withCredentials: true 옵션을 추가
        const response = await axios.get(`http://20.41.113.158/api/blog/posts/${postId}`, {
          withCredentials: true
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching the post:', error);
        alert('Failed to fetch post');
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
      <div>{post.content}</div>
    </div>
  );
};

export default PostViewPage;