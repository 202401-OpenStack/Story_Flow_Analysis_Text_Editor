import React, { useState, useRef, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import TextInput from '../ui/TextInput';
import CommandPalette from '../ui/CommandPalatte';
import axios from 'axios'
import Sidebar from "../ui/Sidebar";

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


function PostWritePage() {
    const navigate = useNavigate();
    const [editorContent, setEditorContent] = useState('');
    const [title, setTitle] = useState('');
    const [showPalette, setShowPalette] = useState(false);
    const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
    const quillRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]); // 이미지 URL을 저장할 상태

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            const imageUrl = URL.createObjectURL(file);
            const range = quillRef.current.getEditor().getSelection(true);
            if (range) {
                quillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl, 'user');
                setUploadedImages(prev => [...prev, imageUrl]); // URL을 상태에 추가
            }
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ size: ["small", false, "large", "huge"] }],  // 사이즈 조절
                [{ align: [] }],  // 정렬
                ["bold", "italic", "underline", "strike"],  // 스타일링
                [{ list: "ordered" }, { list: "bullet" }],  // 리스트 옵션
                [{ color: [] }, { background: [] }],  // 컬러 옵션
                ["link", "image"], // 'image' 버튼 추가
            ],
            handlers: {
                'image': imageHandler
            }
        },
    }), [imageHandler]);

    const formats = [
        "font", "header", "bold", "italic", "underline", "strike",
        "blockquote", "list", "bullet", "indent", "link", "align",
        "color", "background", "size", "h1",
    ];

    const handleEditorChange = (content, delta, source, editor) => {
        setEditorContent(content);
        const cursorPosition = editor.getSelection()?.index;
        if (cursorPosition) {
            const textBeforeCursor = editor.getText(0, cursorPosition);
            if (textBeforeCursor.endsWith('/')) {
                const bounds = editor.getBounds(cursorPosition);
                setShowPalette(true);
                setPalettePosition({ top: bounds.bottom, left: bounds.left });
            } else {
                setShowPalette(false);
            }
        }
    };

    const handleSelectCommand = async (command) => {
        if (command === 'summarizeArticle') {
            const quill = quillRef.current.getEditor();
            const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.
    
            try {
                const response = await axios.post('http://20.41.113.158/api/analysis/summarize', { content }, {
                    withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
                quill.insertText(quill.getLength(), `\n${summary}\n`);
            } catch (error) {
                if (error.response) {
                    // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못함
                    alert('No response was received');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    alert('Error', error.message);
                }
            }
        }
        else if (command === 'findTopic') {
            const quill = quillRef.current.getEditor();
            const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.
    
            try {
                const response = await axios.post('http://20.41.113.158/api/analysis/topic', { content }, {
                    withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
                quill.insertText(quill.getLength(), `\n${summary}\n`);
            } catch (error) {
                if (error.response) {
                    // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못함
                    alert('No response was received');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    alert('Error', error.message);
                }
            }
        }
        else if (command === 'extractKeywords') {
            const quill = quillRef.current.getEditor();
            const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.
    
            try {
                const response = await axios.post('http://20.41.113.158/api/analysis/keywords', { content }, {
                    withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
                quill.insertText(quill.getLength(), `\n${summary}\n`);
            } catch (error) {
                if (error.response) {
                    // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못함
                    alert('No response was received');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    alert('Error', error.message);
                }
            }
        }
        else if (command === 'analyzeCharacterCount') {
            const quill = quillRef.current.getEditor();
            const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.
    
            try {
                const response = await axios.post('http://20.41.113.158/api/analysis/character-count', { content }, {
                    withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
                quill.insertText(quill.getLength(), `\n${summary}\n`);
            } catch (error) {
                if (error.response) {
                    // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못함
                    alert('No response was received');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    alert('Error', error.message);
                }
            }
        }
        else if (command === 'judgeStoryFlow') {
            const quill = quillRef.current.getEditor();
            const content = quill.getText(); // 에디터의 전체 텍스트를 가져옵니다.
    
            try {
                const response = await axios.post('http://20.41.113.158/api/analysis/story-flow', { content }, {
                    withCredentials: true, // 쿠키 정보를 요청과 함께 보내기 위해 사용
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const summary = response.data.data; // 백엔드에서 반환된 요약 텍스트를 가져옵니다.
                quill.insertText(quill.getLength(), `\n${summary}\n`);
            } catch (error) {
                if (error.response) {
                    // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못함
                    alert('No response was received');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    alert('Error', error.message);
                }
            }
        }
        setShowPalette(false);
    };

    const saveContent = async () => {
        if (!title.trim() || !editorContent.trim()) {
            alert('제목과 내용을 모두 입력하세요.');
            return;
        }
        try {
            const response = await axios.post('http://20.41.113.158/api/blog/posts', {
                title,
                content: editorContent
            }, {
                withCredentials: true, // Needed to send cookies for the session
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Post created successfully! ID: ' + response.data.data.id);

            // 이미지 URL을 해제
        uploadedImages.forEach(url => URL.revokeObjectURL(url));
        setUploadedImages([]); // 이미지 URL 상태 초기화
        
        } catch (error) {
            if (error.response) {
                // Handle responses outside the 2xx range
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('An unexpected error occurred');
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm("저장되지 않은 콘텐츠는 모두 잃게 됩니다. 계속 진행하시겠습니까?")) {
            navigate('/post-list');
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
                    <Button onClick={saveContent}>Save</Button>
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                </EditorBtn>
            </Layout>
        </Wrapper>
    );
}

export default PostWritePage;
