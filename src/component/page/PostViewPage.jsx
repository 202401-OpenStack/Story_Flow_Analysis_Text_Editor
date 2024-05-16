import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../ui/Header';
import DOMPurify from 'dompurify'

// 스타일 컴포넌트 정의
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
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  padding: 20px;
  margin: 40px auto;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const DateText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 18px;
  color: #444;
  line-height: 1.5;
  text-align: left;
  width: 100%;
  overflow-wrap: break-word; // 너무 긴 텍스트가 오버플로우 되지 않도록 처리

  p, h1, h2, h3, h4, h5, h6, ul, ol, li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
`;

const DeleteButton = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: auto;
  gap: 16px;
`;

// 날짜 포맷 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Seoul'
    });
}

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

    if (!post) return <div>Loading...</div>;

    const createMarkup = (htmlContent) => {
        return {
            __html: DOMPurify.sanitize(htmlContent)
        };
    };

    const handleDelete = async () => {
        if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`http://20.41.113.158/api/blog/posts/${postId}`, {
                    withCredentials: true
                });
                navigate('/post-list'); // 삭제 후 글 목록 페이지로 이동
            } catch (error) {
                console.error('Failed to delete the post:', error);
                alert('글을 삭제하는 도중 오류가 발생했습니다.');
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <Wrapper>
            <Header />
            <Container>
                <Title>{post.title}</Title>
                <DateText>{formatDate(post.createdAt)}</DateText>
                <Content dangerouslySetInnerHTML={createMarkup(post.content)} />
            </Container>
            <DeleteButton onClick={handleDelete}>글 삭제</DeleteButton>
        </Wrapper>
    );
};

export default PostViewPage;