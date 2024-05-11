import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom"; // BrouserRouter를 쓰지 않는 이유: index.js에서 이미 적었기 때문
import React, {useEffect} from 'react';

import Main from "./component/page/Main";
import Login from "./component/page/Login";
import SignUp from "./component/page/SignUp";
import PostList from "./component/page/PostList";
import PostWritePage from "./component/page/PostWritePage";
import PostViewPage from "./component/page/PostViewPage";

import { useDispatch } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';
import { loadUser } from './redux/actions/authActions';

import './styles/quillStyles.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
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
        path="post/:postId"
        element={
          <ProtectedRoute>
            <PostViewPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;