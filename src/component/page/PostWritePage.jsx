import React, {
  ReactChild,
  ReactFragment,
  RefObject,
  useMemo,
  useState,
} from "react";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import Sidebar from "../ui/Sidebar";

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

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
];

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
  const [values, setValues] = useState();

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

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
          <ReactQuill
            theme="snow"
            style={{ height: "calc(100vh - 180px)" }}
            modules={modules}
            formats={formats}
            onChange={setValues}
          />
        </Container>
        <div dangerouslySetInnerHTML={{ __html :  values  }} 
          // 텍스트 에디터 내용 불러오기 확인(임시)
          />
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
