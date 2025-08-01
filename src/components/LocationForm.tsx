// src/components/LocationForm.tsx
import React, { useState } from "react";
import { createLocation } from "../api";

interface Props {
  onRefresh: () => void;
}

const LocationForm: React.FC<Props> = ({ onRefresh }) => {
  const [form, setForm] = useState({
    locationName: "",
    latitude: "",
    longitude: "",
    address: "",
    windMillCount: 0,
    solarPanelCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLocation({ ...form, windMillCount: +form.windMillCount, solarPanelCount: +form.solarPanelCount });
      alert("Location created successfully");
      setForm({
        locationName: "",
        latitude: "",
        l
