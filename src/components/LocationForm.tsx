import React, { useState } from "react";
import { createLocation } from "../api";

interface Props {
  onSuccess: () => void;
}

const LocationForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    locationName: "",
    latitude: "",
    longitude: "",
    address: "",
    windMillCount: 0,
    solarPanelCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "windMillCount" || name === "solarPanelCount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLocation(formData);
    onSuccess();
    setFormData({
      locationName: "",
      latitude: "",
      longitude: "",
      address: "",
      windMillCount: 0,
      solarPanelCount: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add Location</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="locationName"
          placeholder="Location Name"
          value={formData.locationName}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="windMillCount"
          placeholder="Wind Mills"
          type="number"
          value={formData.windMillCount}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="solarPanelCount"
          placeholder="Solar Panels"
          type="number"
          value={formData.solarPanelCount}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Location
      </button>
    </form>
  );
};

export default LocationForm;
