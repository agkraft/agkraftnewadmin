import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CareerManagementPage from '../pages/CareerManagementPage';

const CareerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CareerManagementPage />} />
      <Route path="/manage" element={<CareerManagementPage />} />
    </Routes>
  );
};

export default CareerRoutes;
