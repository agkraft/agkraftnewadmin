import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FAQManagementPage from '../pages/FAQManagementPage';

const FAQRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FAQManagementPage />} />
      <Route path="/manage" element={<FAQManagementPage />} />
    </Routes>
  );
};

export default FAQRoutes;
