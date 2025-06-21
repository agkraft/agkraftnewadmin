import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CommentManagementPage from '../pages/CommentManagementPage';

const PostCommentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CommentManagementPage />} />
      <Route path="/manage" element={<CommentManagementPage />} />
    </Routes>
  );
};

export default PostCommentRoutes;
