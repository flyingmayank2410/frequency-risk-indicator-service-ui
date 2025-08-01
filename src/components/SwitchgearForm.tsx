import React, { useState } from "react";
import axios from "axios";

interface Props {
  locationId: number;
  onSuccess: () => void;
  editData?: any;
}

const SwitchgearForm: React.FC<Props> = ({ locationId, onSuccess, editData }) => {
  const [form, setForm] = useState({
    swgName: editData?.swgName || "",
    incomerFeeder: editData?.incomerFeeder || 0,
    outgoingFeeder: editData?.outgoingFeeder || 0,
    activeIncomerFeeder: editData?.activeIncomerFeeder || 0,
    activeOutgoingFeeder: editData?.activeOutgoingFeeder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, locationId };

    if (editData) {
      await axios.put(
        "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/config",
        { ...payload, swgId: editData.swgId }
      );
    } else {
      await axios.post(
        "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/config",
        payload
      );
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold">{editData ? "Edit" : "Add"} Switchgear</h2>
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
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editData ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default SwitchgearForm;
