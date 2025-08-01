// src/App.tsx
import React, { useEffect, useState } from "react";
import TreeView from "./components/TreeView";
import GraphPanel from "./components/GraphPanel";
import LocationForm from "./components/LocationForm";
import SwitchgearForm from "./components/SwitchgearForm";
import { getAllLocations, getSwitchgearsByLocation } from "./api";

interface Location {
  id: number;
  locationName: string;
}

interface Switchgear {
  swgId: number;
  swgName: string;
}

const App: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [switchgears, setSwitchgears] = useState<Record<number, Switchgear[]>>({});
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const fetchData = async () => {
    const locRes = await getAllLocations();
    const locs = locRes?.data?.data || [];
    setLocations(locs);

    const swgMap: Record<number, Switchgear[]> = {};
    await Promise.all(
      locs.map(async (loc: any) => {
        const swgRes = await getSwitchgearsByLocation(loc.id);
        swgMap[loc.id] = swgRes?.data?.data || [];
      })
    );
    setSwitchgears(swgMap);
  };

  useEffect(() => {
    fetchData();
  }
