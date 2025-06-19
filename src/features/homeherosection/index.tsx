import { Route, Routes } from "react-router-dom"
import HomeHeroSectionMain from "./componenets/homeherosectionmain"


const HomeHeroRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<HomeHeroSectionMain/>} />    
   </Routes>
  )
}

export default HomeHeroRoutes
