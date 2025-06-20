import { Route, Routes } from "react-router-dom";
import ContactPage from "./contact";

const ContactRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ContactPage />} />
    </Routes>
  );
};

export default ContactRoutes;
