import { Route, Routes } from "react-router-dom"
import TeamPage from "./routes/team"

const TeamRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<TeamPage/>} />
   </Routes>
  )
}

export default TeamRoutes
