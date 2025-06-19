import { Route, Routes } from "react-router-dom"
import GallaryMain from "./components/gallarymain"


const GallaryRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<GallaryMain/>} />    
   </Routes>
  )
}

export default GallaryRoutes
