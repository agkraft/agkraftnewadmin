import React from 'react';
import { Routes, Route } from 'react-router-dom';
import JobProfileManagementPage from '../pages/JobProfileManagementPage';

const JobProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<JobProfileManagementPage />} />
      <Route path="/manage" element={<JobProfileManagementPage />} />
    </Routes>
  );
};

export default JobProfileRoutes;
