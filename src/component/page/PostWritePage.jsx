import React, { useState, useRef, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chrono } from "react-chrono";

import Sidebar from "../ui/Sidebar";
import TextInput from "../ui/TextInput";
import CommandPalette from "../ui/CommandPalatte";

// 스타일 컴포넌트 정의
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
`;

const EditorBtn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: auto;
  gap: 16px;
`;

const TimelineModal = styled.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);

  position: absolute;
  width: calc(100% - 312px);
  height: calc(100% - 180px);
  margin-top: 42px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .modal-content {
    width: 500px;
    height: 600px;
    padding: 25px;
    gap: 15px;
    background: white;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .timeline-component {
    width: 100%;
    height: 400px;
  }

  .btn-wrapper {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .timeline-btn {
    width: 75px;
  }
`;

function PostWritePage() {
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [showPalette, setShowPalette] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
  const quillRef = useRef(null);

  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const timelineModalBackground = useRef();
  const [timelineItems, setTimelineItems] = useState([]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }], // 사이즈 조절
          [{ align: [] }], // 정렬
          ["bold", "italic", "underline", "strike"], // 스타일링
          [{ list: "ordered" }, { list: "bullet" }], // 리스트 옵션
          [{ color: [] }, { background: [] }], // 컬러 옵션
          ["link", "image"], // 'image' 버튼 추가
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", base64Image, "user");
      };
      reader.readAsDataURL(file);
    };
  }

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
    "image",
  ];

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
    const cursorPosition = editor.getSelection()?.index;
    if (cursorPosition) {
      const textBeforeCursor = editor.getText(0, cursorPosition);
      if (textBeforeCursor.endsWith("/")) {
        const bounds = editor.getBounds(cursorPosition);
        setShowPalette(true);
        setPalettePosition({ top: bounds.bottom, left: bounds.left });
      } else {
        setShowPalette(false);
      }
    }
  };

  const handleSelectCommand = async (command) => {
    if (command === "summarizeArticle") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/summarize",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
        quill.insertText(quill.getLength(), `\n${summary}\n`);
      } catch (error) {
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
      }
    } else if (command === "findTopic") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/topic",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
        quill.insertText(quill.getLength(), `\n${summary}\n`);
      } catch (error) {
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
      }
    } else if (command === "extractKeywords") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/keywords",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
        quill.insertText(quill.getLength(), `\n${summary}\n`);
      } catch (error) {
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
      }
    } else if (command === "analyzeCharacterCount") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/character-count",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
        quill.insertText(quill.getLength(), `\n${summary}\n`);
      } catch (error) {
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
      }
    } else if (command === "analyzeTimeline") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.get(
          "http://20.41.113.158/api/analysis/timeline",
          {
            params: { content },
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
            transitional: {
              silentJSONParsing: false,
            },
          }
        );

        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);

        const items = response.data.data; // 백엔드에서 반환된 타임라인 데이터를 가져옵니다.
        const items_stringify = JSON.stringify(response.data.data);

        console.log(items);
        console.log(items_stringify);
        setTimelineItems(items_stringify);
        setTimelineModalOpen(true);
      } catch (error) {
        console.error(error);
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
        const items = [
          {
            cardTitle: "Title0",
            cardDetailedText: "테스트용 하드코딩 데이터 Text0",
          },
          {
            cardTitle: "Title1",
            cardDetailedText: "테스트용 하드코딩 데이터 Text1",
          },
          {
            cardTitle: "Title2",
            cardDetailedText: "테스트용 하드코딩 데이터 Text2",
          },
          {
            cardTitle: "Title3",
            cardDetailedText: "테스트용 하드코딩 데이터 Text3",
          },
        ];
        setTimelineItems(items);
        setTimelineModalOpen(true);
      }
    } else if (command === "judgeStoryFlow") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/story-flow",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
        quill.insertText(quill.getLength(), `\n${summary}\n`);
      } catch (error) {
        if (error.response) {
          // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못함
          alert("No response was received");
        } else {
          // 요청 설정 중 문제가 발생한 경우
          alert("Error", error.message);
        }
      }
    }
    setShowPalette(false);
  };

  const saveContent = async () => {
    if (!title.trim() || !editorContent.trim()) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }
    try {
      const response = await axios.post(
        "http://20.41.113.158/api/blog/posts",
        {
          title,
          content: editorContent,
        },
        {
          withCredentials: true, // Needed to send cookies for the session
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Post created successfully! ID: " + response.data.data.id);
    } catch (error) {
      if (error.response) {
        // Handle responses outside the 2xx range
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "저장되지 않은 콘텐츠는 모두 잃게 됩니다. 계속 진행하시겠습니까?"
      )
    ) {
      navigate("/post-list");
    }
  };

  return (
    <Wrapper>
      <Sidebar />
      <Layout>
        <Container>
          <TextInput
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Container>
        <Container>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            style={{ height: "calc(100vh - 180px)" }}
            modules={modules}
            formats={formats}
            value={editorContent}
            onChange={handleEditorChange}
            placeholder="내용을 입력하세요"
            defaultValue={editorContent}
          />
          {showPalette && (
            <CommandPalette
              show={showPalette}
              top={palettePosition.top}
              left={palettePosition.left}
              onSelect={handleSelectCommand}
            />
          )}
          {timelineModalOpen && ( //타임라인 컴포넌트 모달
            <TimelineModal
              ref={timelineModalBackground}
              onClick={(e) => {
                if (e.target === timelineModalBackground.current) {
                  setTimelineModalOpen(false);
                }
              }}
            >
              <div className={"modal-content"}>
                <div className={"timeline-component"}>
                  <Chrono
                    items={timelineItems}
                    mode="VERTICAL"
                    cardHeight={80}
                    cardWidth={650}
                    disableToolbar={true}
                    scrollable={{ scrollbar: true }}
                  />
                </div>
                <p>생성된 타임라인을 에디터에 추가하시겠습니까?</p>
                <div className="btn-wrapper">
                  <Button
                    className="timeline-btn"
                    onClick={() => {
                      alert("yes");
                      setTimelineModalOpen(false);
                    }}
                  >
                    예
                  </Button>
                  <Button
                    className="timeline-btn"
                    variant="secondary"
                    onClick={() => {
                      alert("no");
                      setTimelineModalOpen(false);
                    }}
                  >
                    아니오
                  </Button>
                </div>
              </div>
            </TimelineModal>
          )}
        </Container>
        <EditorBtn>
          <Button onClick={saveContent}>저장</Button>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
        </EditorBtn>
      </Layout>
    </Wrapper>
  );
}

export default PostWritePage;
