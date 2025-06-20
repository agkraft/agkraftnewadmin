import { Route, Routes } from "react-router-dom"

import Blog from "./blog"
import AddBlogPage from "../pages/AddBlogPage"
import EditBlogPage from "../pages/EditBlogPage"
import ViewBlogPage from "../pages/ViewBlogPage"


const BlogPageRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<Blog/>} />
    <Route path="/add" element={<AddBlogPage/>} />
    <Route path="/edit/:id" element={<EditBlogPage/>} />
    <Route path="/view/:id" element={<ViewBlogPage/>} />
   </Routes>
  )
}

export default BlogPageRoutes
