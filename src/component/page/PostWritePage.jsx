import React, { useState, useRef, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chrono } from "react-chrono";
import domtoimage from "dom-to-image";
import ForceGraph2D from 'react-force-graph-2d';

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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;

  .modal-content {
    width: calc(100% - 100px);
    height: fit-content;
    max-height: calc(100% - 32px);
    min-height: 600px;
    padding: 16px;
    gap: 5px;
    background: white;
    display: grid;
    align-items: start;
    position: absolute;
    z-index: 99;
    overflow-y: scroll;
  }

  .timeline-component {
    width: 100%;
    height: fit-content;
    background: white;
  }

  .footer-wrapper {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function initializeGraphData(characters, links) {
  const nodes = characters; // 캐릭터들을 노드로 할당
  // 노드와 링크에 색상을 추가
  nodes.forEach(node => {
    node.color = getRandomColor(); // 노드 색상 초기화
  });
  links.forEach(link => {
    link.color = 'black'; // 링크 색상 초기화
  });

  return { nodes, links }; // 색상이 추가된 노드와 링크 반환
}

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

  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);
  const relationshipModalBackground = useRef();
  const [relationshipCharacters, setRelationshipCharacters] = useState([]);
  const [relationshipLinks, setRelationshipLinks] = useState([]);
  const [graphData, setGraphData] = useState({ nodes:[], links:[]});

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
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/timeline",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const items = JSON.parse(response.data.data);
        setTimelineItems(items);
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
    } else if (command === "analyzeCharacterRelationships") {
      const quill = quillRef.current.getEditor();
      const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

      try {
        const response = await axios.post(
          "http://20.41.113.158/api/analysis/character-relationships",
          { content },
          {
            withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.data);
        const { character, links } = JSON.parse(response.data.data);
        console.log(character);
        console.log(links);
        setRelationshipCharacters(character);
        setRelationshipLinks(links);
        setRelationshipModalOpen(true); // 관계도 모달
        setGraphData(initializeGraphData(character, links));
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

  const handleTimelineInsert = async () => {
    const timelineElement = document.querySelector(".timeline-component");

    try {
      const base64Image = await domtoimage.toPng(timelineElement);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", base64Image, "user");
      setTimelineModalOpen(false);
    } catch (error) {
      console.error("Error capturing timeline:", error);
    }
  };

  const handleRelationshipInsert = async () => {
    const relationshipElement = document.querySelector(".timeline-component");

    try {
      const base64Image = await domtoimage.toPng(relationshipElement);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", base64Image, "user");
      setRelationshipModalOpen(false);
    } catch (error) {
      console.error("Error capturing relationship graph:", error);
    }
  };

  return (
    <Wrapper>
      <Sidebar />
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
                cardHeight={30}
                cardWidth="fit-content"
                allowDynamicUpdate={true}
                hideControls={true}
                disableToolbar={true}
                useReadMore={false}
              />
            </div>
            <div className="footer-wrapper">
              <p>생성된 타임라인을 에디터에 추가하시겠습니까?</p>
              <div className="btn-wrapper">
                <Button className="timeline-btn" onClick={handleTimelineInsert}>
                  예
                </Button>
                <Button
                  className="timeline-btn"
                  variant="secondary"
                  onClick={() => {
                    setTimelineModalOpen(false);
                  }}
                >
                  아니오
                </Button>
              </div>
            </div>
          </div>
        </TimelineModal>
      )}
      {relationshipModalOpen && ( //관계도 컴포넌트 모달
        <TimelineModal
          ref={relationshipModalBackground}
          onClick={(e) => {
            if (e.target === relationshipModalBackground.current) {
              setRelationshipModalOpen(false);
            }
          }}
        >
          <div className={"modal-content"}>
            <div className={"timeline-component"}>
            <ForceGraph2D
              width={window.innerWidth}
              graphData={graphData}
              nodeAutoColorBy="group"
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 14 * (node.val / 1500);
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 7, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(label, node.x, node.y);
              }}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkCanvasObjectMode={() => 'before'}
              linkCanvasObject={(link, ctx, globalScale) => {
                const start = link.source;
                const end = link.target;
                const textPos = Object.assign(...['x', 'y'].map(c => ({
                  [c]: start[c] + (end[c] - start[c]) / 2 // calculate midpoint
                })));
          
            // 텍스트 라벨의 위치를 조정
            const offset = link.source.id < link.target.id ? -5 : 5;
            const fontSize = 14 * (node.val / 1500);
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = 'black';
            ctx.fillText(link.relationship, textPos.x, textPos.y + offset);
          }}
      />
    </div>
            <div className="footer-wrapper">
              <p>생성된 관계도를 에디터에 추가하시겠습니까?</p>
              <div className="btn-wrapper">
                <Button className="timeline-btn" onClick={handleRelationshipInsert}>
                  예
                </Button>
                <Button
                  className="timeline-btn"
                  variant="secondary"
                  onClick={() => {
                    setRelationshipModalOpen(false);
                  }}
                >
                  아니오
                </Button>
              </div>
            </div>
          </div>
        </TimelineModal>
      )}
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
