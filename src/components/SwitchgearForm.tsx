// src/components/SwitchgearForm.tsx
import React, { useState } from "react";
import { createSwitchgear } from "../api";

interface Props {
  locationId: number | null;
  onRefresh: () => void;
}

const SwitchgearForm: React.FC<Props> = ({ locationId, onRefresh }) => {
  const [form, setForm] = useState({
    swgName: "",
    incomerFeeder: 0,
    outgoingFeeder: 0,
    activeIncomerFeeder: 0,
    activeOutgoingFeeder: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) {
      alert("Please select a location first.");
      return;
    }

    try {
      await createSwitchgear({
        ...form,
        incomerFeeder: +form.incomerFeeder,
        outgoingFeeder: +form.outgoingFeeder,
        activeIncomerFeeder: +form.activeIncomerFeeder,
        activeOutgoingFeeder: +form.activeOutgoingFeeder,
        locationId,
      });
      alert("Switchgear created successfully");
      setForm({
        swgName: "",
        incomerFeeder: 0,
        outgoingFeeder: 0,
        activeIncomerFeeder: 0,
        activeOutgoingFeeder: 0,
      });
      onRefresh();
    } catch (error) {
      alert("Error creating switchgear");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 mt-4">
      <h3 className="font-semibold text-md mb-2">Create Switchgear</h3>
      {["swgName", "incomerFeeder", "outgoingFeeder", "activeIncomerFeeder", "activeOutgoingFeeder"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={(form as any)[field]}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      ))}
      <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
        Add
      </button>
    </form>
  );
};

export default SwitchgearForm;
