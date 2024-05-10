import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import TextInput from '../ui/TextInput';
import CommandPalette from '../ui/CommandPalatte';

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

function EditorJisu() {
    const navigate = useNavigate();
    const [editorContent, setEditorContent] = useState('');
    const [title, setTitle] = useState('');
    const [showPalette, setShowPalette] = useState(false);
    const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
    const quillRef = useRef(null);

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

    const handleSelectCommand = (command) => {
        if (command === 'summarize') {
            const quill = quillRef.current.getEditor();
            quill.insertText(quill.getLength(), ' 안녕하세요', 'user');
        }
        console.log(`Command selected: ${command}`);
        setShowPalette(false);
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
                    <Button onClick={() => console.log('Save Content:', editorContent)}>Save</Button>
                    <Button variant="secondary" onClick={() => navigate('/some-other-page')}>Cancel</Button>
                </EditorBtn>
            </Layout>
        </Wrapper>
    );
}

export default EditorJisu;
