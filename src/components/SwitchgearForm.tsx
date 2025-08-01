import React, { useState } from "react";
import { createSwitchgear } from "../api";

interface Props {
  locationId: number;
  onSave: () => void;
}

const SwitchgearForm: React.FC<Props> = ({ locationId, onSave }) => {
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
    try {
      await createSwitchgear({ ...form, locationId });
      onSave();
      setForm({
        swgName: "",
        incomerFeeder: 0,
        outgoingFeeder: 0,
        activeIncomerFeeder: 0,
        activeOutgoingFeeder: 0,
      });
    } catch (error) {
      console.error("Error creating switchgear", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mt-4">
      <h3 className="text-md font-semibold mb-2">Add New Switchgear</h3>
      <input
        name="swgName"
        value={form.swgName}
        onChange={handleChange}
        placeholder="Switchgear Name"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="number"
        name="incomerFeeder"
        value={form.incomerFeeder}
        onChange={handleChange}
        placeholder="Incomer Feeder"
        className="w-full border p-2 mb-2"
      />
      <input
        type="number"
        name="outgoingFeeder"
        value={form.outgoingFeeder}
        onChange={handleChange}
        placeholder="Outgoing Feeder"
        className="w-full border p-2 mb-2"
      />
      <input
        type="number"
        name="activeIncomerFeeder"
        value={form.activeIncomerFeeder}
        onChange={handleChange}
        placeholder="Active Incomer Feeder"
        className="w-full border p-2 mb-2"
      />
      <input
        type="number"
        name="activeOutgoingFeeder"
        value={form.activeOutgoingFeeder}
        onChange={handleChange}
        placeholder="Active Outgoing Feeder"
        className="w-full border p-2 mb-2"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Switchgear
      </button>
    </form>
  );
};

export default SwitchgearForm;
