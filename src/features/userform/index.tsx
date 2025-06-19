import { Route, Routes } from "react-router-dom"
import Form from "./form"


const FormPageRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<Form/>} />    
   </Routes>
  )
}

export default FormPageRoutes
