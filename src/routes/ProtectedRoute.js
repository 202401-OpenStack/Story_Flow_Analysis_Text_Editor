import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // 인증되지 않았다면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  return children; // 인증된 경우 자식 컴포넌트를 렌더링
};

export default ProtectedRoute;