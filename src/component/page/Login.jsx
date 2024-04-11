import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../redux/actions/authActions';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(227, 227, 227);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 450px;
  height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  border-radius: 3px; /* 모서리 둥글게 */
  padding: 15px 15px; /* 내부 여백 추가 */
  gap: 5px;
  background: white; /* 배경색 설정 */
`;

const CloseButton = styled.div`
  width: 100%;
  padding: 7px;
  text-align: right;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  cursor: pointer;
`;

const InputForm = styled.form`
  width: calc(100% - 50px);
  margin: 25px 0;
  font-size: 1.1rem;
`;

const AuthBtns = styled.div`
  width: calc(100% - 50px);
  position: absolute;
  bottom: 45px;
  margin-top: 15px;
`;

function Login() {
  const title = "한국어 이야기\n흐름 분석 시스템";

  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    // isAuthenticated 상태가 true 일때만 post-list로 보냄
    if (isAuthenticated) {
      navigate('/post-list');
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(values.username, values.password));
  };

  return (
    <Wrapper>
      <Container>
        <CloseButton>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={() => {
              navigate("/");
            }}
          />
        </CloseButton>
        <Title
          onClick={() => {
            navigate("/");
          }}
        >
          {title}
        </Title>
        <InputForm onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formbasicEmail">
            <Form.Label> ID </Form.Label>
            <Form.Control type="text" name="username" onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label> 비밀번호 </Form.Label>
            <Form.Control type="password" name="password" onChange={handleInput} />
          </Form.Group>
          <AuthBtns className="d-grid gap-2">
            <Button
              variant="primary"
              style={{ height: "45px" }}
              type="submit"
            >
              로그인
            </Button>
            <button
              className="btn"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              회원가입
            </button>
          </AuthBtns>
        </InputForm>
      </Container>
    </Wrapper>
  );
}

export default Login;
