import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;
  width: 350px;
  animation: ${fadeInDown} 0.3s ease-out;
`;

const Item = styled.li`
  list-style: none;
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Description = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0; // 마진으로 제목과 설명 사이의 간격 조정
`;

// show: 드롭다운 표시 여부, top 및 left: 드롭다운 위치, onSelect: 항목 선택 시 호출할 함수
const CommandPalette = ({ show, top, left, onSelect }) => {
  if (!show) return null;

  return (
    <Dropdown style={{ top, left }}>
      <ul>
        <Item onClick={() => onSelect('summarizeArticle')}>
          요약하기
          <Description>지금까지 작성한 글의 줄거리를 요약합니다.</Description>
        </Item>
        <Item onClick={() => onSelect('findTopic')}>
          주제 찾기
          <Description>지금까지 작성한 글의 핵심 주제를 찾습니다.</Description>
        </Item>
        <Item onClick={() => onSelect('extractKeywords')}>
          키워드 추출
          <Description>지금까지 작성한 글에서 중요한 키워드를 3가지 추출합니다.</Description>
        </Item>
        <Item onClick={() => onSelect('analyzeCharacterCount')}>
          인물 수 분석
          <Description>지금까지 작성한 글에 등장하는 모든 등장인물을 카운트합니다.</Description>
        </Item>
        <Item onClick={() => onSelect('analyzeCharacterRelationships')}>
          인물 관계 분석
          <Description>지금까지 작성한 글에 등장하는 모든 등장인물들 간의 관계를 분석하여 시각화된 자료로 제공합니다.</Description>
        </Item>
        <Item onClick={() => onSelect('analyzeTimeline')}>
          타임 라인 분석
          <Description>지금까지 작성한 글에 등장하는 모든 사건의 타임 라인을 분석하여 시각화된 자료로 제공합니다.</Description>
        </Item>
        <Item onClick={() => onSelect('judgeStoryFlow')}>
          이야기 흐름 판단
          <Description>지금까지 작성한 글의 내용에 대해 AI가 피드백을 제공합니다.</Description>
        </Item>
      </ul>
    </Dropdown>
  );
};

export default CommandPalette;