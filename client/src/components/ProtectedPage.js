import { Avatar, Badge, message } from "antd";
import React, { useEffect, useState } from "react";
import { GetCurrentUser, RefreshToken } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";
import Notifications from "./Notifications";
import { GetAllNotifications, ReadAllNotifications } from "../apicalls/notifications";

function ProtectedPage({ children }) {
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  //   const [user, setUser] = useState(null);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Function to refresh token periodically
  const refreshTokenPeriodically = async () => {
    try {
      const response = await RefreshToken();
      if (response.success) {
        localStorage.setItem('token', response.data);
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.log('Token refresh failed:', error.message);
    }
  };

  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        // Don't show error message here as it will be handled by axios interceptor
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      // Don't show error message here as it will be handled by axios interceptor
      navigate("/login");
    }
  };
  const getNotifications = async () => {
    try {
      // dispatch(SetLoader(true));
      const response = await GetAllNotifications();
      // dispatch(SetLoader(false));
      if (response.success) {
        setNotifications(response.data);
      } else {
        // Don't throw error here as it will be handled by axios interceptor
        console.log("Failed to get notifications:", response.message);
      }
    } catch (error) {
      // Don't show error message here as it will be handled by axios interceptor
      console.log("Error getting notifications:", error.message);
    }
  };

  const readNotifications=async()=>{
    try{
      // dispatch(SetLoader(true));
      const response=await ReadAllNotifications();
      // dispatch(SetLoader(false));
      if(response.success){
        getNotifications();
      }else{
        // Don't throw error here as it will be handled by axios interceptor
        console.log("Failed to read notifications:", response.message);
      }
    }catch(error){
      // Don't show error message here as it will be handled by axios interceptor
      console.log("Error reading notifications:", error.message);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
      
      // Set up periodic token refresh (every 12 hours)
      const tokenRefreshInterval = setInterval(refreshTokenPeriodically, 12 * 60 * 60 * 1000);
      
      // Cleanup interval on component unmount
      return () => {
        clearInterval(tokenRefreshInterval);
      };
    } else {
      // message.error("Please login to continue");
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-primary p-5">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            OLX
          </h1>

          <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
            <i className="ri-shield-user-line cursor-pointer"></i>
            <span
              className="underline cursor-pointer uppercase"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>
            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() =>{
                readNotifications()
                
                setShowNotifications(true)}}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>
            <i
              className="ri-logout-box-r-line ml-10 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        <div className="p-5">{children}</div>
        {
          <Notifications
            notifications={notifications}
            reloadNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
}

export default ProtectedPage;
