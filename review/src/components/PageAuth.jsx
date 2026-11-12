import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../store/store";

const PageAuth = () => {
  const isLogin = useStore((state) => state.isLogin);
  const user = useStore((state) => state.userData);
  // const token = useStore((state) => state.token);
  const token = localStorage.getItem("udsToken");

  console.log(token, "dasdsa");
  const urlPath = useLocation();
  const navigate = useNavigate();
  const pathSegments = urlPath.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  useEffect(() => {
    if (!isLogin && !token) {
      navigate("/adminlogin");
    } else {
      navigate("/dashboard");
    }
  }, [isLogin, token]);
  return null;
};

export default PageAuth;
