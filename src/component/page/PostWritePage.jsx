import React, {
  ReactChild,
  ReactFragment,
  RefObject,
  useMemo,
  useState,
} from 'react';

import styled from 'styled-components';


import Sidebar from "../ui/Sidebar";
import Editor from "../ui/QuillEditor";
import TextInput from '../ui/TextInput';


const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const InputContainer = styled.div`
    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 320px);
  height: 90%;
  position: fixed;
  left: 300px;
  ${(props) =>
    props.top &&
    `
    top: ${props.top}px;
`}
`;

function EditorPage() {

  const [title, setTitle] = useState('');

	return(
    <Wrapper>
        <Sidebar />
          <InputContainer>
            <Layout
              top={50}>
                    <TextInput
                        height={20}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                    />
                    </Layout>
                </InputContainer>
        <Layout
          top={100}>
          <Editor />
        </Layout>
    </Wrapper>
    );
}

export default EditorPage;