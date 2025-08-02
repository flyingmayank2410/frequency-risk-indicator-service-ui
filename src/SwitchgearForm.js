import React, { useState, useEffect } from "react";

function SwitchgearForm({ switchgear, onRefresh, onBack }) {
  const isEdit = !!switchgear.swgId;
  const [form, setForm] = useState({
    swgName: "",
    incomerFeeder: 0,
    outgoingFeeder: 0,
    activeIncomerFeeder: 0,
    activeOutgoingFeeder: 0,
    locationId: switchgear.locationId || "",
  });

  useEffect(() => {
    if (isEdit && switchgear.swgId) {
      fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/config/${switchgear.swgId}`)
        .then(res => res.json())
        .then(response => {
          if (response && response.data && typeof response.data === "object") {
            setForm(response.data);
          }
        })
        .catch(() => setForm(switchgear));
    } else if (switchgear) {
      setForm(switchgear);
    }
  }, [switchgear, isEdit]);

  function handleChange(e) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/config", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data && typeof response.data === "object") {
          onRefresh && onRefresh();
          onBack && onBack();
        }
      })
      .catch(() => {});
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEdit ? "Edit" : "Add"} Switchgear</h3>
      <input name="swgName" value={form.swgName} onChange={handleChange} placeholder="Name" />
      <input name="incomerFeeder" type="number" value={form.incomerFeeder} onChange={handleChange} placeholder="Incomer Feeder" />
      <input name="outgoingFeeder" type="number" value={form.outgoingFeeder} onChange={handleChange} placeholder="Outgoing Feeder" />
      <input name="activeIncomerFeeder" type="number" value={form.activeIncomerFeeder} onChange={handleChange} placeholder="Active Incomer Feeder" />
      <input name="activeOutgoingFeeder" type="number" value={form.activeOutgoingFeeder} onChange={handleChange} placeholder="Active Outgoing Feeder" />
      <input
        name="locationId"
        type="number"
        value={form.locationId}
        onChange={handleChange}
        placeholder="Location Id"
        readOnly={!!switchgear.locationId}
      />
      <button type="submit">{isEdit ? "Update" : "Create"}</button>
      <button type="button" onClick={onBack}>Back</button>
    </form>
  );
}

export default SwitchgearForm;
