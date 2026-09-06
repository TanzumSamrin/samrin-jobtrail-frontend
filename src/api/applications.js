import apiClient from "./client";

export const getApplications = async (params = {}) => {
  const response = await apiClient.get("/applications/", {
    params,
  });

  return response.data;
};

export const getApplication = async (id) => {
  const response = await apiClient.get(`/applications/${id}/`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await apiClient.post("/applications/", data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await apiClient.patch(
    `/applications/${id}/`,
    data
  );

  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await apiClient.delete(
    `/applications/${id}/`
  );

  return response.data;
};

export const getStatistics = async () => {
  const response = await apiClient.get("/stats/");
  return response.data;
};