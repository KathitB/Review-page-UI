import axiosInstance from "./axiosInstance";

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("/api/users/login", payload);

  localStorage.setItem("token", data?.session?.token);

  return data;
};
