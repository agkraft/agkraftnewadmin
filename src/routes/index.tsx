import {router} from "@/routes/router";
import { RouterProvider } from "react-router-dom";

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
}