import { Route, Routes } from "react-router-dom"
import RatereviewMain from "./components/RatereviewMain"


const RateReviewRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<RatereviewMain/>} />    
   </Routes>
  )
}

export default RateReviewRoutes
