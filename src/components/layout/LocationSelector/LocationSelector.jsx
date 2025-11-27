import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const LocationSelector = () => {
  const [location, setLocation] = useState("New York, NY");

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setLocation("Đang định vị...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode here
          setLocation(`Vĩ độ: ${position.coords.latitude.toFixed(2)}, Kinh độ: ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          setLocation("Bị từ chối quyền");
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition" onClick={handleLocateMe}>
      <MapPin size={14} className="text-orange-500" />
      <span className="truncate max-w-[150px]">{location}</span>
    </div>
  );
};

export default LocationSelector;