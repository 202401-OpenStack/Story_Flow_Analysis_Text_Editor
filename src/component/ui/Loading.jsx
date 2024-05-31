import React from "react";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const loaderStyle = {
  span: "20px",
  margin: "30px auto",
  textAlign: "center",
  color: "#fff",
  size: "20",
};

const Message = styled.div`
  padding: 20px;
  color: #fff;
  font-size: 1.1rem;
`;

const Loading = (loading) => {
  return (
    <Container>
      <ClipLoader
        color="#36d7b7"
        loading={loading}
        cssOverride={loaderStyle}
        size={60}
        speedMultiplier={0.8}
      />
      <Message>글 분석 중입니다. 잠시만 기다려 주세요.</Message>
    </Container>
  );
};

export default Loading;
