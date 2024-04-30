import React, {
  ReactChild,
  ReactFragment,
  RefObject,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import TextInput from "../ui/TextInput";
import Sidebar from "../ui/Sidebar";

import axios from "axios";

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
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [values, setValues] = useState();

  const summarizeArticle = async () => {
    try {
      const response = await axios
        .post(
          "http://20.41.113.158/api/analysis/summarize",
          { content: values },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          alert("Article successfully summarized");
        });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You must be logged in to access the summarizeArticle API");
      } else {
        alert("An error occurred while accessing the summarizeArticle API");
      }
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [postId, setPostId] = useState(null);

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 사용자 인증 확인
    if (!isAuthenticated) {
      alert("User not found or not logged in.");
      navigate("/login", { replace: true });
      return;
    }

    // queryParams 정의
    const queryParams = new URLSearchParams(location.search);
    const postIdFromQuery = queryParams.get("postId");
    const isEditFromQuery = queryParams.get("edit") === "true";

    // 상태 업데이트
    setPostId(postIdFromQuery);
    setIsEdit(isEditFromQuery);

    const fetchPost = async () => {
      // getPost
      axios
        .get("http://20.41.113.158/api/blog/posts/${postIdfromQuery}")
        .then((res) => {
          alert("Post retrieved successfully");
          setTitle(res.data.data.title);
          setValues(res.data.data.content);
        })
        .catch((err) => {
          // Check if error response exists and handle different status codes
          if (err.response) {
            switch (err.response.status) {
              case 401: // Unauthoraized
                alert(err.response.data.message);
                break;
              case 404: // Not found
                alert(err.response.data.message);
                break;
              case 500: // Internal Server Error
                alert(err.response.data.message);
                break;
              default:
                alert("An unknown error occurred.");
                break;
            }
          } else {
            console.error(err);
            alert("An error occurred while retrieving the post.");
          }
        });
    };

    // 수정 모드이고 postId가 있을 경우에만 서버로부터 데이터를 가져옴
    if (isEditFromQuery && postIdFromQuery) {
      fetchPost();
    }
  }, [location, loading, isAuthenticated, navigate]); // location이 변경될 때마다 useEffect가 실행됨

  // 에디터가 비었는지 확인
  const isQuillEmpty = (value) => {
    if (value) {
      if (
        value.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
        !value.includes("<img")
      )
        return true;
      else return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || isQuillEmpty(values)) {
      alert("모든 필드를 채워주세요");
      return;
    }

    const postInfo = { title, values };

    if (isEdit) {
      if (postId) {
        // updatePost
        axios
          .put("http://20.41.113.158/api/blog/posts/${postId}", postInfo)
          .then((res) => {
            alert("Post updated successfully");
          })
          .catch((err) => {
            // Check if error response exists and handle different status codes
            if (err.response) {
              switch (err.response.status) {
                case 401: // Unauthoraized
                  alert(err.response.data.message);
                  break;
                case 404: // Not found
                  alert(err.response.data.message);
                  break;
                case 500: // Internal Server Error
                  alert(err.response.data.message);
                  break;
                default:
                  alert("An unknown error occurred.");
                  break;
              }
            } else {
              console.error(err);
              alert("An error occurred while updating the post.");
            }
          });
      }
    } else {
      // createPost
      axios
        .post("http://20.41.113.158/api/blog/posts", postInfo)
        .then((res) => {
          alert("Post created successfully");
        })
        .catch((err) => {
          // Check if error response exists and handle different status codes
          if (err.response) {
            alert(err.response.status);
            switch (err.response.status) {
              case 401: // Unauthorized
                alert(err.response.data.message);
                break;
              case 500: // Internal Server Error
                alert(err.response.data.message);
                break;
              default:
                alert("An unknown error occurred.");
                break;
            }
          } else {
            console.error(err);
            alert("An error occurred while creating the post");
          }
        });
    }
  };

  const handleDelete = async (event) => {
    if (!postId) {
      alert("글이 저장되지 않았습니다.");
      return;
    }

    const isConfirmed = window.confirm("정말로 글을 삭제하시겠습니까?");
    if (isConfirmed) {
      // deletePost
      axios
        .delete("http://20.41.113.158/api/blog/posts/${postId}")
        .then((res) => {
          alert("Post deleted successfully");
        })
        .catch((err) => {
          // Check if error response exists and handle different status codes
          if (err.response) {
            switch (err.response.status) {
              case 401: // Unauthoraized
                alert(err.response.data.message);
                break;
              case 404: // Not found
                alert(err.response.data.message);
                break;
              case 500: // Internal Server Error
                alert(err.response.data.message);
                break;
              default:
                alert("An unknown error occurred.");
                break;
            }
          } else {
            console.error(err);
            alert("An error occurred while deleting the post.");
          }
        });
    }
  };

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
            placeholder="내용을 입력하세요"
          />
        </Container>
        <div
          dangerouslySetInnerHTML={{ __html: values }}
          // 텍스트 에디터 내용 불러오기 확인(임시)
        />
        <EditorBtn>
          <Button onClick={summarizeArticle}>요약하기</Button>
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
          <Button onClick={handleDelete}>삭제하기</Button>
          <Button onClick={handleSubmit}>저장하기</Button>
        </EditorBtn>
      </Layout>
    </Wrapper>
  );
}

export default EditorPage;
