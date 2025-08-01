import axios from "axios";

const BASE_URL = "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1";

export const getLocations = async () => {
  return axios.get(`${BASE_URL}/location/all`);
};

export const createLocation = async (locationData: any) => {
  return axios.post(`${BASE_URL}/location`, locationData);
};

export const updateLocation = async (id: number, locationData: any) => {
  return axios.put(`${BASE_URL}/location/${id}`, locationData);
};

export const getSwitchgearsByLocation = async (locationId: number) => {
  return axios.get(`${BASE_URL}/swg/loc/${locationId}`);
};

export const createSwitchgear = async (data: any) => {
  return axios.post(`${BASE_URL}/swg`, data);
};

export const updateSwitchgear = async (swgId: number, data: any) => {
  return axios.put(`${BASE_URL}/swg/${swgId}`, data);
};

export const getGraphData = async (locationId: number) => {
  return axios.get(`${BASE_URL}/graph?locationId=${locationId}&days=3`);
};
