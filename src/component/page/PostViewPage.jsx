import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import DOMPurify from "dompurify";
import { Button } from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import Sidebar from "../ui/Sidebar";

// 스타일 컴포넌트 정의
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 10px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.div`
  width: 100%;
  height: 20px;
  padding: 20px;
  font-size: 16px; /* 글자 크기 */
  line-height: 0px;
  border: 1px solid #ccc; /* 경계선 스타일 */
`;

const DateText = styled.div`
  width: 100%;
  height: 16px;
  padding: 12px;
  font-size: 14px;
  line-height: 0px;
  border: 1px solid #ccc; /* 경계선 스타일 */
`;

const Content = styled.div`
  width: 100%;
  height: calc(100vh - 157px);
  padding: 5px 16px;
  font-size: 13px;
  line-height: 1.42;
  border: 1px solid #ccc; /* 경계선 스타일 */
  outline: none;
  box-sizing: border-box;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word; // 너무 긴 텍스트가 오버플로우 되지 않도록 처리
  overflow-y: scroll;

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  img {
    width: 100%;
  }
`;

const ViewerBtn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
`;

// 날짜 포맷 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Seoul",
  });
}

const PostViewPage = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

    fetchPost();
  }, [loading, isAuthenticated, navigate]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://20.41.113.158/api/blog/posts/${postId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.message === "Post retrieved successfully") {
        setPost(response.data.data);
      } else {
        throw new Error(response.data.message || "Unknown Error");
      }
    } catch (error) {
      console.error("Error fetching the post:", error);
      alert(error.message || "Failed to fetch post");
    }
  };

  if (!post) return <div>Loading...</div>;

  const createMarkup = (htmlContent) => {
    return {
      __html: DOMPurify.sanitize(htmlContent),
    };
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://20.41.113.158/api/blog/posts/${postId}`, {
          withCredentials: true,
        });
        navigate("/post-list"); // 삭제 후 글 목록 페이지로 이동
      } catch (error) {
        console.error("Failed to delete the post:", error);
        alert("글을 삭제하는 도중 오류가 발생했습니다.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/post-write?postId=${postId}&edit=true`);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Wrapper>
      <Sidebar />
      <Layout>
        <Container>
          <Title>{post.title}</Title>
          <DateText>{formatDate(post.createdAt)}</DateText>
          <Content dangerouslySetInnerHTML={createMarkup(post.content)} />
        </Container>
        <ViewerBtn>
          <Button onClick={handleEdit}>수정</Button>
          <Button variant="secondary" onClick={handleDelete}>
            삭제
          </Button>
        </ViewerBtn>
      </Layout>
    </Wrapper>
  );
};

export default PostViewPage;
