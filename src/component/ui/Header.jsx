import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff; /* 배경색: 흰색 */
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  white-space: pre-wrap;
  color: black;
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 3px solid black;
  margin: 20px 0 20px;
`;

function Header(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = "한국어 이야기\n흐름 분석 시스템";

  const redirectToHome = () => {
    navigate("/"); // 헤더 클릭 시 메인 페이지로 이동하기 위해 훅 사용
  };

  const handleLogout = async () => {
    dispatch(logout());  // 로그아웃 액션 호출
    navigate("/");  // 로그아웃 후 메인 페이지로 리다이렉트
  };

  return (
    <HeaderContainer>
      <Title onClick={redirectToHome} style={{ cursor: "pointer" }}>
        {title}
      </Title>
      <Button
        className="btn-sm"
        onClick={handleLogout}
        style={{ alignSelf: "flex-end" }}
      >
        로그아웃
      </Button>
      <Line />
    </HeaderContainer>
  );
}

export default Header;
