import React from "react";
import styled from "styled-components";

const StyledTitle = styled.input`
  width: 100%;
  height: 20px;
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
  const { value, onChange, placeholder } = props;

  return (
    <StyledTitle
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default TextInput;
