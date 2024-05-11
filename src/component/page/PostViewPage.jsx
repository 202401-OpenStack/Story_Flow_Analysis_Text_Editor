import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const Date = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 1.1rem;
  color: #444;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PostViewPage = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://20.41.113.158/api/blog/posts/${postId}`, {
          withCredentials: true
        });
        if (response.data.message === "Post retrieved successfully") {
          setPost(response.data.data);
        } else {
          throw new Error(response.data.message || "Unknown Error");
        }
      } catch (error) {
        console.error('Error fetching the post:', error);
        alert(error.message || "Failed to fetch post");
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    navigate(`/post-write/${postId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://20.41.113.158/api/blog/posts/${postId}`, {
          withCredentials: true
        });
        alert("Post deleted successfully");
        navigate('/post-list'); // Redirect to the post list after deletion
      } catch (error) {
        console.error('Failed to delete the post:', error);
        alert('Error deleting post');
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Wrapper>
      <Title>{post.title}</Title>
      <Date>{new Date(post.createdAt).toLocaleString('ko-KR')}</Date>
      <Content>{post.content}</Content>
      <ActionButtons>
        <Button onClick={handleEdit}>수정</Button>
        <Button onClick={handleDelete}>삭제</Button>
      </ActionButtons>
    </Wrapper>
  );
};

export default PostViewPage;