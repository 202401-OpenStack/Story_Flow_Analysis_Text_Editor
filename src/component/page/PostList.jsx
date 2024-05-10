import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import List from "../list/List";
import Header from "../ui/Header";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";

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

// 임시 버튼 (추후 삭제 예정)
const NavigateButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: blue;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(error);
    navigate('/login', { replace: true });
    return <></>;
  }

  if (!isAuthenticated) {
    // 이미 리다이렉트되었기 때문에 여기서 추가적인 렌더링을 방지합니다.
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
      <NavigateButton onClick={navigateToPostJisu}>
        EditorJisu
      </NavigateButton>
    </Wrapper>
  );
}

export default PostList;
