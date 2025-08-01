// src/api.ts
import axios from "axios";

const BASE_URL = "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1";

export const getAllLocations = () =>
  axios.get(`${BASE_URL}/location/all`);

export const createLocation = (payload: any) =>
  axios.post(`${BASE_URL}/location`, payload);

export const updateLocation = (id: number, payload: any) =>
  axios.put(`${BASE_URL}/location/${id}`, payload);

export const getSwitchgearsByLocation = (locationId: number) =>
  axios.get(`${BASE_URL}/swg/loc/${locationId}`);

export const createSwitchgear = (payload: any) =>
  axios.post(`${BASE_URL}/swg`, payload);

export const updateSwitchgear = (id: number, payload: any) =>
  axios.put(`${BASE_URL}/swg/${id}`, payload);

export const getGraphData = (locationId: number, days = 3) =>
  axios.get(`${BASE_URL}/graph`, {
    params: { locationId, days },
  });
