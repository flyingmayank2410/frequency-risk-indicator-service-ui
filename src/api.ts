import axios from "axios";

const BASE_URL = "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1";

// 📍 Location APIs
export const getLocations = async () => {
  const response = await axios.get(`${BASE_URL}/location/all`);
  return response.data;
};

export const createLocation = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/location`, data);
  return response.data;
};

// 🔌 Switchgear APIs
export const getSwitchgears = async (locationId: number) => {
  const response = await axios.get(`${BASE_URL}/swg/loc/${locationId}`);
  return response.data;
};

export const createSwitchgear = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/swg`, data);
  return response.data;
};

// 📈 Graph API
export const getGraphData = async (locationId: number) => {
  const response = await axios.get(`${BASE_URL}/graph`, {
    params: {
      locationId,
      days: 3,
    },
  });
  return response.data;
};
