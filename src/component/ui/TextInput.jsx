import React from "react";
import styled from "styled-components";

const StyledTextarea = styled.textarea`
    width: calc(100% );
    ${(props) =>
        props.height &&
        `
        height: ${props.height}px;
    `}
    padding: 20px;
    font-size: 16px; /* 글자 크기 */
    line-height: 0px;
    border: 1px solid #ccc; /* 경계선 스타일 */
    &:focus {
        outline: none; /* 아웃라인 제거 */
        border-color: #000; /* 경계선 색 변경 */
    }
    &::placeholder {
        color: #ccc; /* 디폴트 글자색 */
        font-style: italic; /* 디폴트 기울임체 */
    }
`;

function TextInput(props) {
    const { height, value, onChange, placeholder } = props;

    return (
        <StyledTextarea
            height={height}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}

export default TextInput;
