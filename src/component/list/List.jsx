import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Item from "./Item";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px; /* 모서리 둥글게 */
  padding: 23px 20px; /* 내부 여백 추가 */
  background: rgb(227, 227, 227); /* 배경색 설정 */
`;

const TableHeader = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  margin-bottom: 15px;
  align-items: center; // 세로 중앙 정렬
  padding: 15px;
  border-radius: 3px;
  background: white;
  position: sticky;
`;

const HeaderInfo = styled.span`
  display: flex;
  flex-direction: column; // 아이템들을 세로로 배열
  justify-content: center; // 세로 축에서 아이템들을 중앙에 배치
  flex: 1; // Flex 아이템들이 컨테이너 공간을 동등하게 나누도록 설정
  font-size: 1rem;
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
  margin-top: 15px;
  background: white;
  padding-right: 25px;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

function List({ posts, onClickItem }) {
  const navigate = useNavigate();

  // posts가 undefined일 경우 빈 배열을 기본값으로 사용
  const safePosts = posts || [];

  return (
    <Wrapper>
      <TableHeader>
        <HeaderInfo style={{ textAlign: "left" }}>번호</HeaderInfo>
        <HeaderInfo style={{ textAlign: "center" }}>제목</HeaderInfo>
        <HeaderInfo style={{ textAlign: "right" }}>작성일</HeaderInfo>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => {
          return (
            <Item
              key={post.id}
              index={index}
              post={post}
              onClick={() => {
                onClickItem(post);
              }}
            />
          );
        })}
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