import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import TextInput from '../ui/TextInput';
import Sidebar from '../ui/Sidebar';

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

    useEffect(() => {
        if (!isAuthenticated) {
            alert('User not found or not logged in.');
            navigate('/login', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        alert(error);
        navigate('/login', { replace: true });
        return <></>;
    }

    if (!isAuthenticated) {
        return <></>;
    }

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    return (
        <Wrapper>
            <Layout>
                <Container>
                    <ReactQuill
                        theme="snow"
                        value={editorContent}
                        onChange={handleEditorChange}
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
