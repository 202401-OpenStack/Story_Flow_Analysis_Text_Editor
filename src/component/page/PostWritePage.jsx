import React from "react";
import styled from "styled-components";
import Header from "../ui/Header";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function PostWritePage(props) {
  return (
    <Wrapper>
      <Header />
      <h1>텍스트 에디터</h1>
    </Wrapper>
  );
}

export default PostWritePage;
