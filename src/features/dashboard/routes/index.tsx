import { Route, Routes } from "react-router-dom";
import DashboardPage from "@/features/dashboard/routes/dashboard-page";


export const DashboardPageRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    )
}