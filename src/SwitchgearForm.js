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
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
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
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(50,50,50,0.06)",
        padding: 24,
        maxWidth: 380,
        width: "100%"
      }}
    >
      <h3>{isEdit ? "Edit" : "Add"} Switchgear</h3>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="swgName">Switchgear Name</label>
        <input
          id="swgName"
          name="swgName"
          value={form.swgName}
          onChange={handleChange}
          placeholder="Name"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="incomerFeeder">Incomer Feeder</label>
        <input
          id="incomerFeeder"
          name="incomerFeeder"
          type="number"
          value={form.incomerFeeder}
          onChange={handleChange}
          placeholder="Incomer Feeder"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="outgoingFeeder">Outgoing Feeder</label>
        <input
          id="outgoingFeeder"
          name="outgoingFeeder"
          type="number"
          value={form.outgoingFeeder}
          onChange={handleChange}
          placeholder="Outgoing Feeder"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="activeIncomerFeeder">Active Incomer Feeder</label>
        <input
          id="activeIncomerFeeder"
          name="activeIncomerFeeder"
          type="number"
          value={form.activeIncomerFeeder}
          onChange={handleChange}
          placeholder="Active Incomer Feeder"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="activeOutgoingFeeder">Active Outgoing Feeder</label>
        <input
          id="activeOutgoingFeeder"
          name="activeOutgoingFeeder"
          type="number"
          value={form.activeOutgoingFeeder}
          onChange={handleChange}
          placeholder="Active Outgoing Feeder"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="locationId">Location ID</label>
        <input
          id="locationId"
          name="locationId"
          type="number"
          value={form.locationId}
          onChange={handleChange}
          placeholder="Location ID"
          readOnly={!!switchgear.locationId}
          style={{
            width: "100%",
            backgroundColor: switchgear.locationId ? "#f0f0f0" : "white"
          }}
        />
      </div>

      <button type="submit" style={{ marginRight: 8 }}>
        {isEdit ? "Update" : "Create"}
      </button>
      <button type="button" onClick={onBack}>
        Back
      </button>
    </form>
  );
}

export default SwitchgearForm;
