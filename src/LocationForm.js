import React, { useState, useEffect } from "react";

function LocationForm({ location, onRefresh, onAddSwitchgear }) {
  const isEdit = !!location?.id;
  const [form, setForm] = useState({
    locationName: "",
    latitude: "",
    longitude: "",
    address: "",
    windMillCount: 0,
    solarPanelCount: 0,
  });

  useEffect(() => {
    if (location && location.id) {
      fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/config/${location.id}`)
        .then(res => res.json())
        .then(response => {
          if (response && response.data && typeof response.data === "object") {
            setForm(response.data);
          }
        })
        .catch(() => setForm(location));
    } else if (location) {
      setForm(location);
    }
  }, [location]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/config", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data && typeof response.data === "object") {
          onRefresh && onRefresh();
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
      <h3 style={{ color: "#fff" }}>{isEdit ? "Edit" : "Add"} Location</h3>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="locationName" style={{ color: "#fff" }}>
          Location Name
        </label>
        <input
          id="locationName"
          name="locationName"
          value={form.locationName}
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
        <label htmlFor="latitude" style={{ color: "#fff" }}>
          Latitude
        </label>
        <input
          id="latitude"
          name="latitude"
          value={form.latitude}
          onChange={handleChange}
          placeholder="Latitude"
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
        <label htmlFor="longitude" style={{ color: "#fff" }}>
          Longitude
        </label>
        <input
          id="longitude"
          name="longitude"
          value={form.longitude}
          onChange={handleChange}
          placeholder="Longitude"
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
        <label htmlFor="address" style={{ color: "#fff" }}>
          Address
        </label>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
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
        <label htmlFor="windMillCount" style={{ color: "#fff" }}>
          Wind Mill Count
        </label>
        <input
          id="windMillCount"
          name="windMillCount"
          type="number"
          value={form.windMillCount}
          onChange={handleChange}
          placeholder="Wind Mill Count"
          min={0}
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
        <label htmlFor="solarPanelCount" style={{ color: "#fff" }}>
          Solar Panel Count
        </label>
        <input
          id="solarPanelCount"
          name="solarPanelCount"
          type="number"
          value={form.solarPanelCount}
          onChange={handleChange}
          placeholder="Solar Panel Count"
          min={0}
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
      {isEdit && (
        <button
          type="button"
          onClick={onAddSwitchgear}
          style={{
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          + Add Switchgear
        </button>
      )}
    </form>
  );
}

export default LocationForm;
