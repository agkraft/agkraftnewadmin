import { Route, Routes } from "react-router-dom";
import ManageUser from "../ManageUser";
import CustomProfile from "../customProfile";
import { Manageverfication } from "../ManageVerfication";
import ManageMonetizationRequests from "../ManageMonetization";

const UserRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/manage-user" element={<ManageUser />} />
                <Route path="/custom-profile-fields" element={<CustomProfile />} />
                <Route path="/verification-request" element={<Manageverfication />} />
                <Route path="/monetization-request" element={<ManageMonetizationRequests />} />
            </Routes>
        </>
    );
};

export default UserRoutes;
