import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import List from "../list/List";
import Header from "../ui/Header";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
`;


function PostList(props) {
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('User not found or not logged in.');
      navigate('/login', { replace: true });
    }

  }, [loading, isAuthenticated, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://20.41.113.158/api/blog/posts", {
        withCredentials: true // Ensures cookies are sent with the request
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      alert('Failed to load posts.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(error);
    navigate('/login', { replace: true });
    return <></>;
  }

  const navigateToPostJisu = () => {
    navigate('/post-jisu');
  };

  return (
    <Wrapper>
      <Header />
      <Container>
        <List
          posts={posts}
          onClickItem={(item) => {
            navigate(`/post/${item.id}`);
          }}
        />
      </Container>
    </Wrapper>
  );
}

export default PostList;
