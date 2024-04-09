import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import List from "../list/List";
import Header from "../ui/Header";

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
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 게시물 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버의 엔드포인트 주소 업데이트
        const response = await fetch("http://54.161.32.32/rest-api/posts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data); // 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
