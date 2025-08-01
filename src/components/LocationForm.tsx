// src/components/LocationForm.tsx
import React, { useState } from "react";
import axios from "axios";

interface Props {
  onSuccess: () => void;
  editData?: any;
}

const LocationForm: React.FC<Props> = ({ onSuccess, editData }) => {
  const [form, setForm] = useState({
    locationName: editData?.locationName || "",
    latitude: editData?.latitude || "",
    longitude: editData?.longitude || "",
    address: editData?.address || "",
    windMillCount: editData?.windMillCount || 0,
    solarPanelCount: editData?.solarPanelCount || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      await axios.put(
        "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/config",
        { ...form, id: editData.id }
      );
    } else {
      await axios.post(
        "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/config",
        form
      );
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold">{editData ? "Edit" : "Create"} Location</h2>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={(form as any)[key]}
          onChange={handleChange}
          placeholder={key}
          className="w-full p-2 border rounded"
        />
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editData ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default LocationForm;
