import React, { useState, useEffect } from "react";

function LocationForm({ location, onRefresh, onAddSwitchgear }) {
  const isEdit = !!location.id;
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
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
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
    <form onSubmit={handleSubmit} style={{
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(50,50,50,0.06)",
      padding: 24,
      maxWidth: 380,
      width: "100%"
    }}>
      <h3>{isEdit ? "Edit" : "Add"} Location</h3>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="locationName">Location Name</label>
        <input id="locationName" name="locationName" value={form.locationName} onChange={handleChange} placeholder="Name" style={{width:"100%"}} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="latitude">Latitude</label>
        <input id="latitude" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" style={{width:"100%"}} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="longitude">Longitude</label>
        <input id="longitude" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" style={{width:"100%"}} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="address">Address</label>
        <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Address" style={{width:"100%"}} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="windMillCount">Wind Mill Count</label>
        <input id="windMillCount" name="windMillCount" type="number" value={form.windMillCount} onChange={handleChange} placeholder="Wind Mill Count" style={{width:"100%"}} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="solarPanelCount">Solar Panel Count</label>
        <input id="solarPanelCount" name="solarPanelCount" type="number" value={form.solarPanelCount} onChange={handleChange} placeholder="Solar Panel Count" style={{width:"100%"}} />
      </div>
      <button type="submit" style={{marginRight:8}}>
        {isEdit ? "Update" : "Create"}
      </button>
      {isEdit && (
        <button type="button" onClick={onAddSwitchgear}>+ Add Switchgear</button>
      )}
    </form>
  );
}

export default LocationForm;
