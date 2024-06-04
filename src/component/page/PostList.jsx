import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import List from "../list/List";
import Header from "../ui/Header";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (loading) return; // 로딩 중이면 아무것도 하지 않음

    if (!isAuthenticated) {
      alert("User not found or not logged in.");
      navigate("/login", { replace: true });
      return;
    }

    fetchPosts();
  }, [loading, isAuthenticated, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://story-flow-analysis.kro.kr/api/blog/posts", {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      const { data } = response;
      if (data.message === "Posts fetched successfully") {
        setPosts(data.data); // Update the state with the fetched posts
      } else {
        throw new Error(data.message || "Error fetching posts");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert(error.message || "An error occurred while retrieving posts"); // Display error to the user
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(error);
    navigate("/login", { replace: true });
    return <></>;
  }

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
