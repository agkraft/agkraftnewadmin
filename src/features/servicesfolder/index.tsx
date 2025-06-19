import { Route, Routes } from "react-router-dom"
import VenueFile from "./components/servicefoldermain"


const ServicesRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<VenueFile/>} />    
   </Routes>
  )
}

export default ServicesRoutes
