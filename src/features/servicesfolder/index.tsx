import { Route, Routes } from "react-router-dom"
import ServiceFolderMain from "./components/servicefoldermain"


const ServicesRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<ServiceFolderMain/>} />
   </Routes>
  )
}

export default ServicesRoutes
