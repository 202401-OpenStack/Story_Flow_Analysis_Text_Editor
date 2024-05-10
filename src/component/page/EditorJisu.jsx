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
        // 이미 리다이렉트되었기 때문에 여기서 추가적인 렌더링을 방지합니다.
        return <></>;
    }
    return (
        <Wrapper>
            <MessageContainer>Hello</MessageContainer>
        </Wrapper>
    );
}

export default EditorJisu;