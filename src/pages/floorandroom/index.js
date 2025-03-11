import { useState, useEffect } from 'react';
import Layout from '../../components/layout';

export default function RoomsLocations() {
  const [locations, setLocations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [locationName, setLocationName] = useState('');
  const [locationFloor, setLocationFloor] = useState('');
  const [area, setArea] = useState('');
  const [remarks, setRemarks] = useState('');

  const [roomName, setRoomName] = useState('');
  const [roomArea, setRoomArea] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [editingLocation, setEditingLocation] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchLocations();
    fetchRooms();
  }, []);

  const fetchLocations = async () => {
    const response = await fetch('/api/floorandroom?type=locations');
    const data = await response.json();
    setLocations(data);
  };

  const fetchRooms = async () => {
    const response = await fetch('/api/floorandroom?type=rooms');
    const data = await response.json();
    setRooms(data);
  };

  const handleCreateLocation = async () => {
    const requestData = { locationName, locationFloor, area, remarks };

    const response = await fetch('/api/floorandroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'location', ...requestData }),
    });

    if (response.ok) {
      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      clearLocationForm();
    }
  };

  const handleCreateRoom = async () => {
    const requestData = {
      roomName,
      area: roomArea,
      locationId: selectedLocation,
      tenantId: tenantId || null,
    };

    const response = await fetch('/api/floorandroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'room', ...requestData }),
    });

    if (response.ok) {
      const newRoom = await response.json();
      setRooms([...rooms, newRoom]);
      clearRoomForm();
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setEditingRoom(null); // Ensure room edit form is not shown
    setLocationName(location.locationName);
    setLocationFloor(location.locationFloor);
    setArea(location.area);
    setRemarks(location.remarks);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setEditingLocation(null); // Ensure location edit form is not shown
    setRoomName(room.roomName);
    setRoomArea(room.area);
    setTenantId(room.tenantId);
    setSelectedLocation(room.locationId);
  };

  const handleUpdateLocation = async () => {
    const updatedLocation = {
      id: editingLocation.id,
      locationName,
      locationFloor,
      area,
      remarks,
    };

    const response = await fetch('/api/floorandroom', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'location', ...updatedLocation }),
    });

    if (response.ok) {
      const updatedLocationData = await response.json();
      setLocations(locations.map((loc) => (loc.id === updatedLocation.id ? updatedLocationData : loc)));
      clearLocationForm();
      setEditingLocation(null);
    }
  };

  const handleUpdateRoom = async () => {
    const updatedRoom = {
      id: editingRoom.id,
      roomName,
      area: roomArea,
      locationId: selectedLocation,
      tenantId: tenantId || null,
    };

    const response = await fetch('/api/floorandroom', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'room', ...updatedRoom }),
    });

    if (response.ok) {
      const updatedRoomData = await response.json();
      setRooms(rooms.map((rm) => (rm.id === updatedRoom.id ? updatedRoomData : rm)));
      clearRoomForm();
      setEditingRoom(null);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    // Check if there are any rooms associated with the location
    const roomsInLocation = rooms.filter((room) => room.locationId === locationId);
  
    if (roomsInLocation.length > 0) {
      // Show a popup message if rooms exist in the location
      alert('Cannot delete location. You need to delete its rooms first.');
    } else {
      // Proceed with deletion if no rooms are associated with the location
      const response = await fetch(`/api/floorandroom?type=location&id=${locationId}`, { method: 'DELETE' });
  
      if (response.ok) {
        setLocations(locations.filter((loc) => loc.id !== locationId));
      } else {
        alert('Failed to delete location');
      }
    }
  };
  
  const handleDeleteRoom = async (roomId) => {
    const response = await fetch(`/api/floorandroom?type=room&id=${roomId}`, { method: 'DELETE' });

    if (response.ok) {
      setRooms(rooms.filter((rm) => rm.id !== roomId));
    }
  };

  const clearLocationForm = () => {
    setLocationName('');
    setLocationFloor('');
    setArea('');
    setRemarks('');
    setEditingLocation(null); // Hide the edit form

  };

  const clearRoomForm = () => {
    setRoomName('');
    setRoomArea('');
    setTenantId('');
    setSelectedLocation('');
    setEditingRoom(null); // Hide the edit form

  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Locations and Rooms</h1>

        {/* Location Creation Form */}
        {!editingLocation && !editingRoom && (
          <div className="mb-4">
            <h2 className="text-xl mb-2">Create Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Location Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Location Floor"
                value={locationFloor}
                onChange={(e) => setLocationFloor(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button
              onClick={handleCreateLocation}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Location
            </button>
          </div>
        )}

        {/* Room Creation Form */}
        {!editingLocation && !editingRoom && (
          <div className="mb-4">
            <h2 className="text-xl mb-2">Create Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Room Area"
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
              />
              <select
                className="border p-2 rounded"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="border p-2 rounded mt-2"
              type="text"
              placeholder="Tenant ID (Optional)"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
            <button
              onClick={handleCreateRoom}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Room
            </button>
          </div>
        )}

        {/* Edit Location Form */}
        {editingLocation && !editingRoom && (
          <div className="mt-6">
            <h2 className="text-xl mb-2">Edit Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Location Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Location Floor"
                value={locationFloor}
                onChange={(e) => setLocationFloor(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <button
              onClick={handleUpdateLocation}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Update Location
            </button>
            <button
              onClick={clearLocationForm}
              className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Edit Room Form */}
        {editingRoom && !editingLocation && (
          <div className="mt-6">
            <h2 className="text-xl mb-2">Edit Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Room Area"
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
              />
              <select
                className="border p-2 rounded"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="border p-2 rounded mt-2"
              type="text"
              placeholder="Tenant ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
            <button
              onClick={handleUpdateRoom}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Update Room
            </button>
            <button
              onClick={clearRoomForm}
              className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Display Locations */}
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Locations</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Floor</th>
                <th className="border border-gray-300 p-2">Area</th>
                <th className="border border-gray-300 p-2">Remarks</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td className="border border-gray-300 p-2">{loc.locationName}</td>
                  <td className="border border-gray-300 p-2">{loc.locationFloor}</td>
                  <td className="border border-gray-300 p-2">{loc.area}</td>
                  <td className="border border-gray-300 p-2">{loc.remarks}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditLocation(loc)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display Rooms */}
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Rooms</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Area</th>
                <th className="border border-gray-300 p-2">Tenant ID</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="border border-gray-300 p-2">{room.roomName}</td>
                  <td className="border border-gray-300 p-2">{room.area}</td>
                  <td className="border border-gray-300 p-2">{room.tenantId || '-'}</td>
                  <td className="border border-gray-300 p-2">
                    {locations.find((loc) => loc.id === room.locationId)?.locationName || 'Unknown'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
