import apiClient from "./client";

export const registerUser = async (data) => {
  const response = await apiClient.post("/register/", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await apiClient.post("/login/", data);
  return response.data;
};

export const refreshAccessToken = async (refresh) => {
  const response = await apiClient.post("/token/refresh/", {
    refresh,
  });

  return response.data;
};