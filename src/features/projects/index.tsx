import { Route, Routes } from "react-router-dom"
import ProjectFolderMain from "./components/projectfoldermain"

const ProjectsRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<ProjectFolderMain/>} />
   </Routes>
  )
}

export default ProjectsRoutes
