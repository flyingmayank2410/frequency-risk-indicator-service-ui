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
      // Fetch full location details just in case
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
    <form onSubmit={handleSubmit}>
      <h3>{isEdit ? "Edit" : "Add"} Location</h3>
      <input name="locationName" value={form.locationName} onChange={handleChange} placeholder="Name" />
      <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" />
      <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
      <input name="windMillCount" type="number" value={form.windMillCount} onChange={handleChange} placeholder="Wind Mill Count" />
      <input name="solarPanelCount" type="number" value={form.solarPanelCount} onChange={handleChange} placeholder="Solar Panel Count" />
      <button type="submit">{isEdit ? "Update" : "Create"}</button>
      {isEdit && (
        <button type="button" onClick={onAddSwitchgear}>+ Add Switchgear</button>
      )}
    </form>
  );
}

export default LocationForm;
