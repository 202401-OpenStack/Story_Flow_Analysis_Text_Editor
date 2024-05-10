import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, {useEffect} from 'react';

import Main from "./component/page/Main";
import Login from "./component/page/Login";
import SignUp from "./component/page/SignUp";
import PostList from "./component/page/PostList";
import PostWritePage from "./component/page/PostWritePage";
import EditorJisu from "./component/page/EditorJisu";
import { useDispatch } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';
import { loadUser } from './redux/actions/authActions';
import Editor from "./component/ui/QuillEditor";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter> {/* BrowserRouter 추가 */}
      <Routes>
        <Route index element={<Main/>}/>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route
          path="post-list"
          element={
            <ProtectedRoute>
              <PostList />
            </ProtectedRoute>
          }
        />
        <Route
          path="post-write"
          element={
            <ProtectedRoute>
              <PostWritePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="post-write/:postId"
          element={
            <ProtectedRoute>
              <PostWritePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="post-jisu"
          element={
            <ProtectedRoute>
              <EditorJisu />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;