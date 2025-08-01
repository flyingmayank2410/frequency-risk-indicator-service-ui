import React, { useState } from "react";
import { createLocation } from "../api";

interface Props {
  onSave: () => void;
}

const LocationForm: React.FC<Props> = ({ onSave }) => {
  const [form, setForm] = useState({
    locationName: "",
    latitude: "",
    longitude: "",
    address: "",
    windMillCount: 0,
    solarPanelCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLocation(form);
      onSave();
      setForm({
        locationName: "",
        latitude: "",
        longitude: "",
        address: "",
        windMillCount: 0,
        solarPanelCount: 0,
      });
    } catch (error) {
      console.error("Error creating location", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h3 className="text-md font-semibold mb-2">Add New Location</h3>
      <input
        name="locationName"
        value={form.locationName}
        onChange={handleChange}
        placeholder="Location Name"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="latitude"
        value={form.latitude}
        onChange={handleChange}
        placeholder="Latitude"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="longitude"
        value={form.longitude}
        onChange={handleChange}
        placeholder="Longitude"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="number"
        name="windMillCount"
        value={form.windMillCount}
        onChange={handleChange}
        placeholder="Wind Mill Count"
        className="w-full border p-2 mb-2"
      />
      <input
        type="number"
        name="solarPanelCount"
        value={form.solarPanelCount}
        onChange={handleChange}
        placeholder="Solar Panel Count"
        className="w-full border p-2 mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Location
      </button>
    </form>
  );
};

export default LocationForm;
