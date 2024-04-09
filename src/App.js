import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./component/page/Main";
import Login from "./component/page/Login";
import SignUp from "./component/page/SignUp";
import PostList from "./component/page/PostList";
import PostWritePage from "./component/page/PostWritePage";

//private route 설정하기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="post-list" element={<PostList />} />
        <Route path="post-write" element={<PostWritePage />} />
        <Route path="post-write/:postId" element={<PostWritePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
