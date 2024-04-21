import React, {
  ReactChild,
  ReactFragment,
  RefObject,
  useMemo,
  useState,
} from "react";

import styled from "styled-components";
import { Button } from "react-bootstrap";

import Sidebar from "../ui/Sidebar";
import Editor from "../ui/QuillEditor";
import TextInput from "../ui/TextInput";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.top &&
    `
  top: ${props.top}px;
`}
`;

const EditorBtn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: auto;
  gap: 16px;
`;

function EditorPage() {
  const [title, setTitle] = useState("");

  return (
    <Wrapper>
      <Sidebar />
      <Layout>
        <Container>
          <TextInput
            height={20}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </Container>
        <Container>
          <Editor />
        </Container>
        <EditorBtn>
          <Button
            onClick={() => {
              alert("delete");
            }}
          >
            삭제하기
          </Button>
          <Button
            onClick={() => {
              alert("submit");
            }}
          >
            저장하기
          </Button>
        </EditorBtn>
      </Layout>
    </Wrapper>
  );
}

export default EditorPage;
