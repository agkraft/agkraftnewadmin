import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import TopNavbar from "./top-navbar";
import { FaBlog } from "react-icons/fa";
import { House } from "lucide-react";
import { FaWpforms } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { FaPhotoFilm } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuImages } from "react-icons/lu";

import { MessageSquare, HelpCircle, Users, Briefcase } from "lucide-react";

type MenuItem = {
  name: string;
  path: string;
  icon: JSX.Element;
  children: MenuItem[];
};

const items: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: <House />,
    children: [],
  },
  // {
  //   name: "Form",
  //   path: "/form",
  //   icon: <FaWpforms />,
  //   children: [],
  // },
  {
    name: "Projects",
    path: "/projects",
    icon: <FaHotel />,
    children: [],
  },
  {
    name: "Blog",
    path: "/blog",
    icon: <FaBlog />,
    children: [],
  },
  {
    name: "Teams",
    path: "/teams",
    icon: <FaPhotoFilm />,
    children: [],
  },

  {
    name: "Services",
    path: "/services",
    icon: <IoSettingsOutline />,
    children: [],
  },
  {
    name: "FAQs",
    path: "/faqs",
    icon: <HelpCircle />,
    children: [],
  },
  {
    name: "Contact Us",
    path: "/contact",
    icon: <MessageSquare />,
    children: [],
  },
  {
    name: "Post Comments",
    path: "/post-comments",
    icon: <MessageSquare />,
    children: [],
  },
  {
    name: "Careers",
    path: "/careers",
    icon: <Users />,
    children: [],
  },
  {
    name: "Job Profiles",
    path: "/job-profiles",
    icon: <Briefcase />,
    children: [],
  },
  {
    name: "API Test",
    path: "/api-test",
    icon: <MessageSquare />,
    children: [],
  },

];

const DashboardPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState<number | null>(null);
  const [subOpen, setSubOpen] = useState<number | null>(null);
  const [subsubOpen, setSubSubOpen] = useState<number | null>(null);
  const [navbar, setNavbar] = useState(false);

  const handleNavbar = () => {
    setNavbar(!navbar);
  };
  const handleOpen = (index: number) => setOpen(open === index ? null : index);
  const handleSubOpen = (index: number) =>
    setSubOpen(subOpen === index ? null : index);

  const handleSubSubOpen = (index: number) =>
    setSubSubOpen(subsubOpen === index ? null : index);
  console.log(currentPath);
  return (
    <div className="w-full max-h-screen flex bg-[#f7f7f7]">
      <div className="w-full">
        <TopNavbar handleNavbar={handleNavbar} navbar={navbar} />
        <div className="h-[calc(100vh-75px)] flex">
          <div className="h-[calc(100vh-68px)] bg-white border-r">
            <div
              className={`h-full group shadow-2xl p-2 overflow-y-scroll w-[250px] 
               items-start flex flex-col justify-start gap-2  `}
            >
              <div className="mt-2 px-2 border-b w-full">
                <h1 className="text-[13px]">Main</h1>
              </div>
              {items.map((folder, index) => {
                const isActive =
                  currentPath === folder?.path ||
                  folder.children?.some((subFolder) =>
                    currentPath.startsWith(subFolder?.path ?? "")
                  );

                return (
                  <div key={index} className="w-full">

                    {folder.path ? (
                      <Link
                        to={folder?.path}
                        className={`px-2 flex w-full justify-center items-center py-2 rounded-md cursor-pointer gap-4 ${isActive
                            ? "bg-[#008B8B] text-white"
                            : "hover:bg-[#F5F5DC] hover:text-[#008B8B]  "
                          }`}
                        onClick={() => handleOpen(index)}
                      >

                        <div className="text-[25px]">{folder.icon}</div>
                        <div
                          className={`w-full dashboard-text flex justify-between 
                          group-hover:visible group-hover:flex animate-fade-in`}
                        >
                          <div>{folder.name}</div>
                          {/* <div>
                            {open === index ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <ArrowRightIcon />
                            )}
                          </div> */}
                        </div>
                      </Link>
                    ) : (
                      <div
                        className={`px-2 text-black flex w-full justify-center items-center py-2 rounded-md cursor-pointer gap-4 ${isActive
                            ? "bg-[#008B8B] text-white"
                            : "hover:bg-violet-200  hover:text-violet-700  "
                          }`}
                        onClick={() => handleOpen(index)}
                      >
                        {" "}
                        <div className="text-[25px]">{folder.icon}</div>
                        <div
                          className={`w-full dashboard-text flex justify-between font-bold ${navbar ? "block visible" : "hidden invisible"
                            } group-hover:visible group-hover:flex animate-fade-in`}
                        >
                          <div>{folder.name}</div>
                          <div>
                            {open === index ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <ArrowRightIcon />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {open === index && (
                      <div
                        className={`w-full pl-4 ${navbar ? "block visible" : "hidden invisible"
                          } group-hover:visible group-hover:block animate-fade-in`}
                      >
                        {folder?.children?.map((subFolder, subIndex) => {
                          const isSubFolderActive = currentPath.startsWith(
                            subFolder?.path ?? ""
                          );

                          return (
                            <div key={subIndex} className="mt-2 ">
                              <div
                                className={`flex justify-start p-2 rounded items-center cursor-pointer gap-4 ${isSubFolderActive
                                    ? "bg-gray-200 text-black "
                                    : " text-black "
                                  }`}
                                onClick={() => handleSubOpen(subIndex)}
                              >
                                <div className="text-[20px] text-black ">
                                  {subFolder.icon}
                                </div>
                                <div className="flex items-center w-full justify-between gap-2 pl-2">
                                  {subFolder.path ? (
                                    <NavLink
                                      to={subFolder.path}
                                      className={({ isActive }) =>
                                        isActive
                                          ? "bg-gray-200 text-black  "
                                          : "hover:text-[#008B8B]"
                                      }
                                    >
                                      {subFolder.name}
                                    </NavLink>
                                  ) : (
                                    <div>{subFolder.name}</div>
                                  )}
                                  <div className="">
                                    {subOpen === subIndex ? (
                                      <ArrowDropDownIcon />
                                    ) : (
                                      <ArrowRightIcon className="" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              {subOpen === subIndex &&
                                subFolder?.children?.length > 0 && (
                                  <div className="mt-2 pl-6">
                                    {subFolder?.children.map(
                                      (subSubFolder, subSubIndex) => {
                                        const isSubSubFolderActive =
                                          currentPath === subSubFolder?.path;
                                        return (
                                          <NavLink
                                            onClick={() =>
                                              handleSubSubOpen(subSubIndex)
                                            }
                                            key={subSubIndex}
                                            to={subSubFolder?.path}
                                            className={`flex pl-2 hover:text-[#FFD700] mb-1 rounded items-center gap-2 ${isSubSubFolderActive
                                                ? " bg-red-300 text-white "
                                                : " text-red-300"
                                              }`}
                                          >
                                            <div className="text-[18px]">
                                              {subSubFolder?.icon}
                                            </div>
                                            {subSubFolder?.name}
                                          </NavLink>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="overflow-y-scroll w-[calc(100vw-50px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
