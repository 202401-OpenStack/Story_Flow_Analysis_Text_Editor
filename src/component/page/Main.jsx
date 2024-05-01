import React, {useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../redux/actions/authActions';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Background = styled.div`
  width: 100vw;
  height: 50vh;
  background-color: rgb(227, 227, 227);
  position: relative;
`;

const Title = styled.div`
  width: 100%;
  font-size: 3.3rem;
  font-weight: bold;
  font-stretch: extra-condensed;
  white-space: pre-wrap;
  color: black;
  text-align: center;
  position: absolute;
  bottom: 50px;
`;

const AuthBtn = styled.div`
  width: 100%;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: center;
  .btn {
    width: 300px;
    height: 70px;
    margin: 15px 50px 15px 50px;
    font-size: 1.5rem;
    font-weight: bold;
    background-color: lightgray;
    border-style: none;
  }
`;

function Main() {
  const title = "한국어 이야기\n흐름 분석 시스템";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    // 수정된 부분: isAuthenticated 상태가 true 일때만 홈으로 리디렉션
    if (isAuthenticated) {
      navigate('/post-list');
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  return (
    <Wrapper>
      <Background>
        <Title>{title}</Title>
      </Background>
      <AuthBtn>
        <Button
          className="btn"
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인
        </Button>
        <Button
          className="btn"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          회원가입
        </Button>
      </AuthBtn>
    </Wrapper>
  );
}

export default Main;
