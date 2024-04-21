import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "react-bootstrap/Button";

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

function Sidebar() {
  const navigate = useNavigate();
  const title = "한국어 이야기\n흐름 분석 시스템";

  const redirectToHome = () => {
    navigate("/"); // 헤더 클릭 시 메인 페이지로 이동하기 위해 훅 사용
  };

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
          onClick={() => {
            navigate("/");
          }}
        >
          로그아웃
        </Button>
      </div>
    </Side>
  );
}

export default Sidebar;
