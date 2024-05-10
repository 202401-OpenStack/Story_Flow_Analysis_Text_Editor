import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import TextInput from '../ui/TextInput';
import Sidebar from '../ui/Sidebar';

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

const MessageContainer = styled.div`
  width: 100%;
  display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-top: 20px;
`;

function EditorJisu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    const [editorContent, setEditorContent] = useState(''); // 에디터 내용을 위한 상태
    const [title, setTitle] = useState("");

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ size: ["small", false, "large", "huge"] }],  // 사이즈 조절
                [{ align: [] }],  // 정렬
                ["bold", "italic", "underline", "strike"],  // 스타일링
                [{ list: "ordered" }, { list: "bullet" }],  // 리스트 옵션
                [{ color: [] }, { background: [] }],  // 컬러 옵션
            ],
        },
    }), []);

    useEffect(() => {
        if (!isAuthenticated) {
            alert('User not found or not logged in.');
            navigate('/login', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        alert(error);
        navigate('/login', { replace: true });
        return null;
    }
    if (!isAuthenticated) return null;

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    return (
        <Wrapper>
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
                        theme="snow"
                        style={{ height: "calc(100vh - 180px)" }}
                        modules={modules}
                        formats={formats}
                        value={editorContent}
                        onChange={handleEditorChange}
                        placeholder="내용을 입력하세요"
                    />
                </Container>
                <EditorBtn>
                    <Button onClick={() => console.log('Save Content:', editorContent)}>Save</Button>
                    <Button variant="secondary" onClick={() => navigate('/some-other-page')}>Cancel</Button>
                </EditorBtn>
            </Layout>
            <MessageContainer>Hello, edit your content below</MessageContainer>
        </Wrapper>
    );
}

export default EditorJisu;
