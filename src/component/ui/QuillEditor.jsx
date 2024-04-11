import React, {
    ReactChild,
    ReactFragment,
    RefObject,
    useMemo,
    useState,
  } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';



const main = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100vh;
  position: fixed;
  
  top: 0px;
`;


const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'align',
    'color',
    'background',
    'size',
    'h1',
  ];

function Editor() {

    const [values, setValues] = useState();
  
 const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ align: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

    return (

        <ReactQuill
        theme="snow"
        style={{ height: "80%"}}
        modules={modules}
        formats={formats}
        onChange={setValues}
        />
  
    );
}

export default Editor;