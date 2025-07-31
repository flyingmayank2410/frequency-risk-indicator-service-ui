// src/App.tsx
import React, { useEffect, useState } from "react";
import TreeView from "./components/TreeView";
import GraphPanel from "./components/GraphPanel";
import LocationForm from "./components/LocationForm";
import SwitchgearForm from "./components/SwitchgearForm";
import { getAllLocations, getSwitchgearsByLocation } from "./api";

export default function App() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showSwitchgearForm, setShowSwitchgearForm] = useState(false);

  useEffect(() => {
  fetchLocations();
}, []);

const fetchLocations = async () => {
  const res = await getAllLocations();
  const updated = await Promise.all(
    res.map(async (loc: any) => {
      const swgs = await getSwitchgearsByLocation(loc.id);
      return { ...loc, switchgears: swgs };
    })
  );
  console.log("Loaded locations:", updated); // ✅ DEBUG LINE
  setLocations(updated);
};


  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Locations</h2>
          <button
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
            onClick={() => setShowLocationForm(true)}
          >
            + Add
          </button>
        </div>
        <TreeView
          locations={locations}
          onLocationClick={(id) => setSelectedLocationId(id)}
        />
        {selectedLocationId && (
          <div className="mt-4">
            <button
              className="bg-green-600 text-white px-3 py-1 text-sm rounded"
              onClick={() => setShowSwitchgearForm(true)}
            >
              + Add Switchgear
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        {selectedLocationId ? (
          <GraphPanel locationId={selectedLocationId} />
        ) : (
          <p className="text-gray-500">Select a location to view graphs</p>
        )}
      </div>

      {/* Location Modal */}
      {showLocationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-1/2">
            <LocationForm onSuccess={() => {
              setShowLocationForm(false);
              fetchLocations();
            }} />
            <button
              className="mt-2 text-sm text-gray-600 hover:underline"
              onClick={() => setShowLocationForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Switchgear Modal */}
      {showSwitchgearForm && selectedLocationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-1/2">
            <SwitchgearForm
              locationId={selectedLocationId}
              onSuccess={() => {
                setShowSwitchgearForm(false);
                fetchLocations();
              }}
            />
            <button
              className="mt-2 text-sm text-gray-600 hover:underline"
              onClick={() => setShowSwitchgearForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
