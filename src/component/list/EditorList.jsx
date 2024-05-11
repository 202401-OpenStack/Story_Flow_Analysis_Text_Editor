import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Item from "./Item";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px; /* 모서리 둥글게 */
  padding: 10px 10px; /* 내부 여백 추가 */
  background: rgb(227, 227, 227); /* 배경색 설정 */
`;

const TableHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  margin-bottom: 10px;
  align-items: center; // 세로 중앙 정렬
  padding: 5px;
  border-radius: 3px;
  background: white;
  position: sticky;
`;

const HeaderInfo = styled.span`
  display: flex;
  
  justify-content: center; // 세로 축에서 아이템들을 중앙에 배치
  flex: 1; // Flex 아이템들이 컨테이너 공간을 동등하게 나누도록 설정
  font-size: 0.9rem;
  font-weight: bold;
  color: black;
  padding-right: 20px;
`;

const TableBody = styled.div`
  width: 100%;
  max-height: calc(100% - 65px);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  :hover {
    background: lightgray;
  }
`;

const ContentButton = styled.button`
  width: 100%;
  height: 65px;
  border: none;
  border-radius: 3px;
  margin-top: 10px;
  background: white;
  padding-right: 25px;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

function List({ posts, onClickItem }) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <TableHeader>
        <HeaderInfo style={{ textAlign: "left" }}>번호</HeaderInfo>
        <HeaderInfo style={{ textAlign: "center" }}>제목</HeaderInfo>
        <HeaderInfo style={{ textAlign: "right" }}>작성일</HeaderInfo>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => (
          <Item
            key={post.id}
            post={{ ...post, index: index + 1 }}  // 번호를 추가해 게시물에 표시
            onClick={() => onClickItem(post)}
          />
        ))}
      </TableBody>
      <ContentButton
        onClick={() => {
          navigate("/post-write");
        }}
      >
        +
      </ContentButton>
    </Wrapper>
  );
}

export default List;