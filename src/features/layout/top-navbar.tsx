import { useState } from "react";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IoSettings } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { User } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth, useUser } from "@/hooks/useAuth";
import { ProfileModal } from "@/components/profile/ProfileModal";

interface TopNavbarProps {
  handleNavbar: () => void;
  navbar: boolean;
}
const TopNavbar: React.FC<TopNavbarProps> = () => {
  const [popUp, setPopUp] = useState(false);
  const { logout } = useAuth();
  const { user, fullName } = useUser();

  const handlePopUp = () => {
    setPopUp(!popUp);
  };

  const handleLogout = () => {
    logout();
    setPopUp(false);
  };
  return (
    <div className="border-b-2 w-full  bg-white p-2">
      <div className="flex items-center justify-between px-5">
        <div className="flex gap-5 items-center">
          <div className=" flex justify-center">
            <img className="h-[50px]" src={logo} alt="" />
          </div>
          {/* <div
            onClick={handleNavbar}
            className=" text-[20px] flex justify-center cursor-pointer"
          >
            <FaBars className="text-[008B8B]" />
          </div> */}
        </div>
        <div className="flex justify-center    gap-3 items-center relative">
          {/* <div>
            <IoMdSettings className="text-xl mt-1" />
          </div> */}
          {/* <div>
            <NotificationsIcon className="" />
          </div> */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              {/* <img className="h-[30px]" src={avthar} alt="" /> */}
              <div className="flex cursor-pointer" onClick={handlePopUp}>
                <p className="font-semibold">
                  {user ? `${user.firstname} ${user.lastname}` : 'Admin'}
                </p>
                <ArrowDropDownIcon className="" />
              </div>
            </div>
          </div>
          {popUp && (
            <div
              className={`z-10 absolute top-[40px] right-14 w-full transition-opacity   rounded-md${
                popUp
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              } ease-in-out duration-300`}
            >
              {/* Adjust position according to your layout */}

              {/* Settings */}

              <div className="flex justify-between gap-2 flex-col bg-white w-fit mx-auto rounded-md p-2 shadow-lg border">
                {/* Profile Option */}
                <ProfileModal>
                  <div className="flex cursor-pointer flex-row rounded-md transition-opacity duration-300 hover:opacity-100 hover:bg-gray-200 p-2">
                    <span className="flex items-center px-2">
                      <User className="w-4 h-4" />
                    </span>
                    <span className="px-2">Profile</span>
                  </div>
                </ProfileModal>

                {/* Settings Option */}
                <div
                  className="flex cursor-pointer flex-row rounded-md transition-opacity duration-300 hover:opacity-100 hover:bg-gray-200 p-2"
                  onClick={() => console.log("Settings clicked")}
                >
                  <span className="flex items-center px-2">
                    <IoSettings className="w-4 h-4" />
                  </span>
                  <span className="px-2">Settings</span>
                </div>

                {/* Logout Option */}
                <div
                  className="flex flex-row rounded-md cursor-pointer transition-opacity duration-300 hover:opacity-100 hover:bg-gray-200 p-2"
                  onClick={handleLogout}
                >
                  <span className="flex justify-center items-center px-2">
                    <IoIosLogOut className="w-4 h-4" />
                  </span>
                  <span className="px-2">Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
