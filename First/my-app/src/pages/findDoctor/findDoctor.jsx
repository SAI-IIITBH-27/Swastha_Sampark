import React, { useState } from 'react';
import HarmonyNav from '../../layouts/Navbar';

const doctors = [
  {
    id: 1,
    name: 'Marlina Situmorang M.Psi',
    specialty: 'Psychologist',
    location: 'RS. Rawa Lumbu, Bekasi Timur, Bekasi',
    type: 'Full-time',
    fee: '250k - 350k',
    rating: '94%',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9jdG9yfGVufDB8fDB8fHww',
  },
  {
    id: 2,
    name: 'Tatiana Bergson M.Psi',
    specialty: 'Psychologist',
    location: 'Jakarta Clinic, South Jakarta',
    type: 'Part-time',
    fee: '300k - 400k',
    rating: '96%',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9jdG9yfGVufDB8fDB8fHww',
  },
  {
    id: 3,
    name: 'Tatiana Bergson M.Psi',
    specialty: 'Psychologist',
    location: 'Jakarta Clinic, South Jakarta',
    type: 'Part-time',
    fee: '300k - 400k',
    rating: '96%',
    image: 'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9jdG9yfGVufDB8fDB8fHww',
  },
  {
    id: 4,
    name: 'Tatiana Bergson M.Psi',
    specialty: 'Psychologist',
    location: 'Jakarta Clinic, South Jakarta',
    type: 'Part-time',
    fee: '300k - 400k',
    rating: '96%',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 5,
    name: 'Tatiana Bergson M.Psi',
    specialty: 'Psychologist',
    location: 'Jakarta Clinic, South Jakarta',
    type: 'Part-time',
    fee: '300k - 400k',
    rating: '96%',
    image: 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const FindDoctor = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All Location');

  return (
    <>
      <HarmonyNav />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section with Background Video */}
        <div className="relative h-[80vh] text-white overflow-hidden flex items-center justify-center px-4">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/findDocVid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

          {/* Hero Content */}
          <div className="relative z-20 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2">
              Make Appointments Easy and Fast
            </h1>
            <p className="text-lg">
              Telemedicine services are ready to help you live healthier
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <select
                className="p-3 rounded-md text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>All Location</option>
                <option>Nearby</option>
                <option>Jakarta</option>
                <option>Bekasi</option>
                <option>Bandung</option>
              </select>
              <input
                className="p-3 rounded-md text-gray-700 w-full sm:w-80"
                type="text"
                placeholder="Search by specialization"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Select City</h3>
            <ul className="space-y-2 text-gray-700">
              {['All Location', 'Nearby', 'Jakarta', 'Bekasi', 'Bandung'].map((city) => (
                <li key={city}>
                  <label>
                    <input
                      type="radio"
                      name="location"
                      checked={location === city}
                      onChange={() => setLocation(city)}
                    />{' '}
                    {city}
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          {/* Doctor List */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Search Results for{' '}
                <span className="text-green-600">
                  {query || 'Psychologist'}
                </span>
              </h2>
              <button
                className="text-sm text-gray-600 underline"
                onClick={() => {
                  setQuery('');
                  setLocation('All Location');
                }}
              >
                Reset Filter
              </button>
            </div>
            <div className="space-y-6">
              {doctors
                .filter((doc) =>
                  doc.specialty.toLowerCase().includes(query.toLowerCase())
                )
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center bg-white shadow p-4 rounded-lg"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-bold">
                        {doc.name}{' '}
                        <span className="text-blue-500 text-sm ml-2">
                          {doc.specialty}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600">{doc.location}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="mr-2">{doc.type}</span>
                        <span className="mr-2">{doc.fee}</span>
                        <span>{doc.rating} ⭐</span>
                      </div>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Contact Now
                    </button>
                  </div>
                ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default FindDoctor;
