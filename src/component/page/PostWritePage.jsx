import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import axios from "axios";
import { Chrono } from "react-chrono";
import domtoimage from "dom-to-image";
import ForceGraph2D from "react-force-graph-2d";

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

const VisualizeModal = styled.div`
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

  .visualize-component {
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

  .visualize-btn {
    width: 75px;
  }
`;

const PaletteContainer = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 16px;
  position: absolute;
  z-index: 100;
`;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function initializeGraphData(characters, links) {
  const nodes = characters; // 캐릭터들을 노드로 할당
  // 노드와 링크에 색상을 추가
  nodes.forEach((node) => {
    node.color = getRandomColor(); // 노드 색상 초기화
  });
  links.forEach((link) => {
    link.color = "black"; // 링크 색상 초기화
  });

  return { nodes, links }; // 색상이 추가된 노드와 링크 반환
}

function PostWritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [showPalette, setShowPalette] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
  const paletteBackground = useRef();
  const quillRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [postId, setPostId] = useState(null);

  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const timelineModalBackground = useRef();
  const [timelineItems, setTimelineItems] = useState([]);

  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);
  const relationshipModalBackground = useRef();
  const [relationshipCharacters, setRelationshipCharacters] = useState([]);
  const [relationshipLinks, setRelationshipLinks] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

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
    const quill = quillRef.current.getEditor();
    const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.

    if (command === "summarizeArticle") {
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
      try {
        /*const response = await axios.post(
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
        */
        const summary = ["철수", "영희", "길동"];
        console.log(summary);
        // quill.insertText(quill.getLength(), `\n${summary}\n`);
        const characterCount = summary.length;
        const text = `이 글의 등장인물은 ${summary} 으로 총 ${characterCount} 명입니다.`;
        quill.insertText(quill.getLength(), text);
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
    } else if (command === "analyzeTimeline") {
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

        const items = JSON.parse(response.data.data); // 백엔드에서 반환된 string 텍스트를 파싱합니다.
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
      // 제목과 내용이 모두 입력될 때만 저장합니다.
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    try {
      const url = `http://20.41.113.158/api/blog/posts${
        isEdit ? `/${postId}` : ""
      }`;
      const method = isEdit ? "PUT" : "POST";

      const response = await axios({
        url: url,
        method: method,
        data: {
          title,
          content: editorContent,
        },
        withCredentials: true, // Needed to send cookies for the session
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Post created successfully! ID: " + response.data.data.id);
      if (isEdit) navigate(`/post/${postId}`);
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
      navigate(`/post${isEdit ? `/${postId}` : "-list"}`);
    }
  };

  const handleTimelineInsert = async () => {
    const timelineElement = document.querySelector(".visualize-component");

    try {
      const base64Image = await domtoimage.toPng(timelineElement);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", base64Image, "user");
      setTimelineModalOpen(false);
      setShowPalette(false);
      quill.setSelection(quill.getLength(), 0);
    } catch (error) {
      console.error("Error capturing timeline:", error);
    }
  };

  const handleRelationshipInsert = async () => {
    const relationshipElement = document.querySelector(".visualize-component");

    try {
      const base64Image = await domtoimage.toPng(relationshipElement);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", base64Image, "user");
      setRelationshipModalOpen(false);
      setShowPalette(false);
      quill.setSelection(quill.getLength(), 0);
    } catch (error) {
      console.error("Error capturing relationship graph:", error);
    }
  };

  useEffect(() => {
    // queryParams 정의
    const queryParams = new URLSearchParams(location.search);
    const postIdFromQuery = queryParams.get("postId");
    const isEditFromQuery = queryParams.get("edit") === "true";

    // 상태 업데이트
    setPostId(postIdFromQuery);
    setIsEdit(isEditFromQuery);

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://20.41.113.158/api/blog/posts/${postIdFromQuery}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.message === "Post retrieved successfully") {
          setTitle(response.data.data.title);
          setEditorContent(response.data.data.content);
        } else {
          throw new Error(response.data.message || "Unknown Error");
        }
      } catch (error) {
        console.error("Error fetching the post:", error);
        alert(error.message || "Failed to fetch post");
      }
    };

    // 수정 모드이고 postId가 있을 경우에만 서버로부터 데이터를 가져옴
    if (isEditFromQuery && postIdFromQuery) {
      fetchPost();
    }
  }, [location]); // location이 변경될 때마다 useEffect가 실행됨

  return (
    <Wrapper>
      <Sidebar />
      {timelineModalOpen && ( //타임라인 컴포넌트 모달
        <VisualizeModal
          ref={timelineModalBackground}
          onClick={(e) => {
            if (e.target === timelineModalBackground.current) {
              setTimelineModalOpen(false);
            }
          }}
        >
          <div className={"modal-content"}>
            <div className={"visualize-component"}>
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
                <Button
                  className="visualize-btn"
                  onClick={handleTimelineInsert}
                >
                  예
                </Button>
                <Button
                  className="visualize-btn"
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
        </VisualizeModal>
      )}
      {relationshipModalOpen && ( //관계도 컴포넌트 모달
        <VisualizeModal
          ref={relationshipModalBackground}
          onClick={(e) => {
            if (e.target === relationshipModalBackground.current) {
              setRelationshipModalOpen(false);
            }
          }}
        >
          <div className={"modal-content"}>
            <div className={"visualize-component"}>
              <ForceGraph2D
                width={window.innerWidth}
                graphData={graphData}
                nodeAutoColorBy="group"
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.name;
                  const fontSize = 12 / globalScale;
                  ctx.fillStyle = node.color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                  ctx.fill();
                  ctx.font = "${fontSize}px Arial";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.fillStyle = "white";
                  ctx.fillText(label, node.x, node.y);
                }}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={4}
                linkCanvasObjectMode={() => "before"}
                linkCanvasObject={(link, ctx, globalScale) => {
                  const start = link.source;
                  const end = link.target;
                  const textPos = Object.assign(
                    ...["x", "y"].map((c) => ({
                      [c]: start[c] + (end[c] - start[c]) / 2, // calculate midpoint
                    }))
                  );

                  // 텍스트 라벨의 위치를 조정
                  const offset = link.source.id < link.target.id ? -5 : 5;

                  ctx.font = "${12 / globalScale}px Arial";
                  ctx.fillStyle = "black";
                  ctx.fillText(
                    link.relationship,
                    textPos.x,
                    textPos.y + offset
                  );
                }}
              />
            </div>
            <div className="footer-wrapper">
              <p>생성된 관계도를 에디터에 추가하시겠습니까?</p>
              <div className="btn-wrapper">
                <Button
                  className="visualize-btn"
                  onClick={handleRelationshipInsert}
                >
                  예
                </Button>
                <Button
                  className="visualize-btn"
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
        </VisualizeModal>
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
            <PaletteContainer
              ref={paletteBackground}
              onClick={(e) => {
                if (e.target === paletteBackground.current) {
                  setShowPalette(false);
                }
              }}
            >
              <CommandPalette
                show={showPalette}
                top={palettePosition.top}
                left={palettePosition.left}
                onSelect={handleSelectCommand}
              />
            </PaletteContainer>
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
