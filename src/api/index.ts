import axios from "axios";

const BASE_URL = "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1";

export const getAllLocations = async () => {
  const res = await axios.get(`${BASE_URL}/location/all`);
  return res.data;
};

export const getSwitchgearsByLocation = async (locationId: number) => {
  const res = await axios.get(`${BASE_URL}/swg/loc/${locationId}`);
  return res.data;
};

export const getGraphData = async (locationId: number) => {
  const res = await axios.get(`${BASE_URL}/graph`, {
    params: {
      locationId,
      days: 3,
    },
  });
  return res.data;
};