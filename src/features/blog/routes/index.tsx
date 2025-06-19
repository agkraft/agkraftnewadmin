import { Route, Routes } from "react-router-dom"

import Blog from "./blog"
import AddBlog from "../components/table/add-blog"


const BlogPageRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<Blog/>} />
    <Route path="/add-blog" element={<AddBlog/>} />
    
   </Routes>
  )
}

export default BlogPageRoutes
