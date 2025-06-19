import { Route, Routes } from "react-router-dom"
import VenueFile from "./components/venuefile"


const VenuesRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<VenueFile/>} />    
   </Routes>
  )
}

export default VenuesRoutes
