import React, { useState } from "react";
import styled from "styled-components";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "../../utils/SignupValidation";

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
  width: calc(100% - 80px);
  position: absolute;
  bottom: 45px;
  margin-top: 15px;
`;

function SignUp() {
  const title = "한국어 이야기\n흐름 분석 시스템";

  // UseState 훅 사용하여 각 입력 필드의 상태 추적
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    // 둘 다 이상이 없을 때만 API 요청 보냄
    if (!validationErrors.username && !validationErrors.password) {
      axios
        .post("https://story-flow-analysis.kro.kr/api/accounts/register", {
          username: values.username,
          password: values.password,
        })
        .then((res) => {
          alert("정상적으로 회원가입되었습니다.");
          navigate("/login");
        })
        .catch((err) => {
          // Check if error response exists and handle different status codes
          if (err.response) {
            switch (err.response.status) {
              case 409:
                alert(err.response.data.message);
                break;
              case 500:
                alert(err.response.data.message);
                break;
              default:
                alert("An unknown error occurred.");
                break;
            }
          } else {
            console.error(err);
            alert("An error occurred during sign up.");
          }
        });
    } else {
      console.log("Validation errors", validationErrors);
    }
  };

  // Handling input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
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
        <Title onClick={() => navigate("/")}>{title}</Title>
        <InputForm onSubmit={handleSignUp}>
          <Form.Group className="mb-3">
            <Form.Label>
              ID{" "}
              {errors.username && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.username}
                </span>
              )}
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              onChange={handleInputChange}
              isInvalid={!!errors.username}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              비밀번호{" "}
              {errors.password && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.password}
                </span>
              )}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              비밀번호 확인{" "}
              {errors.confirmPassword && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.confirmPassword}
                </span>
              )}
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              onChange={handleInputChange}
            />
          </Form.Group>
          <AuthBtns className="d-grid gap-2">
            <Button variant="primary" style={{ height: "45px" }} type="submit">
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
        </InputForm>
      </Container>
    </Wrapper>
  );
}

export default SignUp;
