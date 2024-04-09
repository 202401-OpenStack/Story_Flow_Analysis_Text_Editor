import React from "react";
import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  margin-bottom: 20px;
  cursor: pointer;
`;

const InputForm = styled.form`
  width: calc(100% - 50px);
  margin-bottom: 25px;
  font-size: 1.1rem;
`;

const AuthBtns = styled.div`
  width: calc(100% - 50px);
  position: absolute;
  bottom: 45px;
  margin-top: 15px;
`;

function SignUp() {
  const title = "한국어 이야기\n흐름 분석 시스템";
  const navigate = useNavigate();
  const handleSignIn = () => {
    //회원가입 완료?
    alert("회원가입이 완료되었습니다.");
    navigate("/login");
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
        <InputForm>
          <Form.Group className="mb-3" controlId="formbasicEmail">
            <Form.Label> ID </Form.Label>
            <Form.Control type="text" name="new-id" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label> 비밀번호 </Form.Label>
            <Form.Control type="text" name="new-pw" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label> 비밀번호 확인 </Form.Label>
            <Form.Control type="text" name="check-pw" />
          </Form.Group>
        </InputForm>

        <AuthBtns className="d-grid gap-2">
          <Button
            variant="primary"
            style={{ height: "45px" }}
            onClick={handleSignIn}
          >
            회원가입
          </Button>
          <button
            className="btn"
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인
          </button>
        </AuthBtns>
      </Container>
    </Wrapper>
  );
}

export default SignUp;
