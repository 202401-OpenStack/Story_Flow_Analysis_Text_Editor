import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../ui/Header';

// 스타일 컴포넌트 정의
const Wrapper = styled.div`
  width: 80%;
  max-width: 600px;
  padding: 20px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
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

// PostViewPage 컴포넌트 정의
const PostViewPage = () => {
    const [post, setPost] = useState(null);
    const { postId } = useParams();

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

    return (
        <Wrapper>
            <Header />
            <Title>{post.title}</Title>
            <DateText>{formatDate(post.createdAt)}</DateText>
            <Content>{post.content}</Content>
        </Wrapper>
    );
};

export default PostViewPage;
