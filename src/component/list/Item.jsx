import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  margin: 6px 0;
  padding: 16px;
  display: flex;
  align-items: center; // 세로 중앙 정렬
  justify-content: center;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: white;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column; // 아이템들을 세로로 배열
  justify-content: center; // 세로 축에서 아이템들을 중앙에 배치
  flex: 1; // Flex 아이템들이 컨테이너 공간을 동등하게 나누도록 설정
  font-size: 0.9rem;
  color: black;
  overflow-x: hidden;
`;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA'); // 'en-CA' locale은 YYYY-MM-DD 형식을 반환합니다.
}

function Item(props) {
  const { index, post, onClick } = props;

  return (
    <Wrapper onClick={onClick}>
      <Info style={{ textAlign: "left" }}>{index + 1}</Info>
      <Info style={{ textAlign: "center" }}>{post.title}</Info>
      <Info style={{ textAlign: "right" }}>{formatDate(post.createdAt)}</Info>
    </Wrapper>
  );
}

export default Item;
