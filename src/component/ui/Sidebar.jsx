import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {useDispatch} from 'react-redux';
import { logout } from "../../redux/actions/authActions";

import List from "../list/EditorList";

const Side = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  gap: 1vh;
  position: relative;
  left: 0px;
  top: 0px;
  background: rgb(227, 227, 227);
`;

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
  cursor: default; /* 커서: 기본 */
`;

const Title = styled.h1`
  color: #333; /* 글자색: 검은색 */
  font-size: 1.5rem;
  font-weight: bold;
  white-space: pre-wrap;
`;

var isSaved = 0;

function Sidebar({ isSaved }) {
  const navigate = useNavigate();
  const title = "한국어 이야기\n흐름 분석 시스템";
  const dispatch = useDispatch();

  const redirectToHome = () => {
    navigate("/login"); // 헤더 클릭 시 메인 페이지로 이동하기 위해 훅 사용
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  }

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://20.41.113.158/api/blog/posts", {
          withCredentials: true // Ensures cookies are sent with the request
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

    fetchPosts();
  }, []);

  return (
    <Side>
      <HeaderContainer>
        <Title onClick={redirectToHome} style={{ cursor: "pointer" }}>
          {title}
        </Title>
      </HeaderContainer>
      <List
        posts={posts}
        onClickItem={(item) => {
          navigate(`/post/${item.id}`);
        }}
      />
      <div
        className="d-grid gap-2"
        style={{
          margin: "10px",
          width: "260px",
          position: "relative",
          bottom: "5px",
        }}
      >
        <Button
          variant="primary"
          style={{ height: "40px" }}
          onClick={() => {
            navigate("/post-list");
          }}
        >
          글 목록 보기
        </Button>
        <Button
          variant="primary"
          style={{ height: "40px" }}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </Side>
  );
}

export default Sidebar;
