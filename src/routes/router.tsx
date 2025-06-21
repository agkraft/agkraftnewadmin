import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import AdminDashboard from "@/features/dashboard/routes/dashboard-page";
import DashboardPage from "@/features/layout/dashboard-layout";
import BlogPageRoutes from "@/features/blog/routes/index";
import Form from "@/features/userform/index";
// import CareerFormPage from "@/features/careerform/index";
import ProjectsRoutes from "@/features/projects";
import ServicesRoutes from "@/features/servicesfolder";
import HomeHeroRoutes from "@/features/homeherosection";
import RateReviewRoutes from "@/features/RaviewRate";
import TeamRoutes from "@/features/teams";
import ContactRoutes from "@/features/contact/routes";
import FAQRoutes from "@/features/faqs/routes";
import JobProfileRoutes from "@/features/jobProfiles/routes";
import CareerRoutes from "@/features/careers/routes";
import PostCommentRoutes from "@/features/postComments/routes";
import ApiTestPage from "@/features/test/ApiTestPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { PrivateRoute, PublicRoute } from "@/components/auth";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes - Only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Private Routes - Only accessible when logged in */}
      <Route
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      >
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/form/*" element={<Form />} />
        <Route path="/blog/*" element={<BlogPageRoutes />} />
        {/* <Route path="/careerform/*" element={<CareerFormPage />} /> */}
        <Route path="/projects/*" element={<ProjectsRoutes />} />
        <Route path="/teams/*" element={<TeamRoutes />} />
        <Route path="/services/*" element={<ServicesRoutes />} />
        <Route path="/herosection/*" element={<HomeHeroRoutes />} />
        <Route path="/rate-review/*" element={<RateReviewRoutes />} />
        <Route path="/contact/*" element={<ContactRoutes />} />
        <Route path="/faqs/*" element={<FAQRoutes />} />
        <Route path="/job-profiles/*" element={<JobProfileRoutes />} />
        <Route path="/careers/*" element={<CareerRoutes />} />
        <Route path="/post-comments/*" element={<PostCommentRoutes />} />
        <Route path="/api-test" element={<ApiTestPage />} />
      </Route>

      {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )
);
