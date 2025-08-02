import React, { useState, useEffect } from "react";

function SwitchgearForm({ switchgear, onRefresh, onBack }) {
  const isEdit = !!switchgear?.swgId;
  const [form, setForm] = useState({
    swgName: "",
    incomerFeeder: 0,
    outgoingFeeder: 0,
    activeIncomerFeeder: 0,
    activeOutgoingFeeder: 0,
    locationId: switchgear?.locationId || "",
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
    setForm(f => ({ ...f, [name]: value }));
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
        background: "#111",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.26)",
        padding: 24,
        maxWidth: 380,
        width: "100%",
        color: "#fff",
      }}
    >
      <h3 style={{ color: "#fff" }}>{isEdit ? "Edit" : "Add"} Switchgear</h3>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="swgName" style={{ color: "#fff" }}>
          Switchgear Name
        </label>
        <input
          id="swgName"
          name="swgName"
          value={form.swgName}
          onChange={handleChange}
          placeholder="Name"
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
          required
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="incomerFeeder" style={{ color: "#fff" }}>
          Incomer Feeder
        </label>
        <input
          id="incomerFeeder"
          name="incomerFeeder"
          type="number"
          min="0"
          value={form.incomerFeeder}
          onChange={handleChange}
          placeholder="Incomer Feeder"
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="outgoingFeeder" style={{ color: "#fff" }}>
          Outgoing Feeder
        </label>
        <input
          id="outgoingFeeder"
          name="outgoingFeeder"
          type="number"
          min="0"
          value={form.outgoingFeeder}
          onChange={handleChange}
          placeholder="Outgoing Feeder"
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="activeIncomerFeeder" style={{ color: "#fff" }}>
          Active Incomer Feeder
        </label>
        <input
          id="activeIncomerFeeder"
          name="activeIncomerFeeder"
          type="number"
          min="0"
          value={form.activeIncomerFeeder}
          onChange={handleChange}
          placeholder="Active Incomer Feeder"
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="activeOutgoingFeeder" style={{ color: "#fff" }}>
          Active Outgoing Feeder
        </label>
        <input
          id="activeOutgoingFeeder"
          name="activeOutgoingFeeder"
          type="number"
          min="0"
          value={form.activeOutgoingFeeder}
          onChange={handleChange}
          placeholder="Active Outgoing Feeder"
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="locationId" style={{ color: "#fff" }}>
          Location ID
        </label>
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
            backgroundColor: switchgear.locationId ? "#333" : "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "8px",
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          marginRight: 8,
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        {isEdit ? "Update" : "Create"}
      </button>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </form>
  );
}

export default SwitchgearForm;
