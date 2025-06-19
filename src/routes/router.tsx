import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import AdminDashboard from "@/features/dashboard/routes/dashboard-page";
import DashboardPage from "@/features/layout/dashboard-layout";
import BlogPageRoutes from "@/features/blog/routes/index";
import Form from "@/features/userform/index";
// import CareerFormPage from "@/features/careerform/index";
import VenuesRoutes from "@/features/venues";
import GallaryRoutes from "@/features/gallary";
import ServicesRoutes from "@/features/servicesfolder";
import HomeHeroRoutes from "@/features/homeherosection";
import RateReviewRoutes from "@/features/RaviewRate";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<DashboardPage />}>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard Route */}
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/form/*" element={<Form />} />
      <Route path="/blog/*" element={<BlogPageRoutes />} />
      {/* <Route path="/careerform/*" element={<CareerFormPage />} /> */}
      <Route path="/venues/*" element={<VenuesRoutes />} /> 
      <Route path="/gallary/*" element={<GallaryRoutes />} /> 
      <Route path="/services/*" element={<ServicesRoutes />} />
      <Route path="/herosection/*" element={<HomeHeroRoutes />} /> 
      <Route path="/rate-review/*" element={<RateReviewRoutes />} />
    </Route>
  )
);
